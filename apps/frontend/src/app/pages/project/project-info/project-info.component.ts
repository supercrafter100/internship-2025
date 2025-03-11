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

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly projectService: ProjectService,
  ) {}

  public ngOnInit(): void {
    this.route.params.subscribe(async (params) => {
      const projectId = params['id'];
      const project = await this.projectService.getProject(projectId);

      if (!project) {
        this.router.navigate(['/home']);
        return;
      }

      this.project = project;
    });
  }
}
