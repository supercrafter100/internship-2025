import { Injectable } from '@nestjs/common';
import { InfluxDB } from '@influxdata/influxdb-client';

@Injectable()
export class InfluxdbService {
  //Credentials
  private url = process.env.INFLUXDB_URL!;
  private token = process.env.INFLUXDB_TOKEN!;
  private org = process.env.INFLUXDB_ORGANISATION!;

  public async queryData<T>(fluxQuery: string): Promise<T[]> {
    let client = new InfluxDB({ url: this.url, token: this.token });
    let result: any[] = [];

    for await (const { values, tableMeta } of client
      .getQueryApi(this.org)
      .iterateRows(fluxQuery)) {
      result.push(tableMeta.toObject(values));
    }

    return result as T[];
  }
}
