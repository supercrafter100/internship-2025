import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideKeycloak } from 'keycloak-angular';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';

@NgModule({
  declarations: [AppComponent, ProjectComponent, HomeComponent],
  imports: [BrowserModule, RouterModule.forRoot(routes)],
  bootstrap: [AppComponent],
})
export class AppModule {}
