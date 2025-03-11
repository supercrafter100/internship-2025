import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project } from '@bsaffer/common/entity/project.entity';
import { UserService } from '../../services/user.service';
import { User, UserProfile } from '@bsaffer/common/entity/user.entity';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public projects: Project[] = [];
  public user: User | null = null;

  constructor(
    private readonly _projectService: ProjectService,
    private readonly _userService: UserService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.projects = await this._projectService.getProjects(true);
    this.user = await this._userService.getUserInfo();
    console.log(this.user.profile.name);
  }
}
