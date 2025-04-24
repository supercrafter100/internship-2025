import { Component, Input, OnInit } from '@angular/core';
import { VisualComponent } from '../visualComponent';
import { Device } from '../../../../Interfaces/iDevice';
import { DeviceService } from '../../../../services/device.service';
import { MinioFile } from '../../../../../types/types';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-camera-visuals',
  standalone: false,
  templateUrl: './camera-visuals.component.html',
  styleUrl: './camera-visuals.component.css',
})
export class CameraVisualsComponent implements VisualComponent, OnInit {
  @Input({ required: true }) device!: Device;

  public loaded = false;
  public videos: MinioFile[] = [];
  public video = '';

  constructor(private readonly deviceService: DeviceService) {}

  async ngOnInit(): Promise<void> {
    const videos = await this.deviceService.getDeviceVideos(this.device.id);
    if (videos) {
      this.videos = videos;
    } else {
      console.error('No videos found for device:', this.device.id);
    }
    this.loaded = true;

    if (this.videos.length === 0) {
      console.error('No videos found for device:', this.device.id);
      return;
    }

    // Sort videos by date (newest first)
    this.videos.sort((a, b) => {
      const dateA = this.nameToDate(a.name).getTime();
      const dateB = this.nameToDate(b.name).getTime();
      return dateB - dateA; // Newest first
    });

    this.video = this.getVideoUrl(this.videos[0]);
  }

  public getVideoUrl(video: MinioFile): string {
    return environment.cdnUrl + video.name;
  }

  public formatName(name: string) {
    const fileName = name.split('/').pop() || '';
    const fileNameParts = fileName.split('_');
    const datePart = fileNameParts[1] || '';
    const timePart = fileNameParts[2] || '';

    const date =
      datePart.slice(0, 4) +
      '-' +
      datePart.slice(4, 6) +
      '-' +
      datePart.slice(6, 8);
    const time =
      timePart.slice(0, 2) +
      ':' +
      timePart.slice(2, 4) +
      ':' +
      timePart.slice(4, 6);

    return date + ' ' + time;
  }

  public nameToDate(name: string): Date {
    const fileName = name.split('/').pop() || '';
    const fileNameParts = fileName.split('_');
    const datePart = fileNameParts[1] || '';
    const timePart = fileNameParts[2] || '';

    const date =
      datePart.slice(0, 4) +
      '-' +
      datePart.slice(4, 6) +
      '-' +
      datePart.slice(6, 8) +
      'T' +
      timePart.slice(0, 2) +
      ':' +
      timePart.slice(2, 4) +
      ':' +
      timePart.slice(4, 6);

    return new Date(date);
  }

  public bytesToSize(bytes: number): string {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes === 0) return '0 Bytes';
    const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)).toString());
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }
}
