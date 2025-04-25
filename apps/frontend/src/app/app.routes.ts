import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { canActivateAuthRole } from './guards/app-auth.guard';
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
import { CreateDeviceComponent } from './pages/dashboard/settingspage/create-device/create-device/create-device.component';
import { StepsComponent } from './pages/dashboard/settingspage/create-device/steps/steps.component';
import { FinishComponent } from './pages/dashboard/settingspage/create-device/finish/finish.component';
import { ManageusersComponent } from './pages/dashboard/settingspage/manageusers/manageusers/manageusers.component';
import { DashboardDeviceComponent } from './pages/dashboard/devices/device/device.component';
import { TtnComponent } from './pages/dashboard/settingspage/ttn/ttn.component';

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
    // canActivate: [canActivateAuthRole],
    // data: { roles: ['PlatformOwner'] },
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
    path: 'dashboard/:id/devices/:deviceId',
    component: DashboardDeviceComponent,
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
    path: 'dashboard/:id/settings/users',
    component: ManageusersComponent,
    canActivate: [ProjectAdminGuard],
  },
  {
    path: 'dashboard/:id/settings/manage-devices',
    component: ManagedevicesComponent,
    canActivate: [ProjectAdminGuard],
  },
  {
    path: 'dashboard/:id/settings/configure-ttn',
    component: TtnComponent,
    canActivate: [ProjectAdminGuard],
  },
  {
    path: 'dashboard/:id/settings/create-device',
    component: CreateDeviceComponent,
  },
  {
    path: 'dashboard/:id/settings/create-device/:step',
    component: StepsComponent,
  },
  {
    path: 'dashboard/:id/settings/create-device/finish',
    component: FinishComponent,
  },
];
