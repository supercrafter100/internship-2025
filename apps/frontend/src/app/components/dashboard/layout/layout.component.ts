import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../../services/user.service';
import { User } from '@bsaffer/common/entity/user.entity';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent implements OnInit {
  @ViewChild('username') usernameElement: ElementRef | undefined;
  @ViewChild('dropdown') dropdownElement: ElementRef | undefined;

  public user: User | undefined;
  public projectId: number | undefined;
  public dropdownOpen = false;

  public navButtons = [
    {
      icon: 'house',
      title: 'Dashboard',
      href: '/dashboard/{id}',
      exact: true,
    },
    {
      icon: 'hard-drive',
      title: 'Devices',
      href: '/dashboard/{id}/devices',
      exact: false,
    },
    {
      icon: 'key-round',
      title: 'API',
      href: '/dashboard/{id}/api',
      exact: false,
      requiresAdmin: true,
    },
    {
      icon: 'bell',
      title: 'Notifications',
      href: '/dashboard/{id}/notifications',
      exact: false,
      requiresAdmin: true,
    },
    {
      icon: 'cog',
      title: 'Settings',
      href: '/dashboard/{id}/settings',
      exact: false,
      requiresAdmin: true,
    },
  ];

  constructor(
    private readonly route: ActivatedRoute,
    private readonly userService: UserService,
  ) {}

  public isActiveRoute(link: string, exact: boolean = false): boolean {
    const currentPath = '/' + this.route.snapshot.url.join('/');
    if (!exact ? currentPath.includes(link) : currentPath === link) return true;
    return false;
  }

  public getBgColor(link: string, exact: boolean = false): string {
    return this.isActiveRoute(this.getParsedLink(link), exact)
      ? 'var(--color-primary-light)'
      : 'var(--color-primary-slight)';
  }

  public getParsedLink(link: string): string {
    return link.replace('{id}', this.route.snapshot.params['id']);
  }

  public getViewableNavItems() {
    if (!this.user) return this.getPublicButtons();
    if (
      this.user.internalUser.admin ||
      this.user.projects.some(
        (proj) => proj.projectId === this.projectId && proj.admin,
      )
    )
      return this.navButtons;
    return this.getPublicButtons();
  }

  public getPublicButtons() {
    return this.navButtons.filter((button) => button.requiresAdmin !== true);
  }

  public async ngOnInit(): Promise<void> {
    const user = await this.userService.getUserInfo();
    this.user = user;

    this.route.params.subscribe((params) => {
      this.projectId = Number(params['id']);
    });
  }

  public toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    console.log(this.dropdownOpen);
  }

  @HostListener('window:mousemove', ['$event'])
  mouseMove(event: MouseEvent) {
    console.log('move');
    if (
      this.usernameElement?.nativeElement.contains(event.target) &&
      !this.dropdownOpen
    ) {
      this.dropdownOpen = true;
    }

    if (
      this.dropdownOpen &&
      !this.dropdownElement?.nativeElement.contains(event.target) &&
      !this.usernameElement?.nativeElement.contains(event.target)
    ) {
      this.dropdownOpen = false;
    }
  }

  public logout() {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = '/api/auth/logout?redirectUrl=/home';
    document.body.appendChild(form);
    form.submit();
  }
}
