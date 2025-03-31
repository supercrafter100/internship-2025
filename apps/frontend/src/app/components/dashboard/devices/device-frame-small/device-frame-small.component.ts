import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-device-frame-small',
  standalone: false,
  templateUrl: './device-frame-small.component.html',
  styleUrl: './device-frame-small.component.css',
})
export class DeviceFrameSmallComponent {
  @Input() Type: string = '';
  @Input() Added: string = '';
  @Input() Name: string = '';
  @Input() Imgurl: string = '';
  @Input() Description: string = '';
  @Input() Lat: string = '';
  @Input() Long: string = '';
}
