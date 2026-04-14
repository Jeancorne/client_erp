import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { DuplicateRoleConfigComponent } from '../../components/duplicate-role-config/duplicate-role-config.component';
import { RolesService } from '../../../../../core/services/core/roles.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { Role } from '../../../../../core/models/core/role/role.model';
import { RoleMatrixData } from '../../../../../core/models/core/role/role-matrix.model';
import { ModuleWithMenus } from '../../../../../core/models/core/role/module-with-menus.model';
import { MenuWithActions } from '../../../../../core/models/core/role/menu-with-actions.model';
import { BatchPermissionChange } from '../../../../../core/models/core/role/batch-permission-change.model';
import { BatchPermissionRequest } from '../../../../../core/models/core/role/batch-permission.request';
import { Company } from '../../../../../core/models/company/company.model';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzCheckboxModule,
    NzButtonModule,
    NzSelectModule,
    NzModalModule,
    NzIconModule,
    NzPageHeaderModule,
    BreadcrumbComponent,
    NzSpinModule,
    NzTooltipModule
  ],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent implements OnInit {
  private rolesService = inject(RolesService);
  private companyService = inject(CompanyService);
  private modal = inject(NzModalService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Estructura Organizativa' }, { name: 'Roles y Permisos' }];

  companies = signal<Company[]>([]);
  selectedCompanyId = signal<string | null>(null);

  selectedCompanyName = computed(() => {
    const id = this.selectedCompanyId();
    return this.companies().find(c => c.id === id)?.name || '';
  });

  matrixData = signal<RoleMatrixData | null>(null);
  loading = signal<boolean>(false);

  expandedModules = signal<Set<string>>(new Set());
  expandedMenus = signal<Set<string>>(new Set());

  selectedMenuItems = signal<Set<string>>(new Set());

  pendingChanges: BatchPermissionChange[] = [];

  ngOnInit(): void {
    this.loadCompanies();
  }

  toggleSelectItem(id: string) {
    const newSet = new Set(this.selectedMenuItems());
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    this.selectedMenuItems.set(newSet);
  }

  toggleModuleSelection(module: ModuleWithMenus) {
    const newSet = new Set(this.selectedMenuItems());
    const isCurrentlySelected = newSet.has(module.id);

    if (isCurrentlySelected) {
      newSet.delete(module.id);
      module.menus.forEach(m => newSet.delete(m.id));
    } else {
      newSet.add(module.id);
      module.menus.forEach(m => newSet.add(m.id));
    }
    this.selectedMenuItems.set(newSet);
  }

  toggleMenuSelection(module: ModuleWithMenus, menu: MenuWithActions) {
    const newSet = new Set(this.selectedMenuItems());
    const isCurrentlySelected = newSet.has(menu.id);

    if (isCurrentlySelected) {
      newSet.delete(menu.id);
      newSet.delete(module.id); // Desmarcar padre si un hijo se quita
    } else {
      newSet.add(menu.id);
      // Si todos los hijos están marcados, marcar el padre
      const allMenusSelected = module.menus.every(m => newSet.has(m.id));
      if (allMenusSelected) {
        newSet.add(module.id);
      }
    }
    this.selectedMenuItems.set(newSet);
  }

  isItemSelected(id: string): boolean {
    return this.selectedMenuItems().has(id);
  }

  toggleModule(moduleId: string) {
    const newSet = new Set(this.expandedModules());
    if (newSet.has(moduleId)) {
      newSet.delete(moduleId);
    } else {
      newSet.add(moduleId);
    }
    this.expandedModules.set(newSet);
  }

  toggleMenu(menuId: string) {
    const newSet = new Set(this.expandedMenus());
    if (newSet.has(menuId)) {
      newSet.delete(menuId);
    } else {
      newSet.add(menuId);
    }
    this.expandedMenus.set(newSet);
  }

  isModuleExpanded(moduleId: string): boolean {
    return this.expandedModules().has(moduleId);
  }

  isMenuExpanded(menuId: string): boolean {
    return this.expandedMenus().has(menuId);
  }

  expandAll() {
    const data = this.matrixData();
    if (!data) return;

    const modIds = new Set<string>();
    const menuIds = new Set<string>();

    data.modules.forEach(m => {
      modIds.add(m.id);
      m.menus.forEach(menu => menuIds.add(menu.id));
    });

    this.expandedModules.set(modIds);
    this.expandedMenus.set(menuIds);
  }

  collapseAll() {
    this.expandedModules.set(new Set());
    this.expandedMenus.set(new Set());
  }

  toggleAllPermissions(allowed: boolean) {
    const data = this.matrixData();
    if (!data) return;

    data.modules.forEach(mod => {
      mod.menus.forEach(menu => {
        this.toggleMenuPermissions(menu, allowed, false);
      });
    });

    // Forzamos actualización de la señal de matriz para refrescar la vista
    this.matrixData.set({ ...data });
    this.message.info(allowed ? 'Todos los permisos marcados' : 'Todos los permisos desmarcados');
  }

  toggleMenuPermissions(menu: MenuWithActions, allowed: boolean, updateSignal: boolean = true) {
    const roles = this.matrixData()?.roles || [];

    menu.actions.forEach(action => {
      roles.forEach(role => {
        const currentPermission = action.permissions[role.id];
        if (currentPermission && currentPermission.allowed !== allowed) {
          this.togglePermission(role.id, action.menuItemActionId, !allowed, currentPermission.rolePermissionId || null);
        }
      });
    });

    if (updateSignal) {
      const data = this.matrixData();
      if (data) this.matrixData.set({ ...data });
    }
  }

  toggleRoleColumnPermissions(roleId: string, allowed: boolean) {
    const data = this.matrixData();
    if (!data) return;

    data.modules.forEach(mod => {
      mod.menus.forEach(menu => {
        menu.actions.forEach(action => {
          const currentPermission = action.permissions[roleId];
          if (currentPermission && currentPermission.allowed !== allowed) {
            this.togglePermission(roleId, action.menuItemActionId, !allowed, currentPermission.rolePermissionId || null);
          }
        });
      });
    });

    this.matrixData.set({ ...data });
    const roleName = data.roles.find(r => r.id === roleId)?.name;
    this.message.info(allowed ? `Todos los permisos marcados para ${roleName}` : `Todos los permisos desmarcados para ${roleName}`);
  }

  async loadCompanies() {
    try {
      const data = await this.companyService.getAll();
      this.companies.set(data);
      if (data.length > 0) {
        this.selectedCompanyId.set(data[0].id ?? null);
        this.loadMatrix();
      }
    } catch (error) {
      this.message.error('Error al cargar empresas');
    }
  }

  async loadMatrix() {
    const companyId = this.selectedCompanyId();
    if (!companyId) return;

    this.loading.set(true);
    try {
      const data = await this.rolesService.getMatrix(companyId);
      this.matrixData.set(data);
      this.pendingChanges = [];
      this.selectedMenuItems.set(new Set());
    } catch (error) {
      this.message.error('Error al cargar matriz de permisos');
    } finally {
      this.loading.set(false);
    }
  }

  onCompanyChange(companyId: string) {
    this.selectedCompanyId.set(companyId);
    this.loadMatrix();
  }

  togglePermission(roleId: string, menuItemActionId: string, currentAllowed: boolean, rolePermissionId: string | null) {
    const newAllowed = !currentAllowed;

    // Update local state in matrixData signal to reflect change immediately
    const currentData = this.matrixData();
    if (currentData) {
      // Find and update the permission in the nested structure
      for (const module of currentData.modules) {
        for (const menu of module.menus) {
          for (const action of menu.actions) {
            if (action.menuItemActionId === menuItemActionId) {
              action.permissions[roleId].allowed = newAllowed;
            }
          }
        }
      }
      this.matrixData.set({ ...currentData });
    }

    // Add to pending changes
    const existingChangeIndex = this.pendingChanges.findIndex(
      c => c.roleId === roleId && c.menuItemActionId === menuItemActionId
    );

    if (existingChangeIndex > -1) {
      this.pendingChanges.splice(existingChangeIndex, 1);
    } else {
      this.pendingChanges.push({
        roleId,
        menuItemActionId,
        allowed: newAllowed,
        rolePermissionId
      });
    }
  }

  async saveChanges() {
    const companyId = this.selectedCompanyId();
    if (!companyId) return;

    if (this.pendingChanges.length === 0) {
      this.message.info('No hay cambios pendientes');
      return;
    }

    this.loading.set(true);
    try {
      // Transform pendingChanges to BatchPermissionRequest
      const request: BatchPermissionRequest = {
        companyId: companyId,
        toCreate: this.pendingChanges
          .filter(c => c.allowed)
          .map(c => ({ roleId: c.roleId, menuItemActionId: c.menuItemActionId })),
        toDelete: this.pendingChanges
          .filter(c => !c.allowed && c.rolePermissionId)
          .map(c => c.rolePermissionId!)
      };

      const result = await this.rolesService.batchUpdatePermissions(request);

      if (result.succeeded || !result.errors) {
        this.message.success('Permisos actualizados correctamente');
        this.pendingChanges = [];
        await this.loadMatrix();
      } else {
        this.message.error(result.message || 'Error al actualizar permisos');
      }
    } catch (error: any) {
      this.message.error(error.error?.message || error.message || 'Error al guardar cambios');
    } finally {
      this.loading.set(false);
    }
  }

  openRoleModal(role?: Role) {
    const companyId = this.selectedCompanyId();
    const companyName = this.selectedCompanyName();

    if (!companyId) {
      this.message.warning('Por favor seleccione una empresa primero');
      return;
    }

    const title = role ? `Editar Rol (${companyName})` : `Agregar Rol a ${companyName}`;

    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: RoleFormComponent,
      nzWidth: 500,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzData: {
        roleData: role,
        companyId: companyId,
        companyName: companyName
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadMatrix();
      }
    });
  }

  openAddRoleModal() {
    this.openRoleModal();
  }

  openEditRoleModal(role: Role) {
    this.openRoleModal(role);
  }

  deleteRole(role: Role) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar este rol?',
      nzContent: `<b style="color: red;">${role.name}</b> será eliminado permanentemente.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.rolesService.deleteRole(role.id);
          if (result.succeeded || !result.errors) {
            this.message.success('Rol eliminado correctamente');
            this.loadMatrix();
          } else {
            this.message.error(result.message || 'Error al eliminar el rol');
          }
        } catch (error: any) {
          this.message.error(error.error?.message || error.message || 'Error de conexión');
        }
      }
    });
  }

  duplicateConfig() {
    const sourceCompanyId = this.selectedCompanyId();
    const menuItemIds = Array.from(this.selectedMenuItems());

    if (!sourceCompanyId || menuItemIds.length === 0) {
      this.message.warning('Seleccione módulos o menús para duplicar');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: `Duplicar Configuración a otras Empresas`,
      nzContent: DuplicateRoleConfigComponent,
      nzWidth: 600,
      nzData: {
        sourceCompanyId: sourceCompanyId,
        menuItemIds: menuItemIds,
        companies: this.companies()
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.selectedMenuItems.set(new Set());
      }
    });
  }
}
