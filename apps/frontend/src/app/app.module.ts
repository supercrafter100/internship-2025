import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './pages/project/home/home.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';
import { provideHotToastConfig } from '@ngneat/hot-toast';
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
  UserRoundCog,
  MonitorSmartphone,
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
import { SettingComponent } from './components/setting/setting.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ManagedevicesComponent } from './pages/managedevices/managedevices.component';

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
    SettingComponent,
    SettingsComponent,
    ManagedevicesComponent,
  ],
  imports: [
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
      UserRoundCog,
      MonitorSmartphone,
    }),
    NgxDomConfettiModule,
  ],
  providers: [provideHotToastConfig()],
  bootstrap: [AppComponent],
})
export class AppModule {}
