import { Component, OnInit } from '@angular/core';
import { HotToastService } from '@ngneat/hot-toast';
import { CreateProjectStorage } from '../../../Classes/CreateProjectStorage';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project-first-step',
  standalone: false,
  templateUrl: './first.component.html',
  styleUrl: './first.component.css',
})
export class CreateProjectFirstStep implements OnInit {
  public projectName = '';
  public projectDescription = '';
  public projectImage: File | string | undefined;
  public projectPublic = false;

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async submit() {
    if (this.projectName.length <= 0 || this.projectName.length > 15) {
      this.toast.error('Project name must be between 1 and 15 characters.');
      return;
    }

    if (
      this.projectDescription.length <= 0 ||
      this.projectDescription.length > 35
    ) {
      this.toast.error(
        'Project description must be between 1 and 35 characters.',
      );
      return;
    }

    if (!this.projectImage) {
      this.toast.error('Please select a project image.');
      return;
    }

    const existingSettings = CreateProjectStorage.fromLocalstorage();
    existingSettings.projectName = this.projectName;
    existingSettings.projectDescription = this.projectDescription;
    existingSettings.projectImage = this.projectImage;
    existingSettings.public = this.projectPublic;
    await existingSettings.saveToLocalStorage();
    this.router.navigate(['/create-project/2.1']);
  }

  public onFileChange(evt: any) {
    this.projectImage = evt.target.files[0];
  }

  ngOnInit() {
    const existingSettings = CreateProjectStorage.fromLocalstorage();
    this.projectName = existingSettings.projectName;
    this.projectDescription = existingSettings.projectDescription;
    this.projectImage = existingSettings.projectImage;
    this.projectPublic = existingSettings.public;
  }
}
