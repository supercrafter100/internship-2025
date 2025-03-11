import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateProjectStepsComponent } from './pages/create-project/steps/steps.component';

export const routes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
    //canActivate: [canActivateAuthRole],
    //data: { roles: ['Gebruiker'] },
  },
  {
    path: 'create-project/:step',
    component: CreateProjectStepsComponent,
  },
];
