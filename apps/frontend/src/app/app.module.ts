import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './pages/home/home.component';

import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        realm: environment.keycloakRealm,
        url: environment.keycloakUrl,
        clientId: environment.keycloakClientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}
import {
  LucideAngularModule,
  Globe,
  User,
  CircleDot,
  Plus,
  ArrowLeft,
  ArrowRight,
  Upload,
} from 'lucide-angular';
import { CreateProjectComponent } from './pages/create-project/create-project.component';
import { CreateProjectStepsComponent } from './pages/create-project/steps/steps.component';
import { NgComponentOutlet } from '@angular/common';
import { CreateProjectFirstStep } from './pages/create-project/first/first.component';
import { CreateProjectSecondStep } from './pages/create-project/second/second.component';
import { CreateProjectSecondInputStep } from './pages/create-project/second-input/second-input.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    HomeComponent,
    CreateProjectComponent,
    CreateProjectStepsComponent,
    CreateProjectFirstStep,
    CreateProjectSecondStep,
    CreateProjectSecondInputStep,
  ],
  imports: [
    BrowserModule,
    KeycloakAngularModule,
    RouterModule.forRoot(routes),
    NgComponentOutlet,
    LucideAngularModule.pick({
      Globe,
      User,
      CircleDot,
      Plus,
      ArrowLeft,
      ArrowRight,
      Upload,
    }),
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
