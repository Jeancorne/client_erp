import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../../core/services/auth.service';
import { MenuItem } from '../../../core/models/auth.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    FormsModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzDropdownModule,
    NzAvatarModule,
    NzSelectModule
  ],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainLayout implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  isCollapsed = false;
  
  // Signal para el módulo seleccionado actualmente
  selectedModuleId = signal<string>(''); 

  // Datos del usuario desde el Signal global
  currentUser = this.authService.currentUser;

  // Propiedad para el ngModel del nz-select
  get selectedValue() { return this.selectedModuleId(); }
  set selectedValue(val: string) { this.selectedModuleId.set(val); }
  
  // listModule extraído dinámicamente de los menús REALES del usuario
  listModule = computed(() => {
    const menus = this.authService.userMenus();
    return menus.map(m => ({ id: m.id, nameModule: m.name }));
  });

  // Menú filtrado reactivamente por el módulo seleccionado
  lsMenus = computed(() => {
    const moduleId = this.selectedModuleId();
    const menus = this.authService.userMenus();
    
    if (!moduleId) return [];
    
    // En la estructura real, el "módulo" es el primer nivel del menú
    const selectedModule = menus.find(m => m.id === moduleId);
    return selectedModule ? selectedModule.items || [] : [];
  });

  ngOnInit() {
    // Seleccionamos el primer módulo automáticamente si hay menús cargados
    const currentMenus = this.authService.userMenus();
    if (currentMenus.length > 0 && !this.selectedModuleId()) {
      this.selectedModuleId.set(currentMenus[0].id);
    }
  }

  navigation(path: string | undefined) {
    if (path) {
      this.router.navigate([path]);
    }
  }

  changeModule(modId: string) {
    console.log('Cambiando a módulo:', modId);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
