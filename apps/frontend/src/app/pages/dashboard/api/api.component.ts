import { Component, OnInit } from '@angular/core';
import { ProjectService } from '../../../services/project.service';
import { ActivatedRoute } from '@angular/router';
import { ApiKey } from '@bsaffer/common/entity/apiKey.entity';
import { HotToastService } from '@ngneat/hot-toast';

@Component({
  selector: 'app-api',
  standalone: false,
  templateUrl: './api.component.html',
  styleUrl: './api.component.css',
})
export class DashboardApiComponent implements OnInit {
  public apiKeys: ApiKey[] = [];
  public shownKeys: Record<number, boolean> = {};

  public modalOpen = false;
  public projectId: number = -1;
  public newKeyName: string = '';

  constructor(
    private readonly projectService: ProjectService,
    private readonly route: ActivatedRoute,
    private readonly toast: HotToastService,
  ) {}

  public async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      const id = params['id'];
      this.apiKeys = await this.projectService.getApiKeys(+id);
      this.projectId = +id;
      console.log(this.projectId);
    });
  }

  public toggleShowKey(id: number) {
    if (Object.keys(this.shownKeys).includes(id.toString()))
      this.shownKeys[id] = !this.shownKeys[id];
    else this.shownKeys[id] = true;
  }

  public isHidden(id: number) {
    return !this.shownKeys[id];
  }

  public openModal() {
    this.modalOpen = true;
  }

  public closeModal() {
    this.modalOpen = false;
  }

  public async addKey() {
    if (this.newKeyName.trim() === '') {
      this.toast.error('Please enter a name for the key');
      return;
    }

    if (this.newKeyName.trim().length > 50) {
      this.toast.error('Key name cannot be longer than 50 characters');
      return;
    }

    const key = await this.projectService.createApiKey(
      this.projectId,
      this.newKeyName.trim(),
    );
    this.modalOpen = false;
    if (key) {
      this.apiKeys.push(key);
    } else {
      this.toast.error('Failed to create API key');
    }
  }

  public async deleteKey(id: number) {
    await this.projectService.deleteApiKey(id);
    this.apiKeys = this.apiKeys.filter((key) => key.id !== id);
    this.toast.success('API key deleted');
  }
}
