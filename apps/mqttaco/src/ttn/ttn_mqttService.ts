import mqtt, { MqttClient } from "mqtt";

export class MqttTtnService {
  private client: MqttClient;

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
      console.log(`✅ Verbonden met TTN-server voor ${appId}`);
      const topic = `v3/${appId}@ttn/devices/+/up`;

      this.client.subscribe(topic, (err) => {
        if (err) {
          console.error(`❌ Fout bij subscriben voor ${appId}:`, err.message);
        } else {
          console.log(`📡 Subscribed op ${topic}`);
        }
      });
    });

    this.client.on("message", (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const deviceId = payload.end_device_ids.device_id;
        const decoded = payload.uplink_message.decoded_payload;
        console.log(`📥 Data van ${deviceId} (${appId}):`, decoded);
      } catch (err) {
        console.error(`❌ Fout bij verwerken bericht (${appId}):`, err);
      }
    });

    this.client.on("error", (err) => {
      console.error(`❌ MQTT fout (${appId}):`, err.message);
    });
  }

  public disconnect() {
    this.client.end(true, () => {
      console.log("🔌 TTN-client ontkoppeld");
    });
  }
}
