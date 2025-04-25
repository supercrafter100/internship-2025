import mqtt from "mqtt";
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

export class MqttService {
  private client: mqtt.MqttClient;
  private deviceCache: Record<
    string,
    { parameters: any[]; expiresAt: number }
  > = {}; // Cache voor device parameters
  private cacheExpiry: number = 1000 * 60 * 60; // 1 uur vervaldatum voor cache

  constructor() {
    this.client = mqtt.connect(config.mqtt.brokerUrl);
    this.setupListeners();
  }

  private setupListeners() {
    this.client.on("connect", () => {
      logger.info("✅ Verbonden met MQTT broker");
      this.client.subscribe("device/+");
    });

    this.client.on("message", async (topic, message) => {
      const deviceId = topic.split("/")[1]; // Haalt ID uit topic
      logger.info(
        `📩 Bericht ontvangen van device ${deviceId}: ${message.toString()}`
      );
      await this.processMessage(deviceId, message.toString());
    });

    this.client.on("error", (err) => logger.error("❌ MQTT Fout:", err));
    this.client.on("offline", () =>
      logger.info("🌐 MQTT offline, herverbinden...")
    );
    this.client.on("close", () => logger.info("❌ MQTT Verbinding gesloten"));
  }

  private async processMessage(deviceId: string, payload: string) {
    try {
      const parameters = await this.getDeviceParameters(deviceId);
      if (!parameters.length) {
        logger.warn(`⚠️ Geen configuratie gevonden voor device ${deviceId}`);
        return;
      }

      const parsedData = this.mapPayloadToParams(payload, parameters);
      await this.storeInInflux(deviceId, parsedData);
    } catch (error) {
      logger.error("🚨 Fout bij verwerken van bericht:", error);
    }
  }

  private async getDeviceParameters(deviceId: string) {
    if (
      this.deviceCache[deviceId] &&
      Date.now() < this.deviceCache[deviceId].expiresAt
    ) {
      logger.info(`📦 Device parameters uit cache voor device ${deviceId}`);
      return this.deviceCache[deviceId].parameters;
    }

    try {
      const result = await this.retryQuery(
        `SELECT name, description FROM "deviceParameters" WHERE "deviceId" = $1`,
        [deviceId]
      );

      if (!result.length) {
        return [];
      }

      this.deviceCache[deviceId] = {
        parameters: result,
        expiresAt: Date.now() + this.cacheExpiry,
      };

      logger.info(
        `📦 Device parameters opgeslagen in cache voor device ${deviceId}`
      );
      return result;
    } catch (error) {
      logger.error(
        "🚨 Fout bij ophalen device parameters uit database:",
        error
      );
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

    Object.keys(data).forEach((key) => {
      if (!isNaN(Number(data[key]))) {
        point.floatField(key, Number(data[key]));
      } else {
        point.stringField(key, data[key]);
      }
    });

    try {
      await writeApi.writePoint(point);
      logger.info(
        `📊 Data succesvol opgeslagen in Influx voor device ${deviceId}`
      );
    } catch (error) {
      logger.error(
        `🚨 Fout bij opslaan in Influx voor device ${deviceId}:`,
        error
      );
    }
  }

  private async retryQuery(query: string, params: any[], retries: number = 3) {
    let attempt = 0;
    let error: any;
    while (attempt < retries) {
      try {
        return await Query(query, params);
      } catch (err) {
        error = err;
        attempt++;
        if (attempt < retries) {
          logger.warn(`🌀 Poging ${attempt} mislukte, probeer opnieuw...`);
        } else {
          logger.error(`❌ Fout na ${retries} pogingen:`, error);
        }
      }
    }
    throw error;
  }
}
