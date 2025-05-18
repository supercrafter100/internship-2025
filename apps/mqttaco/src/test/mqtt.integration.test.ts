import { InfluxDB } from "@influxdata/influxdb-client";
import { MqttService } from "../mqtt/mqttService";
import { config } from "../config";

const influx = new InfluxDB({
  url: config.influx.url,
  token: config.influx.token,
});

const queryApi = influx.getQueryApi(config.influx.organization);

describe("MQTTACO → Influx integratietest", () => {
  const service = new MqttService();
  const testDeviceId = "test-device-123";
  const testPayload = "22.4;58.2";

  beforeAll(async () => {
    // Zet eventueel testconfig, mock databasewaarden
  });

  test("Payload wordt correct naar InfluxDB geschreven", async () => {
    // ⬇️ Mock de deviceparameters voor dit testdevice
    (service as any).deviceCache[testDeviceId] = {
      parameters: [
        { name: "temperature", description: "Temperatuur" },
        { name: "humidity", description: "Vochtigheid" },
      ],
      expiresAt: Date.now() + 1000 * 60,
    };

    await (service as any).processMessage(testDeviceId, testPayload);

    // ⏱️ Wacht even zodat write effectief gebeurt
    await new Promise((r) => setTimeout(r, 1500));

    const resultRows: any[] = [];

    const fluxQuery = `
      from(bucket: "${config.influx.bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "mqtt_data")
        |> filter(fn: (r) => r.device_id == "${testDeviceId}")
        |> filter(fn: (r) => r._field == "temperature" or r._field == "humidity")
        |> last()
    `;

    await new Promise((resolve, reject) => {
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          resultRows.push(tableMeta.toObject(row));
        },
        error: reject,
        complete: () => resolve(undefined),
      });
    });

    const fields = Object.fromEntries(
      resultRows.map((row) => [row._field, row._value])
    );

    expect(fields.temperature).toBeCloseTo(22.4, 1);
    expect(fields.humidity).toBeCloseTo(58.2, 1);
  });
});
