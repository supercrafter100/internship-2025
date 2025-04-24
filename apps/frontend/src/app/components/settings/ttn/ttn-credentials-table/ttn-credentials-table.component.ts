import { Component, OnInit } from '@angular/core';
import { TtnService } from '../../../../services/ttn.service';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../../services/user.service';
import { HotToastService, Toast } from '@ngneat/hot-toast';

@Component({
  selector: 'app-ttn-credentials-table',
  standalone: false,
  templateUrl: './ttn-credentials-table.component.html',
  styleUrl: './ttn-credentials-table.component.css',
})
export class TtnCredentialsTableComponent implements OnInit {
  constructor(
    private ttnService: TtnService,
    private userService: UserService,
    private readonly route: ActivatedRoute,
    private toast: HotToastService,
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

  async addTTNConfig(appUrl: string, appId: string, apiKey: string) {
    try {
      this.ttnService.addTTNConfig(
        Number(this.projectId),
        appUrl,
        appId,
        apiKey,
      );
    } catch (error) {
      return;
    }

    //Update TTN config
    await this.updateTtnConfig();

    // Close TTN modal
    this.closeTTNModal();

    //Show success message
    this.toast.success('TTN credentials added successfully!');
  }

  async deleteTTNConfig(id: number) {
    this.ttnService.removeTTNConfig(this.projectId as unknown as number, id);

    //Update TTN config
    await this.updateTtnConfig();

    //Show toast message
    this.toast.warning('TTN credentials deleted successfully!');
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

  private async updateTtnConfig() {
    // Update ttn configs
    this.ttnConfigs = await this.ttnService.getTTNConfigs(
      this.projectId as unknown as number,
    );
  }
}
