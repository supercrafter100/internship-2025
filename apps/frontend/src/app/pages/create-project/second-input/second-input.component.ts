import { Component, OnInit } from '@angular/core';
import { ContentChange } from 'ngx-quill';
import { CreateProjectStorage } from '../../../Classes/CreateProjectStorage';
import { HotToastService } from '@ngneat/hot-toast';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-project-second-input',
  standalone: false,
  templateUrl: './second-input.component.html',
  styleUrl: './second-input.component.css',
})
export class CreateProjectSecondInputStep implements OnInit {
  public content = '';

  constructor(
    private readonly toast: HotToastService,
    private readonly router: Router,
  ) {}

  public async submit() {
    if (this.content.length <= 0) {
      this.toast.error('Please fill in the project story.');
      return;
    }

    const existingSettings = CreateProjectStorage.fromLocalstorage();
    existingSettings.projectStory = this.content;
    await existingSettings.saveToLocalStorage();
    this.router.navigate(['/create-project/3.1']);
  }

  public ngOnInit(): void {
    const existingSettings = CreateProjectStorage.fromLocalstorage();
    this.content = existingSettings.projectStory;
  }
}
