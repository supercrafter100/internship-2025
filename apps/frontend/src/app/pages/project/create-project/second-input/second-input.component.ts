import { Component, OnInit } from '@angular/core';
import { CreateProjectStorage } from '../../../../Classes/CreateProjectStorage';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';
import { ProjectService } from '../../../../services/project.service';

@Component({
  selector: 'app-create-project-second-input',
  standalone: false,
  templateUrl: './second-input.component.html',
  styleUrl: './second-input.component.css',
})
export class CreateProjectSecondInputStep implements OnInit {
  public content = '';
  public loading = false;

  constructor(
    private readonly projectService: ProjectService,
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async submit() {
    if (this.loading) return;

    if (this.content.length <= 0) {
      this.toast.error('Please fill in the project story.');
      return;
    }

    const existingSettings = CreateProjectStorage.fromLocalstorage();
    existingSettings.projectStory = this.content;
    await existingSettings.saveToLocalStorage();

    // Query the API to create the project
    this.loading = true;
    const projectResponse = await this.projectService
      .createProject(existingSettings)
      .catch((err) => {
        console.error(err);
        return false;
      });
    if (!projectResponse) {
      this.toast.error(
        'Failed to create project. Check browser console for errors',
      );
      this.loading = false;
      return;
    }

    CreateProjectStorage.clear();
    localStorage.setItem('new-project', JSON.stringify(projectResponse));
    this.router.navigate(['/create-project/finish'], { replaceUrl: true });
  }

  public ngOnInit(): void {
    const existingSettings = CreateProjectStorage.fromLocalstorage();
    this.content = existingSettings.projectStory;
  }
}
