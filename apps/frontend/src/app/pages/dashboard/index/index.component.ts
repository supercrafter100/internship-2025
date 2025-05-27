import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DeviceService } from '../../../services/device.service';
import { Device } from '../../../Interfaces/iDevice';
import { OnInit } from '@angular/core';
import { stringToColour } from '../../../../util/utils';
import { interval } from 'rxjs';

@Component({
  selector: 'app-index',
  standalone: false,
  templateUrl: './index.component.html',
  styleUrl: './index.component.css',
})
export class DashboardIndexComponent implements OnInit {
  public devices: (Device & {
    status: boolean;
    lastMeasurement: string | undefined;
  })[] = [];
  public projectId: number | null = null;
  public loading = true;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly deviceService: DeviceService,
  ) {}
  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      this.loading = true;
      this.projectId = Number(params['id']);
      await this.refetch();
      this.loading = false;
    });

    interval(5000).subscribe(() => this.refetch());
  }

  public async refetch() {
    if (this.projectId) {
      this.devices = await this.deviceService.getDashboardDevices(
        this.projectId,
      );
    }
  }

  public getTimeAgoFromTimestamp(time: string | undefined): string {
    if (time === undefined) {
      return 'never';
    }

    const now = Date.now();
    const timestamp = new Date(time).getTime();
    const diffMs = now - timestamp;

    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const MONTH = 30 * DAY; // Approximation
    const YEAR = 365 * DAY; // Approximation

    const years = Math.floor(diffMs / YEAR);
    const months = Math.floor((diffMs % YEAR) / MONTH);
    const days = Math.floor((diffMs % MONTH) / DAY);

    if (diffMs >= DAY) {
      const parts = [];
      if (years) parts.push(`${years} year${years !== 1 ? 's' : ''}`);
      if (months) parts.push(`${months} month${months !== 1 ? 's' : ''}`);
      if (days) parts.push(`${days} day${days !== 1 ? 's' : ''}`);
      return parts.join(', ') + ' ago';
    } else {
      const hours = Math.floor(diffMs / HOUR);
      const minutes = Math.floor((diffMs % HOUR) / MINUTE);
      const seconds = Math.floor((diffMs % MINUTE) / SECOND);

      const parts = [];
      if (hours) parts.push(`${hours} hour${hours !== 1 ? 's' : ''}`);
      if (minutes) parts.push(`${minutes} minute${minutes !== 1 ? 's' : ''}`);
      if (seconds || parts.length === 0)
        parts.push(`${seconds} second${seconds !== 1 ? 's' : ''}`);
      return parts.join(', ') + ' ago';
    }
  }

  public getBorderColor(deviceType: string) {
    return stringToColour(deviceType);
  }

  public numSequence(n: number): Array<number> {
    return Array(n);
  }
}
