import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { NavigationService } from '../../../core/services/navigation.service';
import { MenuItem } from '../../../core/models/auth.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropdownModule,
    NzAvatarModule,
    NzTooltipModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainLayout implements OnInit {
  private authService = inject(AuthService);
  private navService = inject(NavigationService);
  private router = inject(Router);

  isCollapsed = false;
  selectedModuleId = signal<string>('');

  currentUser = this.authService.currentUser;
  pinnedItems = this.navService.pinnedItems;

  get selectedValue() { return this.selectedModuleId(); }
  set selectedValue(val: string) { this.selectedModuleId.set(val); }

  listModule = computed(() => {
    const menus = this.authService.userMenus();
    return menus.map(m => ({ id: m.id, nameModule: m.name }));
  });

  lsMenus = computed(() => {
    const moduleId = this.selectedModuleId();
    const menus = this.authService.userMenus();

    if (moduleId === 'FAVORITES') return this.pinnedItems();

    if (!moduleId) return [];
    const selectedModule = menus.find(m => m.id === moduleId);
    return selectedModule ? selectedModule.items || [] : [];
  });

  ngOnInit() {
    const currentMenus = this.authService.userMenus();
    if (currentMenus.length > 0 && !this.selectedModuleId()) {
      this.selectedModuleId.set(currentMenus[0].id);
    }
  }

  getActiveModuleName(): string {
    const moduleId = this.selectedModuleId();
    if (moduleId === 'FAVORITES') return 'Acceso Rápido';
    const modules = this.listModule();
    return modules.find(m => m.id === moduleId)?.nameModule || 'ERP System';
  }

  getModuleIcon(moduleId: string): string {
    const menus = this.authService.userMenus();
    return menus.find(m => m.id === moduleId)?.icon || 'appstore';
  }

  togglePin(event: MouseEvent, item: MenuItem) {
    event.stopPropagation();
    this.navService.togglePin(item);
  }

  isPinned(itemId: string): boolean {
    return this.navService.isPinned(itemId);
  }

  navigation(path: string | undefined) {
    if (path) {
      this.router.navigate([path]);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
