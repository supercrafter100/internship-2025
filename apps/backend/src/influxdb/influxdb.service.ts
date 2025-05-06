import { Injectable } from '@nestjs/common';
import { InfluxDB, WriteApi, Point } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxdbService {
  //Credentials
  private url = process.env.INFLUXDB_URL!;
  private token = process.env.INFLUXDB_TOKEN!;
  private org = process.env.INFLUXDB_ORGANISATION!;
  private client: InfluxDB;

  public async queryData(fluxQuery: string): Promise<string[]> {
    let client = new InfluxDB({ url: this.url, token: this.token });
    let result: any[] = [];

    for await (const { values, tableMeta } of client
      .getQueryApi(this.org)
      .iterateRows(fluxQuery)) {
      result.push(tableMeta.toObject(values));
    }

    return result;
  }
}
