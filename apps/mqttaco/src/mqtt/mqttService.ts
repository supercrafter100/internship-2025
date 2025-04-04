import mqtt from "mqtt";
import { config } from "../config";
import { query } from "../db";
import { InfluxDB, Point } from "@influxdata/influxdb-client";

// InfluxDB connectie
const influx = new InfluxDB({
  url: config.influx.url,
  token: config.influx.token,
});
const writeApi = influx.getWriteApi(
  config.influx.organization,
  config.influx.bucket
);

export class MqttService {
  private client: mqtt.MqttClient;

  constructor() {
    this.client = mqtt.connect(config.mqtt.brokerUrl);
    this.setupListeners();
  }

  private setupListeners() {
    this.client.on("connect", () => {
      console.log("✅ Verbonden met MQTT broker");
      this.client.subscribe("device/+");
    });

    this.client.on("message", async (topic, message) => {
      const deviceId = topic.split("/")[1]; // Haalt ID uit topic
      console.log(
        `📩 Bericht ontvangen van device ${deviceId}:`,
        message.toString()
      );

      await this.processMessage(deviceId, message.toString());
    });

    this.client.on("error", (err) => console.error("❌ MQTT Fout:", err));
    this.client.on("offline", () =>
      console.log("🌐 MQTT offline, herverbinden...")
    );
    this.client.on("close", () => console.log("❌ MQTT Verbinding gesloten"));
  }

  private async processMessage(deviceId: string, payload: string) {
    try {
      const parameters = await this.getDeviceParameters(deviceId);
      if (!parameters.length) {
        console.warn(`⚠️ Geen configuratie gevonden voor device ${deviceId}`);
        return;
      }

      // Parse inkomende data en map deze correct
      const parsedData = this.mapPayloadToParams(payload, parameters);

      // Sla op in InfluxDB
      await this.storeInInflux(deviceId, parsedData);
    } catch (error) {
      console.error("🚨 Fout bij verwerken van bericht:", error);
    }
  }

  private async getDeviceParameters(deviceId: string) {
    const result = await query(
      `SELECT "deviceParameters" FROM "Device" WHERE id = $1`,
      [deviceId]
    );

    console.log("📦 Device parameters:", result);

    if (!result.length || !result[0].deviceParameters) {
      return [];
    }

    console.log("📦 Device parameters:", result[0].deviceParameters);

    return result[0].deviceParameters || [];
  }

  private mapPayloadToParams(payload: string, parameters: any[]) {
    const values = payload.split(","); // Aannemend dat de payload CSV is
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

    writeApi.writePoint(point);
    console.log(`📊 Data opgeslagen in Influx voor device ${deviceId}`);
  }
}
