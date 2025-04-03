import { MqttClient } from "./mqtt/client";
import { MqttSubscriber } from "./mqtt/subscriber";

const client = new MqttClient();
client.connect();

const subscriber = new MqttSubscriber();
subscriber.subscribeToTopic("router/1", 2);
