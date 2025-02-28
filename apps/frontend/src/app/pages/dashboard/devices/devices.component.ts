import { Component } from '@angular/core';
import { useGeographic } from 'ol/proj';
import Map from 'ol/Map';
import Overlay from 'ol/Overlay';

useGeographic();

@Component({
  selector: 'app-devices',
  standalone: false,
  templateUrl: './devices.component.html',
  styleUrl: './devices.component.css',
})
export class DevicesComponent {
  public map!: Map;
}
