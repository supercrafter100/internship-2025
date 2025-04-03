import { Injectable } from '@angular/core';
import InvalidResponseException from '../../error/InvalidResponseException';
import { environment } from '../../environments/environment.development';
import {
  InternalUser,
  ProjectUser,
  User,
} from '@bsaffer/common/entity/user.entity';

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

  public async getAllProjectUsers(projectId: number): Promise<ProjectUser[]> {
    const response: ProjectUser[] = await fetch(
      this._apiUrl + '/user/projects/' + projectId + '/users',
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response) {
      throw new InvalidResponseException(
        'Received invalid response from server for /user/all',
      );
    }

    return response.map((user) => ProjectUser.fromJson(user));
  }

  public async addUserToProject(projectId: number, email: string) {
    const url = `${this._apiUrl}/user/projects/${projectId}/users`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Fout bij toevoegen van gebruiker: ${response.status} ${response.statusText}`,
        );
      }

      console.log(
        `User ${email} succesvol toegevoegd aan project ${projectId}`,
      );
    } catch (error) {
      console.error('Fout bij het toevoegen van gebruiker:', error);
    }
  }

  public async updateAdminStatus(
    projectId: number,
    user: InternalUser,
    admin: boolean,
  ): Promise<void> {
    const url = `${this._apiUrl}/user/projects/${projectId}/users/${user.id}/admin`;

    try {
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          admin: admin,
        }),
      });

      if (!response.ok) {
        throw new Error(
          `Fout bij updaten: ${response.status} ${response.statusText}`,
        );
      }

      console.log(
        `Admin-status succesvol aangepast voor user ${user.id} in project ${projectId}`,
      );
    } catch (error) {
      console.error('Fout bij het wijzigen van de admin-status:', error);
    }
  }
}
