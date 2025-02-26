import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { canActivateAuthRole } from './guards/app-auth.guard';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'create-project',
    component: CreateProjectComponent,
    // canActivate: [canActivateAuthRole],
    // data: { roles: ['PlatformOwner'] },
  },
];
