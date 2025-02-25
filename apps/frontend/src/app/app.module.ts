import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { ProjectComponent } from './components/project/project.component';
import { HomeComponent } from './pages/home/home.component';
import { RouterModule } from '@angular/router';
import { routes } from './app.routes';
import {
  LucideAngularModule,
  Globe,
  User,
  CircleDot,
  Plus,
  ArrowLeft,
  ArrowRight,
} from 'lucide-angular';
import { CreateProjectComponent } from './pages/create-project/create-project.component';

@NgModule({
  declarations: [
    AppComponent,
    ProjectComponent,
    HomeComponent,
    CreateProjectComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    LucideAngularModule.pick({
      Globe,
      User,
      CircleDot,
      Plus,
      ArrowLeft,
      ArrowRight,
    }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
