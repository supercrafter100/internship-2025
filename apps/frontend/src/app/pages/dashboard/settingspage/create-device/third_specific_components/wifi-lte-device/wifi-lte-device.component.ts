import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../../../../environments/environment';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { CreateDeviceStorage } from '../../../../../../Classes/CreateDeviceStorage';
import { MqttDeviceStorage } from '../../../../../../Classes/CreateDevices/CreateMQTTDevice';

@Component({
  selector: 'app-wifi-lte-device',
  standalone: false,
  templateUrl: './wifi-lte-device.component.html',
  styleUrl: './wifi-lte-device.component.css',
})
export class WifiLteDeviceComponent implements OnInit {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
  ) {}
  ngOnInit(): void {
    this.topic = this.deviceStorage.deviceId;
    this.points[1].param = 'device/' + this.topic;
  }

  private mqtt: string = environment.MQTT_Server;
  private topic: string | undefined = undefined;
  private deviceStorage =
    CreateDeviceStorage.getDeviceStorage() as MqttDeviceStorage;

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

  public showModal = false;

  public confirmNavigation() {
    this.router.navigate(['../finish'], { relativeTo: this.route });
  }
}
