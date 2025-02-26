import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { CreateProjectStepsComponent } from './pages/create-project/steps/steps.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
  },
  {
    path: 'create-project/:step',
    component: CreateProjectStepsComponent,
  },
];
