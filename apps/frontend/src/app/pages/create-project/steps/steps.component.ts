import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateProjectFirstStep } from '../first/first.component';
import { CreateProjectSecondStep } from '../second/second.component';

@Component({
  selector: 'app-create-project-steps',
  standalone: false,
  templateUrl: './steps.component.html',
  styleUrl: './steps.component.css',
})
export class CreateProjectStepsComponent implements OnInit {
  public step = 0;
  public steps = [
    {
      title: 'Project information',
      description: 'Fill in the details of a new project.',
      component: CreateProjectFirstStep,
    },
    {
      title: 'Project story',
      description: 'Fill in the project story.',
      component: CreateProjectSecondStep,
    },
    {
      title: 'Compose launchpad',
      description: 'Form your launchpad as you wish.',
      component: CreateProjectFirstStep,
    },
    {
      title: 'Finish',
      description: undefined,
      component: CreateProjectFirstStep,
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const stepNumber = params['step'];
      this.step = parseInt(stepNumber) - 1;
    });
  }

  public prevStep() {
    if (this.step > 0) {
      this.router.navigate(['/create-project', this.step--]);
    } else {
      this.router.navigate(['/create-project']);
    }
  }
}
