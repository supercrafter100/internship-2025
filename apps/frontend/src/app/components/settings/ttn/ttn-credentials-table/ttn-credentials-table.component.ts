import { Component, OnInit } from '@angular/core';
import { TtnService } from '../../../../services/ttn.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ttn-credentials-table',
  standalone: false,
  templateUrl: './ttn-credentials-table.component.html',
  styleUrl: './ttn-credentials-table.component.css',
})
export class TtnCredentialsTableComponent implements OnInit {
  constructor(
    private ttnService: TtnService,
    private readonly route: ActivatedRoute,
  ) {}

  private projectId: string | undefined;

  async ngOnInit(): Promise<void> {
    this.route.params.subscribe(async (params) => {
      this.projectId = params['id'];
    });

    this.ttnConfigs = await this.ttnService.getTTNConfigs(
      this.projectId as unknown as number,
    );
  }

  ttnConfigs: { id: string; appUrl: string; appId: string; apiKey: string }[] =
    [];
  ttnModalOpen = false;
  newTTN = {
    appUrl: '',
    appId: '',
    apiKey: '',
  };

  hiddenKeys = new Set<string>();

  openTTNModal() {
    this.ttnModalOpen = true;
  }

  closeTTNModal() {
    this.ttnModalOpen = false;
    this.newTTN = { appUrl: '', appId: '', apiKey: '' };
  }

  addTTNConfig() {
    const newId = Math.random().toString(36).substring(2, 9);
    this.ttnConfigs.push({
      id: newId,
      ...this.newTTN,
    });
    this.hiddenKeys.add(newId);
    this.closeTTNModal();
  }

  deleteTTNConfig(id: string) {
    this.ttnConfigs = this.ttnConfigs.filter((cfg) => cfg.id !== id);
    this.hiddenKeys.delete(id);
  }

  isTTNKeyHidden(id: string) {
    return !this.hiddenKeys.has(id);
  }

  toggleShowTTNKey(id: string) {
    if (this.hiddenKeys.has(id)) {
      this.hiddenKeys.delete(id);
    } else {
      this.hiddenKeys.add(id);
    }
  }
}
