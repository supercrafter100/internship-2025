import { Injectable } from '@angular/core';
import InvalidResponseException from '../../error/InvalidResponseException';
import { environment } from '../../environments/environment.development';
import { User } from '@bsaffer/common/entity/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _apiUrl = environment.apiUrl;

  constructor() {}

  public async getUserInfo(): Promise<User> {
    const response: User = await fetch(this._apiUrl + '/user/info')
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new InvalidResponseException(
        'Received invalid response from server for /user/info',
      );
    }

    // Assuming response is a plain object, so we use fromJson to create a User instance
    let user: User = User.fromJson(response);

    return user;
  }
}
