import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Project } from '@bsaffer/common/entity/project.entity';
import { environment } from '../../../../environments/environment';
import { NgxConfettiDirective, NgxDomConfettiService } from 'ngx-dom-confetti';

@Component({
  selector: 'app-create-project-finish',
  standalone: false,
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.css',
})
export class CreateProjectFinishStep implements OnInit {
  public project: Project | undefined;
  @ViewChild('div', { read: ElementRef })
  projectElement!: ElementRef<HTMLDivElement>;

  constructor(
    private readonly router: Router,
    private readonly confettiService: NgxDomConfettiService,
  ) {}

  ngOnInit(): void {
    const project = localStorage.getItem('new-project');
    if (!project) {
      this.router.navigate(['/create-project']);
      return;
    }

    let projectResponse = JSON.parse(project) as Project;
    projectResponse.imgKey = environment.cdnUrl + projectResponse.imgKey;
    this.project = projectResponse;

    const el = this.projectElement.nativeElement.children.item(
      0,
    ) as HTMLElement;
    this.confettiService.open(el);
  }
}
