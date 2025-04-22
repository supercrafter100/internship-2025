import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TtnProvider } from '@bsaffer/common/entity/ttnCred.entity';

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
}
