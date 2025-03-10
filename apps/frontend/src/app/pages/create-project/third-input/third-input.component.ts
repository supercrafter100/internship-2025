import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../../../services/project.service';
import { CreateProjectStorage } from '../../../Classes/CreateProjectStorage';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-create-project-third-input',
  standalone: false,
  templateUrl: './third-input.component.html',
  styleUrl: './third-input.component.css',
})
export class CreateProjectThirdInputStep {
  constructor(
    private readonly router: Router,
    private readonly projectService: ProjectService,
    private readonly toast: HotToastService,
  ) {}

  public async submit() {
    const existingProject = CreateProjectStorage.fromLocalstorage();

    // Query the API to create the project
    const projectResponse = await this.projectService
      .createProject(existingProject)
      .catch((err) => {
        console.error(err);
        return false;
      });
    if (!projectResponse) {
      this.toast.error(
        'Failed to create project. Check browser console for errors',
      );
      return;
    }

    localStorage.setItem('new-project', JSON.stringify(projectResponse));
    this.router.navigate(['/create-project/finish']);
  }
}
