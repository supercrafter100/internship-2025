// test/integration/influx.integration.spec.ts
import { InfluxDB, Point } from '@influxdata/influxdb-client';

const url = process.env.INFLUX_URL!;
const token = process.env.INFLUX_TOKEN!;
const org = process.env.INFLUX_ORG!;
const bucket = process.env.INFLUX_BUCKET!;

const influxDB = new InfluxDB({ url, token });

describe('InfluxDB integration test', () => {
  it('should write and read a measurement', async () => {
    const writeApi = influxDB.getWriteApi(org, bucket, 'ns');
    const point = new Point('temperature')
      .tag('deviceId', 'sensor-123')
      .floatField('value', 23.5)
      .timestamp(new Date());

    writeApi.writePoint(point);
    await writeApi.close();

    // Query setup
    const queryApi = influxDB.getQueryApi(org);
    const fluxQuery = `
      from(bucket: "${bucket}")
        |> range(start: -5m)
        |> filter(fn: (r) => r._measurement == "temperature" and r.deviceId == "sensor-123")
        |> last()
    `;

    let resultValue: number | null = null;

    const rows = await new Promise<any[]>((resolve, reject) => {
      const results: any[] = [];
      queryApi.queryRows(fluxQuery, {
        next(row, tableMeta) {
          const o = tableMeta.toObject(row);
          results.push(o);
        },
        error(error) {
          reject(error);
        },
        complete() {
          resolve(results);
        },
      });
    });

    if (rows.length > 0) {
      resultValue = rows[0]._value;
    }

    expect(resultValue).toBeCloseTo(23.5, 1);
  });
});
