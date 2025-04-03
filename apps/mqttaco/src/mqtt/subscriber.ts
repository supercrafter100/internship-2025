import { MqttClient } from "./client";

export class MqttSubscriber {
  private client: MqttClient;

  constructor() {
    this.client = new MqttClient();
    this.client.connect();
  }

  subscribeToTopic(topic: string, qos: 0 | 1 | 2 = 0) {
    this.client.subscribe(
      topic,
      (message) => {
        console.log(`📥 Ontvangen bericht op '${topic}':`, message);
      },
      qos
    );
  }
}
