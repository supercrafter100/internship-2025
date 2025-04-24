import mqtt, { MqttClient } from "mqtt";
import { config } from "../config";
import { query as Query } from "../db";
import { InfluxDB, Point } from "@influxdata/influxdb-client";
import winston from "winston";

// InfluxDB connectie
const influx = new InfluxDB({
  url: config.influx.url,
  token: config.influx.token,
});
const writeApi = influx.getWriteApi(
  config.influx.organization,
  config.influx.bucket
);

// Logger configuratie
const logger = winston.createLogger({
  level: "info",
  format: winston.format.simple(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "combined.log" }),
  ],
});

export class MqttTtnService {
  private client: MqttClient;
  private deviceCache: Record<
    string,
    { parameters: any[]; expiresAt: number }
  > = {};
  private cacheExpiry = 1000 * 60 * 60; // 1 uur

  constructor({
    appId,
    apiKey,
    appUrl,
  }: {
    appId: string;
    apiKey: string;
    appUrl: string;
  }) {
    this.client = mqtt.connect(appUrl, {
      username: appId,
      password: apiKey,
    });

    this.client.on("connect", () => {
      logger.info(`✅ Verbonden met TTN-server voor ${appId}`);
      const topic = `v3/${appId}@ttn/devices/+/up`;
      this.client.subscribe(topic, (err) => {
        if (err) {
          logger.error(`❌ Fout bij subscriben voor ${appId}: ${err.message}`);
        } else {
          logger.info(`📡 Subscribed op ${topic}`);
        }
      });
    });

    this.client.on("message", async (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const deviceId = payload.end_device_ids.device_id;
        const encodedMessage = payload.uplink_message.frm_payload;
        let decodedMessage = Buffer.from(encodedMessage, "base64").toString(
          "utf-8"
        );
        logger.info(`📥 Bericht ontvangen van ${deviceId}: ${decodedMessage}`);

        const parameters = await this.getDeviceParameters(deviceId);
        if (!parameters.length) {
          logger.warn(`⚠️ Geen configuratie gevonden voor device ${deviceId}`);
          return;
        }

        // Decoded message dividing by 100 because TTN gives values in centi-units
        const decodedMessageParts = decodedMessage.split(",");
        const decodedMessagePartsFloat = decodedMessageParts.map((part) => {
          const floatValue = parseFloat(part);
          return isNaN(floatValue) ? part : (floatValue / 100).toString();
        });
        decodedMessage = decodedMessagePartsFloat.join(",");

        // Logging decoded message
        logger.info(`📥 Gedecodeerd bericht: ${decodedMessage}`);

        // Try to save decoded message to InfluxDB
        const parsedData = this.mapPayloadToParams(decodedMessage, parameters);
        await this.storeInInflux(deviceId, parsedData);
      } catch (err) {
        logger.error("❌ Fout bij verwerken TTN bericht:", err);
      }
    });

    this.client.on("error", (err) =>
      logger.error(`❌ MQTT fout (${appId}): ${err.message}`)
    );
  }

  public disconnect() {
    this.client.end(true, () => {
      logger.info("🔌 TTN-client ontkoppeld");
    });
  }

  private async getDeviceParameters(deviceId: string) {
    if (
      this.deviceCache[deviceId] &&
      Date.now() < this.deviceCache[deviceId].expiresAt
    ) {
      logger.info(`📦 Parameters uit cache voor ${deviceId}`);
      return this.deviceCache[deviceId].parameters;
    }

    try {
      const result = await Query(
        `SELECT name FROM "deviceParameters" WHERE "deviceId" = $1`,
        [deviceId]
      );

      if (!result.length) {
        return [];
      }

      this.deviceCache[deviceId] = {
        parameters: result,
        expiresAt: Date.now() + this.cacheExpiry,
      };

      logger.info(`📦 Parameters gecachet voor ${deviceId}`);
      return result;
    } catch (error) {
      logger.error("❌ Fout bij ophalen van parameters uit database:", error);
      return [];
    }
  }

  private mapPayloadToParams(payload: string, parameters: any[]) {
    const values = payload.split(",");
    const mappedData: Record<string, any> = {};

    parameters.forEach((param, index) => {
      mappedData[param.name] = values[index] || null;
    });

    return mappedData;
  }

  private async storeInInflux(deviceId: string, data: Record<string, any>) {
    const point = new Point("mqtt_data")
      .tag("device_id", deviceId)
      .timestamp(new Date());

    Object.entries(data).forEach(([key, value]) => {
      if (!isNaN(Number(value))) {
        point.floatField(key, Number(value));
      } else {
        point.stringField(key, value);
      }
    });

    try {
      await writeApi.writePoint(point);
      logger.info(`📊 Data opgeslagen in Influx voor device ${deviceId}`);
    } catch (error) {
      logger.error(
        `❌ Fout bij schrijven naar Influx voor ${deviceId}:`,
        error
      );
    }
  }
}
