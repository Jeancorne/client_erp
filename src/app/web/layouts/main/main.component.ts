import { Component, signal, computed, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { FormsModule } from '@angular/forms';

// Importación del archivo JSON de menús (Simulación de DB/API)
import menuData from '../../../../assets/data/menu.json';

interface MenuItem {
  id: string;
  moduleCode?: string;
  name: string;
  routePath?: string;
  sequence: number;
  icon?: string | null;
  items?: MenuItem[];
}

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
  isCollapsed = false;
  
  // Signals para el estado del menú
  selectedModuleId = signal<string>(''); 
  fullMenuSource = signal<MenuItem[]>([]);
  isLoading = signal<boolean>(true);

  // Propiedad para el ngModel del nz-select
  get selectedValue() { return this.selectedModuleId(); }
  set selectedValue(val: string) { this.selectedModuleId.set(val); }
  
  // listModule extraído dinámicamente de los datos del menú
  listModule = computed(() => {
    const modules = this.fullMenuSource()
      .map(m => m.moduleCode)
      .filter((value, index, self) => value && self.indexOf(value) === index);
    
    return modules.map(m => ({ id: m, nameModule: m }));
  });

  // Menú filtrado reactivamente por el módulo seleccionado
  lsMenus: any = computed(() => {
    const moduleId = this.selectedModuleId();
    if (!moduleId) return [];
    return this.fullMenuSource().filter(menu => menu.moduleCode === moduleId);
  });

  constructor(private router: Router) {}

  async ngOnInit() {
    await this.loadMenuData();
  }

  /**
   * Simula la llamada al backend para obtener los menús del usuario
   */
  async loadMenuData() {
    this.isLoading.set(true);
    
    // Simulamos un delay de red de 500ms
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Cargamos los datos del JSON importado
    const data = menuData as MenuItem[];
    this.fullMenuSource.set(data);
    
    // Seleccionamos el primer módulo disponible por defecto
    if (data.length > 0 && data[0].moduleCode) {
      this.selectedModuleId.set(data[0].moduleCode);
    }
    
    this.isLoading.set(false);
    console.log('Menú cargado exitosamente desde el JSON.');
  }

  navigation(path: string | undefined) {
    if (path) {
      this.router.navigate([path]);
    }
  }

  changeModule(modId: string) {
    console.log('Cambiando al módulo:', modId);
  }

  logout() {
    console.log('Cerrando sesión del ERP...');
    this.router.navigate(['/login']);
  }
}
