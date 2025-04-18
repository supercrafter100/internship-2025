import mqtt from "mqtt";
import { config } from "../config";

export class MqttTtnService {
  private client;

  constructor() {
    const appId = config.ttn.appId; // Dit is je App ID in TTN
    const apiKey = config.ttn.apiKey; // Dit is je API key in TTN

    this.client = mqtt.connect(config.ttn.appUrl, {
      username: appId,
      password: apiKey,
    });

    this.client.on("connect", () => {
      console.log("✅ TTN verbonden");
      const topic = `v3/${appId}@ttn/devices/+/up`;
      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error("❌ TTN subscribe fout:", err.message);
        } else {
          console.log(`📡 TTN subscribed op ${topic}`);
        }
      });
    });

    this.client.on("message", (topic, message) => {
      const payload = JSON.parse(message.toString());
      const deviceId = payload.end_device_ids.device_id;
      const decoded = payload.uplink_message.decoded_payload;
      console.log(`📥 TTN data van ${deviceId}:`, decoded);
    });
  }
}
