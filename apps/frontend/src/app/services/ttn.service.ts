import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TtnProvider } from '@bsaffer/common/entity/ttnCred.entity';
import { TTNProvider } from '../../types/types';

@Injectable({
  providedIn: 'root',
})
export class TtnService {
  private _apiUrl = environment.apiUrl;

  constructor() {}

  public async getTTNConfigs(id: number) {
    const response = await fetch(this._apiUrl + '/ttncred/project/' + id)
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new Error('Received invalid response from server for /ttn/configs');
    }

    const ttncreds: TtnProvider[] = response.map((provider: any) =>
      TtnProvider.fromJson(provider),
    );

    return response;
  }

  public async removeTTNConfig(id: number, ttnId: number) {
    const response = await fetch(this._apiUrl + '/ttncred/project/' + id, {
      body: JSON.stringify({ ttnId: ttnId }),
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new Error('Received invalid response from server for /ttn/configs');
    }

    return response;
  }

  public async addTTNConfig(
    projectId: number,
    appUrl: string,
    appId: string,
    apiKey: string,
  ) {
    const response = await fetch(
      this._apiUrl + '/ttncred/project/' + projectId,
      {
        body: JSON.stringify({
          projectId: projectId,
          appUrl: appUrl,
          appId: appId,
          apiKey: apiKey,
        }),
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new Error('Received invalid response from server for /ttn/configs');
    }

    return response;
  }

  public async getTTNProviders(projectId: number) {
    const response = await fetch(
      this._apiUrl + '/ttncred/project/' + projectId + '/providers',
    ).then((res) => res.json());

    return response as TTNProvider[];
  }
}
