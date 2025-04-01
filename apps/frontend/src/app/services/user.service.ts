import { Injectable } from '@angular/core';
import InvalidResponseException from '../../error/InvalidResponseException';
import { environment } from '../../environments/environment.development';
import { InternalUser, User } from '@bsaffer/common/entity/user.entity';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private _apiUrl = environment.apiUrl;
  private _user: User | null = null;

  constructor() {}

  public async getUserInfo(): Promise<User | undefined> {
    if (this._user) return this._user;

    const response: User = await fetch(this._apiUrl + '/user/info')
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new InvalidResponseException(
        'Received invalid response from server for /user/info',
      );
    }

    // Assuming response is a plain object, so we use fromJson to create a User instance
    if (!Object.hasOwn(response, 'user')) return;

    let user: User = User.fromJson(response);
    this._user = user;

    return user;
  }

  public async isAuthenticated(): Promise<boolean> {
    const data = await this.getUserInfo();
    return !!data;
  }

  public async canAccessProject(projectId: number): Promise<boolean> {
    const user = await this.getUserInfo();
    if (!user) return false;

    if (user.internalUser.admin) return true;
    return user.projects.some((project) => project.projectId === projectId);
  }

  public async canEditProject(projectId: number): Promise<boolean> {
    const user = await this.getUserInfo();
    if (!user) return false;

    if (user.internalUser.admin) return true;
    return user.projects.some(
      (project) => project.projectId === projectId && project.admin,
    );
  }

  public async getAllUsers(): Promise<User[]> {
    const response: User[] = await fetch(this._apiUrl + '/user/all')
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new InvalidResponseException(
        'Received invalid response from server for /user/all',
      );
    }

    return response.map((user) => User.fromJson(user));
  }

  public async getAllProjectUsers(projectId: number): Promise<InternalUser[]> {
    const response: InternalUser[] = await fetch(
      this._apiUrl + '/user/projects/' + projectId + '/users',
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new InvalidResponseException(
        'Received invalid response from server for /user/all',
      );
    }

    console.log('Response: ', response);
    return response.map((user) => InternalUser.fromJson(user));
  }

  public async changeAdminStatus(projectId: number, userId: number, admin: boolean) {
   update   this._apiUrl + '/user/projects/' + projectId + '/users';
  }
}
