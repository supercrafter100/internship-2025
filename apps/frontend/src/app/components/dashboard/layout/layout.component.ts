import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-layout',
  standalone: false,
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  public navButtons = [
    {
      icon: 'house',
      title: 'Dashboard',
      href: '/dashboard/{id}',
      exact: false,
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
    },
    {
      icon: 'bell',
      title: 'Notifications',
      href: '/dashboard/{id}/notifications',
      exact: false,
    },
    {
      icon: 'cog',
      title: 'Settings',
      href: '/dashboard/{id}/settings',
      exact: false,
    },
  ];

  constructor(private readonly route: ActivatedRoute) {}

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
}
