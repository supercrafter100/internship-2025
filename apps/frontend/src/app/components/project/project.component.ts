import { Component, Input, OnInit } from '@angular/core';
import { Project } from '@bsaffer/common/entity/project.entity';
import { parseCDNUrl } from '../../../util/utils';
import { ProjectService } from '../../services/project.service';
@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent implements OnInit {
  constructor(private readonly _projectService: ProjectService) {}

  @Input() project!: Project;
  public onlineDeviceCount = 0;

  public getImageUrl() {
    const url = parseCDNUrl(this.project.imgKey);
    const imgUrl =
      'linear-gradient(rgba(123, 178, 142, 0.35), rgba(123, 178, 142, 0.35)), url(' +
      url +
      ')';
    return imgUrl;
  }

  public async ngOnInit() {
    // Fetch project data for online devices
    const onlineDevices =
      await this._projectService.getProjectOnlineDeviceCount(this.project.id);
    this.onlineDeviceCount = onlineDevices;
  }
}
