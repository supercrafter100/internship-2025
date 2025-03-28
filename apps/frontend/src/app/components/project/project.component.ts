import { Component, Input } from '@angular/core';
import { Project } from '@bsaffer/common/entity/project.entity';
import { parseCDNUrl } from '../../../util/utils';
@Component({
  selector: 'app-project',
  standalone: false,
  templateUrl: './project.component.html',
  styleUrl: './project.component.css',
})
export class ProjectComponent {
  @Input() project!: Project;

  public getImageUrl() {
    const url = parseCDNUrl(this.project.imgKey);
    const imgUrl =
      'linear-gradient(rgba(123, 178, 142, 0.35), rgba(123, 178, 142, 0.35)), url(' +
      url +
      ')';
    return imgUrl;
  }
}
