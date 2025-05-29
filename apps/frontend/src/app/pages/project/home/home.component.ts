import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { Project } from '@bsaffer/common/entity/project.entity';
import { HotToastService } from '@ngneat/hot-toast';
import { UserService } from '../../../services/user.service';
import { ActivatedRoute } from '@angular/router';

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
    private readonly route: ActivatedRoute,
  ) {}

  async ngOnInit(): Promise<void> {
    this.route.queryParams.subscribe(async (params) => {
      this.isLoading = true;
      this.projects = [];

      const own = params['own'] === 'true';
      const failedLogin = params['failedLogin'] === 'true';

      // check if own query param is present and true
      if (failedLogin) {
        this.toast.error('You do not have access to the requested project.');
      }

      this.projects = own
        ? await this._projectService.getOwnProjects()
        : await this._projectService.getProjects(true);
      this.isLoading = false;
    });

    const user = await this._userService.getUserInfo().catch(() => undefined);
    this.isAdmin = user?.internalUser.admin || false;
  }

  public numSequence(n: number): Array<number> {
    return Array(n);
  }
}
