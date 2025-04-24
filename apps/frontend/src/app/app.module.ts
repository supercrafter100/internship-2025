import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './pages/project/home/home.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideHotToastConfig } from '@ngneat/hot-toast';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  LucideAngularModule,
  Globe,
  User,
  CircleDot,
  Plus,
  ArrowLeft,
  ArrowRight,
  Upload,
  CircleArrowRight,
  House,
  HardDrive,
  KeyRound,
  Bell,
  Cog,
  Eye,
  Trash2,
  X,
  UserRoundCog,
  MonitorSmartphone,
  PencilRuler,
  AlertTriangle,
} from 'lucide-angular'; //Iconen
import { CreateProjectComponent } from './pages/project/create-project/create-project.component';
import { CreateProjectStepsComponent } from './pages/project/create-project/steps/steps.component';
import { NgComponentOutlet } from '@angular/common';
import { CreateProjectFirstStep } from './pages/project/create-project/first/first.component';
import { CreateProjectSecondStep } from './pages/project/create-project/second/second.component';
import { CreateProjectSecondInputStep } from './pages/project/create-project/second-input/second-input.component';
import { QuillModule } from 'ngx-quill';
import { CreateProjectThirdStep } from './pages/project/create-project/third/third.component';
import { CreateProjectThirdInputStep } from './pages/project/create-project/third-input/third-input.component';
import { CreateProjectFinishStep } from './pages/project/create-project/finish/finish.component';
import { DashboardDevicesComponent } from './pages/dashboard/devices/devices.component';
import { FormsModule } from '@angular/forms';
import { NgxDomConfettiModule } from 'ngx-dom-confetti';
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { ProjectInfoComponent } from './pages/project/project-info/project-info.component';
import { NavbarComponent } from './components/nav/navbar/navbar.component';
import { DashboardIndexComponent } from './pages/dashboard/index/index.component';
import { LayoutComponent } from './components/dashboard/layout/layout.component';
import { DashboardApiComponent } from './pages/dashboard/api/api.component';
import { ModalComponent } from './components/general/modal/modal.component';
import { SettingComponent } from './components/settings/setting/setting.component';
import { SettingsComponent } from './pages/dashboard/settingspage/settings/settings.component';
import { ManagedevicesComponent } from './pages/dashboard/settingspage/managedevices/managedevices.component';
import { ConfiguredeviceComponent } from './components/settings/configuredevice/configuredevice.component';
import { ProjectAdminGuard } from './guards/auth-projectadmin.guard';
import { ProjectGuard } from './guards/auth-guard.guard';
import { CreateDeviceComponent } from './pages/dashboard/settingspage/create-device/create-device/create-device.component';
import { StepsComponent } from './pages/dashboard/settingspage/create-device/steps/steps.component';
import { FirstComponent } from './pages/dashboard/settingspage/create-device/first/first.component';
import { SecondComponent } from './pages/dashboard/settingspage/create-device/second/second.component';
import { WifiLteDeviceComponent } from './pages/dashboard/settingspage/create-device/third_specific_components/wifi-lte-device/wifi-lte-device.component';
import { LorawanComponent } from './pages/dashboard/settingspage/create-device/third_specific_components/lorawan/lorawan.component';
import { CameraComponent } from './pages/dashboard/settingspage/create-device/third_specific_components/camera/camera.component';
import { GatewayComponent } from './pages/dashboard/settingspage/create-device/third_specific_components/gateway/gateway.component';
import { ParameterstepComponent } from './pages/dashboard/settingspage/create-device/parameterstep/parameterstep.component';
import { FinishComponent } from './pages/dashboard/settingspage/create-device/finish/finish.component';
import { DeviceFrameSmallComponent } from './components/dashboard/devices/device-frame-small/device-frame-small.component';
import { ManageusersComponent } from './pages/dashboard/settingspage/manageusers/manageusers/manageusers.component';
import { UsertableComponent } from './components/usertable/usertable.component';
import { DashboardDeviceComponent } from './pages/dashboard/devices/device/device.component';
import { HighchartsChartModule } from 'highcharts-angular';
import { InfluxVisualsComponent } from './components/dashboard/device/influx-visuals/influx-visuals.component';
import { CameraVisualsComponent } from './components/dashboard/device/camera-visuals/camera-visuals.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    HomeComponent,
    CreateProjectComponent,
    WelcomeComponent,
    CreateProjectStepsComponent,
    CreateProjectFirstStep,
    CreateProjectSecondStep,
    CreateProjectSecondInputStep,
    CreateProjectThirdStep,
    CreateProjectThirdInputStep,
    CreateProjectFinishStep,
    DashboardDevicesComponent,
    ProjectInfoComponent,
    NavbarComponent,
    DashboardIndexComponent,
    LayoutComponent,
    DashboardApiComponent,
    ModalComponent,
    SettingComponent,
    SettingsComponent,
    ManagedevicesComponent,
    ConfiguredeviceComponent,
    CreateDeviceComponent,
    StepsComponent,
    FirstComponent,
    SecondComponent,
    WifiLteDeviceComponent,
    LorawanComponent,
    CameraComponent,
    GatewayComponent,
    ParameterstepComponent,
    FinishComponent,
    DeviceFrameSmallComponent,
    ManageusersComponent,
    UsertableComponent,
    DashboardDeviceComponent,
    InfluxVisualsComponent,
    CameraVisualsComponent,
  ],
  imports: [
    DragDropModule,
    BrowserModule,
    RouterModule.forRoot(routes),
    NgComponentOutlet,
    QuillModule.forRoot(),
    FormsModule,
    LucideAngularModule.pick({
      Globe,
      User,
      CircleDot,
      Plus,
      ArrowLeft,
      ArrowRight,
      Upload,
      CircleArrowRight,
      House,
      HardDrive,
      KeyRound,
      Bell,
      Cog,
      Eye,
      Trash2,
      X,
      UserRoundCog,
      MonitorSmartphone,
      PencilRuler,
      AlertTriangle,
    }),
    NgxDomConfettiModule,
    HighchartsChartModule,
  ],
  providers: [provideHotToastConfig(), ProjectAdminGuard, ProjectGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
