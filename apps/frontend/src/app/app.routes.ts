import { Routes } from '@angular/router';
import { HomeComponent } from './pages/project/home/home.component';
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { CreateProjectStepsComponent } from './pages/project/create-project/steps/steps.component';
import { ProjectInfoComponent } from './pages/project/project-info/project-info.component';
import { DashboardIndexComponent } from './pages/dashboard/index/index.component';
import { DashboardDevicesComponent } from './pages/dashboard/devices/devices.component';
import { DashboardApiComponent } from './pages/dashboard/api/api.component';
import { SettingsComponent } from './pages/dashboard/settingspage/settings/settings.component';
import { ManagedevicesComponent } from './pages/dashboard/settingspage/managedevices/managedevices.component';
import { ProjectAdminGuard } from './guards/auth-projectadmin.guard';
import { ProjectGuard } from './guards/auth-guard.guard';

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
  },
  {
    path: 'create-project/:step',
    component: CreateProjectStepsComponent,
  },
  {
    path: 'project/:id',
    component: ProjectInfoComponent,
  },
  {
    path: 'dashboard/:id',
    component: DashboardIndexComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'dashboard/:id/devices',
    component: DashboardDevicesComponent,
    canActivate: [ProjectGuard],
  },
  {
    path: 'dashboard/:id/api',
    component: DashboardApiComponent,
    canActivate: [ProjectAdminGuard],
  },
  {
    path: 'dashboard/:id/settings',
    component: SettingsComponent,
    canActivate: [ProjectAdminGuard],
  },
  {
    path: 'dashboard/:id/settings/manage-devices',
    component: ManagedevicesComponent,
    canActivate: [ProjectAdminGuard],
  },
];
