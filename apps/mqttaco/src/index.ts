// src/index.ts
import { MqttService } from "./mqtt/mqttService";
import { MqttTtnService } from "./ttn/ttn_mqttService";

const mqttService = new MqttService();
const ttnService = new MqttTtnService();

console.log("🚀 MQTT Service gestart...");
console.log("🌐 TTN MQTT Service gestart...");
