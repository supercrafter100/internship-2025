import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Project } from '@bsaffer/common/entity/project.entity';
import InvalidResponseException from '../../error/InvalidResponseException';
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
}
