import { Component, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirstComponent } from '../first/first.component';
import { SecondComponent } from '../second/second.component';
import { LorawanComponent } from '../third_specific_components/lorawan/lorawan.component';
import { WifiLteDeviceComponent } from '../third_specific_components/wifi-lte-device/wifi-lte-device.component';
import { CameraComponent } from '../third_specific_components/camera/camera.component';
import { GatewayComponent } from '../third_specific_components/gateway/gateway.component';
import { ParameterstepComponent } from '../parameterstep/parameterstep.component';
import { FinishComponent } from '../finish/finish.component';

@Component({
  selector: 'app-steps',
  standalone: false,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
})
export class StepsComponent {
  public pages = [
    {
      step: 0,
      path: '1',
      component: FirstComponent,
    },
    {
      step: 1,
      path: '2',
      component: SecondComponent,
    },
    {
      step: 1,
      path: '2.1',
      component: ParameterstepComponent,
    },
    {
      step: 2,
      path: '3.1',
      component: LorawanComponent,
    },
    {
      step: 2,
      path: '3.2',
      component: WifiLteDeviceComponent,
    },
    {
      step: 2,
      path: '3.3',
      component: CameraComponent,
    },
    {
      step: 2,
      path: '3.4',
      component: GatewayComponent,
    },
    {
      step: 3,
      path: 'finish',
      component: FinishComponent,
    },
  ];

  public steps = [
    {
      title: 'Device information',
      description: 'Fill in the details of a new device.',
    },
    {
      title: 'Device identitity',
      description: 'Add the necessary identifiers for your device.',
    },
    {
      title: 'Device specific actions',
      description: 'Depending the device, specific actions should be executed.',
    },
    {
      title: 'Finish',
      description: undefined,
      canNavigate: false,
    },
  ];

  public step = 0;
  public pageIndex = 0;
  public component: Type<any> | null = null;
  private currentRoute = '';

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const stepNumber = params['step'];
      const page = this.pages.find((page) => page.path === stepNumber);
      if (page) {
        this.step = page.step;
        this.component = page.component;
        this.pageIndex = this.pages.indexOf(page);
      }
    });
  }

  public prevStep() {
    if (this.step > 0) {
      // Figure out the previous step
      const page = this.pages[this.pageIndex - 1];

      console.log(document.location.href);
      this.router.navigate([
        document.location.pathname.split('/create-device')[0] +
          '/create-device',
        page.path,
      ]);
    } else {
      this.router.navigate([document.location.pathname.slice(0, -2)]);
    }
  }

  public goToStep(step: number) {
    const page = this.pages.find((page) => page.step === step);
    if (page) {
      this.router.navigate(['/create-device', page.path]);
    }
  }
}
