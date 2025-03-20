import { Component, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FirstComponent } from '../first/first.component';
import { SecondComponent } from '../second/second.component';

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
      title: 'Compose launchpad',
      description: 'Form your launchpad as you wish.',
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
