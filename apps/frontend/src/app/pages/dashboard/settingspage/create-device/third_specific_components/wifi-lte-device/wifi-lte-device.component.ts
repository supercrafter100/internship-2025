import { Component } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-wifi-lte-device',
  standalone: false,
  templateUrl: './wifi-lte-device.component.html',
  styleUrl: './wifi-lte-device.component.css',
})
export class WifiLteDeviceComponent {
  constructor(private router: Router) {}
  private mqtt: string = environment.MQTT_Server;
  private topic: string = '550e8400-e29b-41d4-a716-446655440000';

  public points = [
    {
      title: 'MQTT Server',
      desc: 'This is the server that your device will connect to:',
      param: this.mqtt,
    },
    {
      title: 'Topic',
      desc: 'Your device will publish data to this topic:',
      param: this.topic,
    },
    {
      title: 'Finish',
      desc: 'After this configuration your device will be ready to use',
    },
  ];

  public goToStep() {
    this.router.navigate([
      [document.location.pathname.slice(0, -2)] + '/finish',
    ]);
  }
}
