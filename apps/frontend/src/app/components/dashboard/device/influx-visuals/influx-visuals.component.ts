import { Component, Input, OnInit } from '@angular/core';
import { VisualComponent } from '../visualComponent';
import { Device } from '../../../../Interfaces/iDevice';
import { DeviceService } from '../../../../services/device.service';
import * as Highcharts from 'highcharts';
import HighchartsBoost from 'highcharts/modules/boost';
typeof HighchartsBoost === 'function' && HighchartsBoost(Highcharts);
import 'highcharts/modules/boost';

type DeviceParameter = Partial<{
  deviceId: string;
  name: string;
  description: string;
}>;

@Component({
  selector: 'app-influx-visuals',
  standalone: false,
  templateUrl: './influx-visuals.component.html',
  styleUrl: './influx-visuals.component.css',
})
export class InfluxVisualsComponent implements VisualComponent, OnInit {
  @Input({ required: true }) device!: Device;

  public loaded = false;

  public highcharts: typeof Highcharts = Highcharts;
  public chartOptsMap = new Map<string, Highcharts.Options>();

  public selectedTimeRange: string = '1440';
  public selectedTimeStart: string = '';
  public selectedTimeEnd: string = '';
  public data: Record<string, number>[] = [];
  public keys: string[] = [];
  public deviceParameters: DeviceParameter[] = [];

  constructor(private readonly deviceService: DeviceService) {}

  public updateSelectedTimeRange() {
    const minutesBackInTime = parseInt(this.selectedTimeRange);

    // Calculate the time range
    const now = new Date();
    const then = new Date(now.getTime() - minutesBackInTime * 60000);

    // Update time ranges
    this.selectedTimeStart =
      then.getFullYear() +
      '-' +
      (then.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      then.getDate().toString().padStart(2, '0');
    this.selectedTimeEnd =
      now.getFullYear() +
      '-' +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      '-' +
      now.getDate().toString().padStart(2, '0');

    this.updateGraps();
  }

  public async updateGraps() {
    let minutesBackInTime = 0;
    if (this.selectedTimeRange === 'custom') {
      const dateStart = new Date(this.selectedTimeStart);
      const dateEnd = new Date(this.selectedTimeEnd);

      // Calculate minutes between the two
      const diff = dateEnd.getTime() - dateStart.getTime();
      minutesBackInTime = Math.round(diff / 1000 / 60);
    } else {
      minutesBackInTime = parseInt(this.selectedTimeRange);
    }

    // Calculate the time range
    const now = new Date();
    const then = new Date(now.getTime() - minutesBackInTime * 60000);

    // Fetch the data from the device service
    const data = await this.deviceService.getReadings<Record<string, number>[]>(
      this.device.id,
      this.toISO8601(then.toString()),
      this.toISO8601(now.toString()),
    );
    this.loaded = true;
    this.data = data;
    if (!data || data.length === 0) {
      console.error('No data found for the selected time range.');
      return;
    }

    const fullKeyList = Object.keys(data[0]);
    this.keys = fullKeyList.filter(
      (key) => !['result', 'table', '_time'].includes(key),
    );

    for (const k of this.keys) {
      this.chartOptsMap.set(k, this.getChartOptions(k));
    }
  }

  public onSelectedTimeChange() {
    this.selectedTimeRange = 'custom';
  }

  async ngOnInit(): Promise<void> {
    this.updateSelectedTimeRange();
    this.updateGraps();

    // Fetch device parameters
    this.deviceParameters = await this.deviceService.getDeviceParameters(
      this.device.id,
    );
    this.chartOptsMap.clear();
  }

  public getChartOptions(measurementKey: string): Highcharts.Options {
    const opt: Highcharts.Options = {
      chart: {
        zooming: {
          type: 'x',
        },
        panKey: 'shift',
      },

      boost: {
        useGPUTranslations: true,
      },

      title: {
        text: this.capitalizeFirstLetter(
          this.deviceParameters.find((p) => p.name === measurementKey)
            ?.description || measurementKey,
        ),
      },

      tooltip: {
        valueDecimals: 2,
      },

      xAxis: {
        type: 'datetime',
      },
      legend: {
        enabled: false,
      },
      series: [
        {
          type: 'spline',
          data: this.data.map((item) => [
            new Date(item['_time']).getTime(),
            item[measurementKey],
          ]),
          lineWidth: 1,
          marker: {
            enabled: false,
          },
        },
      ],
      time: {
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      credits: {
        enabled: false,
      },
    };

    this.chartOptsMap.set(measurementKey, opt);
    return opt;
  }

  public getOptions(measurementKey: string) {
    return (
      this.chartOptsMap.get(measurementKey) ||
      this.getChartOptions(measurementKey)
    );
  }

  public getLastMeasurements() {
    if (this.data.length === 0) {
      return [];
    }

    // Get the last measurement for each key
    const lastMeasurements: { name: string; value: string }[] = [];
    for (const key of this.keys) {
      const lastMeasurement = this.data[this.data.length - 1][key];
      if (lastMeasurement !== undefined) {
        lastMeasurements.push({
          name:
            this.deviceParameters.find((p) => p.name === key)?.description ||
            key,
          value: (Math.round(lastMeasurement * 1000) / 1000).toString(),
        });
      } else {
        console.warn(`No measurement found for key: ${key}`);
      }
    }

    return lastMeasurements;
  }

  toISO8601(strDate: string): string {
    const date = new Date(strDate);

    return date.toISOString();
  }

  capitalizeFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  trackByFn(index: number, itm: string): string {
    return itm;
  }
}
