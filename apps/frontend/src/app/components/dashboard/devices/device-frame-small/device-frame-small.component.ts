import { Component, Input } from '@angular/core';
import { DeviceType } from '../../../../../types/types';

@Component({
  selector: 'app-device-frame-small',
  standalone: false,
  templateUrl: './device-frame-small.component.html',
  styleUrl: './device-frame-small.component.css',
})
export class DeviceFrameSmallComponent {
  @Input() Id: string = '';
  @Input() Type: String = '';
  @Input() Online: Boolean = true;
  @Input() Date: string = '';
  @Input() Name: string = '';
  @Input() Imgurl: string = '';
  @Input() Description: string = '';
  @Input() Lat: string = '';
  @Input() Long: string = '';
  @Input() Creator: string = 'Xander Van Raemdonck';

  public getCreatorUrl(): string {
    return `https://api.dicebear.com/5.x/initials/png?seed=${this.Creator.replaceAll(' ', '+')}`;
  }
}
