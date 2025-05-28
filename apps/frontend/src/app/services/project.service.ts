import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Project } from '@bsaffer/common/entity/project.entity';
import { ApiKey } from '@bsaffer/common/entity/apiKey.entity';
import InvalidResponseException from '../../error/InvalidResponseException';
import { CreateProjectStorage } from '../Classes/CreateProjectStorage';
import { toBase64 } from '../../util/utils';
@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private _apiUrl = environment.apiUrl;

  constructor() {}

  public async getProjects(onlyPublic: boolean = false) {
    const response = await fetch(
      this._apiUrl + '/project' + (onlyPublic ? '?public=true' : ''),
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project',
      );

    const projects: Project[] = response.map((project: any) =>
      Project.fromJson(project),
    );
    return projects;
  }

  public async getUser() {
    const response = await fetch(this._apiUrl + '/project/user')
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/user',
      );

    return response;
  }

  public async getProject(id: number) {
    const response = await fetch(this._apiUrl + '/project/' + id)
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/' + id,
      );

    return Project.fromJson(response);
  }

  public async getOwnProjects() {
    const response = await fetch(this._apiUrl + '/project/own')
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/own',
      );

    const projects: Project[] = response.map((project: any) =>
      Project.fromJson(project),
    );

    return projects;
  }

  public async createProject(project: CreateProjectStorage) {
    if (project.projectImage instanceof File) {
      project.projectImage = await toBase64(project.projectImage);
    }

    const response = await fetch(this._apiUrl + '/project/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title: project.projectName,
        shortDescription: project.projectDescription,
        userId: 1,
        public: project.public,
        base64Image: project.projectImage,
        story: project.projectStory,
      }),
    });

    if (!response.ok)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/',
      );

    return response.json();
  }

  public async getApiKeys(projectId: number): Promise<ApiKey[]> {
    const response = await fetch(this._apiUrl + '/apikey/project/' + projectId)
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /apikey/project/' +
          projectId,
      );

    return response.map((res: unknown) => ApiKey.fromJson(res));
  }

  public async createApiKey(projectId: number, name: string): Promise<ApiKey> {
    const response = await fetch(
      this._apiUrl + '/apikey/project/' + projectId,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
        }),
      },
    );

    if (!response.ok)
      throw new InvalidResponseException(
        'Received invalid response from server for /apikey/project/' +
          projectId,
      );

    return response.json();
  }

  public async deleteApiKey(keyId: number) {
    const response = await fetch(this._apiUrl + '/apikey/' + keyId, {
      method: 'DELETE',
    });

    if (!response.ok)
      throw new InvalidResponseException(
        'Received invalid response from server for /apikey/' + keyId,
      );

    return true;
  }

  public async getProjectOnlineDeviceCount(projectId: number): Promise<number> {
    const response = await fetch(
      this._apiUrl + '/project/' + projectId + '/onlineDevices',
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/' +
          projectId +
          '/onlineDevices',
      );

    return response.onlineDevices as number;
  }

  public async getProjectStatistics(projectId: number) {
    const response = await fetch(
      this._apiUrl + '/project/' + projectId + '/statistics',
    )
      .then((res) => res.json())
      .catch(() => undefined);

    if (!response)
      throw new InvalidResponseException(
        'Received invalid response from server for /project/' +
          projectId +
          '/onlineDevices',
      );

    return {
      online: response.onlineDevices as number,
      total: response.totalDevices as number,
    };
  }
}
