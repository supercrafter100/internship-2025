import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Project } from '@bsaffer/common/entity/project.entity';
import { ProjectService } from '../../../services/project.service';

@Component({
  selector: 'app-project-info',
  standalone: false,
  templateUrl: './project-info.component.html',
  styleUrl: './project-info.component.css',
})
export class ProjectInfoComponent implements OnInit {
  public project: Project | undefined;
  public projectId: number | null = null;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const projectId = params['id'];
      this.projectId = Number(projectId);
      const project = await this.projectService.getProject(projectId);

      if (!project) {
        this.router.navigate(['/home']);
        return;
      }

      this.project = project;

      this.getProjectStatistics();
    });
  }
  //
  // Our story
  //
  public modalOpen = false;
  public openModal() {
    this.modalOpen = true;
  }

  public closeModal() {
    this.modalOpen = false;
  }

  //
  // Stats
  //
  public onlineDeviceCount = 0;
  public totalDeviceCount = 0;

  public async getProjectStatistics() {
    if (!this.projectId) return;
    const stats = await this.projectService.getProjectStatistics(
      this.projectId,
    );

    this.onlineDeviceCount = stats.online;
    this.totalDeviceCount = stats.total;
  }
}
