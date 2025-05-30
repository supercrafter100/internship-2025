import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { parseCDNUrl, toBase64 } from '../../../../../util/utils';
import { HotToastService } from '@ngneat/hot-toast';
import { UpdateProjectDto } from '@bsaffer/api/project/dto/update-project.dto';

@Component({
  selector: 'app-edit-project',
  standalone: false,
  templateUrl: './edit-project.component.html',
  styleUrl: './edit-project.component.css',
})
export class EditProjectComponent implements OnInit {
  private projectImageKey = 'null';
  private projectId = -1;

  public projectName = '';
  public projectDescription = '';
  public projectStory = '';
  public projectPublic = false;
  public projectImage: File | undefined;

  public get imageSource(): string {
    return this.projectImage
      ? URL.createObjectURL(this.projectImage)
      : parseCDNUrl(this.projectImageKey);
  }

  constructor(
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly toast: HotToastService,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const projectId = params['id'];
      const project = await this.projectService
        .getProject(+projectId)
        .catch((err) => {
          console.error(err);
          return null;
        });

      if (!project) {
        return;
      }

      this.projectId = project.id;
      this.projectName = project.title;
      this.projectDescription = project.shortDescription;
      this.projectStory = project.story;
      this.projectPublic = project.public;
      this.projectImageKey = project.imgKey;
    });
  }

  public onFileChange(evt: any) {
    this.projectImage = evt.target.files[0];
  }

  public async saveChanges() {
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

    if (!this.projectImage && !this.projectImageKey) {
      this.toast.error('Please select a project image.');
      return;
    }

    let newSettings: UpdateProjectDto = {
      title: this.projectName,
      shortDescription: this.projectDescription,
      story: this.projectStory,
      public: this.projectPublic,
    };

    if (this.projectImage) {
      newSettings.base64Image = await toBase64(this.projectImage);
    }

    this.projectService
      .updateProject(this.projectId, newSettings)
      .then(() => {
        this.toast.success('Project updated successfully!');
      })
      .catch((err) => {
        console.error(err);
        this.toast.error('Failed to update project. Check browser console.');
      });
  }
}
