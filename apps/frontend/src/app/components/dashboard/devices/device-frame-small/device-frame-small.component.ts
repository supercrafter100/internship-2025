import { Component, Input } from '@angular/core';
import { DeviceType } from '../../../../../types/types';

@Component({
  selector: 'app-device-frame-small',
  standalone: false,
  templateUrl: './device-frame-small.component.html',
  styleUrl: './device-frame-small.component.css',
})
export class DeviceFrameSmallComponent {
  @Input() Type: String = '';
  @Input() Online: Boolean = true;
  @Input() Date: string = '';
  @Input() Name: string = '';
  @Input() Imgurl: string = '';
  @Input() Description: string = '';
  @Input() Lat: string = '';
  @Input() Long: string = '';
  @Input() Creator: string = 'Xander Van Raemdonck';
  @Input() CreatorImgUrl: string =
    'https://images.unsplash.com/photo-1500522144261-ea64433bbe27?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=751&q=80';
}
