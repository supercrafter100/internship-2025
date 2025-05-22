import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project } from '@bsaffer/common/entity/project.entity';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-home',
  standalone: false,
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  public projects: Project[] = [];
  public isAdmin = false;
  public isLoading = true;

  constructor(
    private readonly _projectService: ProjectService,
    private readonly _userService: UserService,
    private readonly toast: HotToastService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.projects = await this._projectService.getProjects(true);
    this.isLoading = false;
    // get search params
    const searchParams = new URLSearchParams(window.location.search);
    if (searchParams.has('failedLogin')) {
      this.toast.error('You do not have access to the requested project.');
    }

    const user = await this._userService.getUserInfo().catch(() => undefined);
    this.isAdmin = user?.internalUser.admin || false;
  }

  public numSequence(n: number): Array<number> {
    return Array(n);
  }
}
