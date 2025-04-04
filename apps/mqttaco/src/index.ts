import { MqttClient } from "./mqtt/client";
import { MqttSubscriber } from "./mqtt/subscriber";

// Client instantiation and connection
const client = new MqttClient();
client.connect();

// Subscriber instantiation and subscription to a topic
// The subscriber will listen for messages on the specified topic and log them to the console
const subscriber = new MqttSubscriber();
subscriber.subscribeToTopic("router/1", 2);
