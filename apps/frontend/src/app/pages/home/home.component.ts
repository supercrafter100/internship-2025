import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../services/project.service';
import { Project } from '@bsaffer/common/entity/project.entity';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public projects: Project[] = [];
  public user: string = '';

  constructor(private readonly _projectService: ProjectService) {}

  async ngOnInit(): Promise<void> {
    this.projects = await this._projectService.getProjects(true);
    this.user = await this._projectService.getUser();
    console.log(this.user);
  }
}
