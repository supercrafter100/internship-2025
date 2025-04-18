import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Configuratie voor MQTT, InfluxDB en PostgreSQL
export const config = {
  mqtt: {
    brokerUrl: process.env.MQTT_BROKER_URL || "",
  },
  influx: {
    url: process.env.INFLUX_DB_URL || "",
    token: process.env.INFLUX_DB_TOKEN || "",
    username: process.env.INFLUX_DB_USERNAME || "",
    password: process.env.INFLUX_DB_PASSWORD || "",
    organization: process.env.INFLUX_DB_ORG || "",
    bucket: process.env.INFLUX_DB_BUCKET || "",
  },
  database: {
    connectionString: process.env.PG_DB_URL || "",
  },
  ttn: {
    appUrl: process.env.TTN_MQTT_APP_URL || "",
    appId: process.env.TTN_MQTT_APP_ID || "",
    apiKey: process.env.TTN_MQTT_API_KEY || "",
  },
};
