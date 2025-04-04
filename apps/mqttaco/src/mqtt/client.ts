import mqtt from "mqtt";
import { config } from "../config";

export class MqttClient {
  private client!: mqtt.MqttClient;

  constructor(private brokerUrl: string = config.mqtt.brokerUrl!) {}

  // Functie om verbinding te maken met de broker
  connect() {
    this.client = mqtt.connect(this.brokerUrl);

    this.client.on("connect", () => {
      console.log(`✅ Verbonden met MQTT broker: ${this.brokerUrl}`);
    });

    // Error handling voor fouten bij het verbinden
    this.client.on("error", (err) => {
      console.error("❌ MQTT Fout:", err);
      this.reconnect(); // Probeer opnieuw te verbinden
    });

    // Herverbinden als de client offline gaat
    this.client.on("offline", () => {
      console.log("🌐 Offline - herverbinden...");
      this.reconnect(); // Probeer opnieuw te verbinden
    });

    // Handle de situatie wanneer de verbinding verloren gaat
    this.client.on("close", () => {
      console.log("❌ Verbinding met broker verloren");
      this.reconnect(); // Probeer opnieuw te verbinden
    });
  }

  // Reconnect logica: probeert opnieuw verbinding te maken
  reconnect() {
    if (!this.client.connected) {
      console.log("🔄 Probeer opnieuw te verbinden met de MQTT-broker...");
      this.client.reconnect(); // Probeer opnieuw verbinding te maken
    }
  }

  // Abonneer op een topic en geef een callback bij het ontvangen van berichten
  subscribe(
    topic: string,
    callback: (msg: string) => void,
    qos: 0 | 1 | 2 = 0
  ) {
    this.client.subscribe(topic, { qos }, (err) => {
      if (err) {
        console.error(`❌ Fout bij abonneren op '${topic}':`, err);
      } else {
        console.log(`📡 Geabonneerd op '${topic}' met QoS ${qos}`);
      }
    });

    this.client.on("message", (receivedTopic, message) => {
      if (receivedTopic === topic) {
        callback(message.toString());
      }
    });
  }

  // // Publish berichten naar een specifiek topic met QoS
  // publish(topic: string, message: string, qos: 0 | 1 | 2 = 0) {
  //     if (this.client.connected) {
  //       this.client.publish(topic, message, { qos });
  //     } else {
  //       console.error("❌ Kan niet publiceren, geen verbinding met de broker");
  //     }
  //   }
}
