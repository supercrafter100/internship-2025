import { Component, OnInit, Type } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProjectFirstStep } from '../first/first.component';
import { CreateProjectSecondStep } from '../second/second.component';
import { CreateProjectSecondInputStep } from '../second-input/second-input.component';
import { CreateProjectThirdStep } from '../third/third.component';
import { CreateProjectThirdInputStep } from '../third-input/third-input.component';
import { CreateProjectFinishStep } from '../finish/finish.component';

@Component({
  selector: 'app-create-project-steps',
  standalone: false,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
})
export class CreateProjectStepsComponent implements OnInit {
  public pages = [
    {
      step: 0,
      path: '1',
      component: CreateProjectFirstStep,
    },
    {
      step: 1,
      path: '2.1',
      component: CreateProjectSecondStep,
    },
    {
      step: 1,
      path: '2.2',
      component: CreateProjectSecondInputStep,
    },
    {
      step: 2,
      path: '3.1',
      component: CreateProjectThirdStep,
    },
    {
      step: 2,
      path: '3.2',
      component: CreateProjectThirdInputStep,
    },
    {
      step: 3,
      path: 'finish',
      component: CreateProjectFinishStep,
    },
  ];

  public steps = [
    {
      title: 'Project information',
      description: 'Fill in the details of a new project.',
    },
    {
      title: 'Project story',
      description: 'Fill in the project story.',
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
      this.router.navigate(['/create-project', page.path]);
    } else {
      this.router.navigate(['/create-project']);
    }
  }

  public goToStep(step: number) {
    const page = this.pages.find((page) => page.step === step);
    if (page) {
      this.router.navigate(['/create-project', page.path]);
    }
  }
}
