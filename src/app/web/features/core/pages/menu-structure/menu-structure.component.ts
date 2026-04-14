import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTreeModule, NzFormatEmitEvent } from 'ng-zorro-antd/tree';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { MenuService as CoreMenuService } from '../../../../../core/services/core/menu.service';
import { MenuItemService } from '../../../../../core/services/core/menu-item.service';
import { ActionService } from '../../../../../core/services/core/action.service';
import { MenuItemActionService } from '../../../../../core/services/core/menu-item-action.service';
import { MenuModule, MenuItem, Action, MenuItemAction } from '../../../../../core/models/core/menu/menu.model';
import { MenuItemFormComponent } from '../../components/menu-item-form/menu-item-form.component';
import { NzModalService } from 'ng-zorro-antd/modal';

type NodeType = 'MODULE' | 'ITEM';

interface SelectedNode {
  type: NodeType;
  data: any;
}

@Component({
  selector: 'app-menu-structure',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzTreeModule,
    NzCardModule,
    NzButtonModule,
    NzIconModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzInputNumberModule,
    NzSpinModule,
    NzPopconfirmModule,
    NzEmptyModule,
    NzTagModule,
    NzDividerModule,
    BreadcrumbComponent
  ],
  providers: [NzModalService],
  templateUrl: './menu-structure.component.html',
  styleUrl: './menu-structure.component.css'
})
export class MenuStructureComponent implements OnInit {
  private menuService = inject(CoreMenuService);
  private menuItemService = inject(MenuItemService);
  private menuItemActionService = inject(MenuItemActionService);
  private actionService = inject(ActionService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);
  private fb = inject(FormBuilder);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Estructura de Menús' }];

  modules = signal<MenuModule[]>([]);
  actions = signal<Action[]>([]);
  isLoading = signal(false);
  isSaving = signal(false);
  selectedNode = signal<SelectedNode | null>(null);

  validateForm!: FormGroup;

  // Árbol computado con toda la jerarquía
  treeData = computed(() => {
    return this.modules().map(m => ({
      title: m.name,
      key: m.id,
      icon: m.icon || 'folder',
      expanded: true,
      type: 'MODULE',
      origin: m,
      children: (m.items || []).map(item => this.mapMenuItemToNode(item))
    }));
  });

  ngOnInit(): void {
    this.initForm();
    this.loadInitialData();
  }

  private initForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null], 
      icon: [null],
      sequence: [0, [Validators.required]],
      isActive: [true]
    });
  }

  async loadInitialData() {
    this.isLoading.set(true);
    try {
      const [modulesData, actionsData] = await Promise.all([
        this.menuService.getTree(),
        this.actionService.getAll()
      ]);
      this.modules.set(modulesData);
      this.actions.set(actionsData);
    } catch (error) {
      this.message.error('Error al cargar la estructura de menús');
    } finally {
      this.isLoading.set(false);
    }
  }

  onNodeClick(event: NzFormatEmitEvent) {
    const node = event.node;
    if (!node) return;

    const origin = node.origin;
    const type = origin['type'] as NodeType;
    const data = origin['origin'];

    this.selectedNode.set({ type, data });

    this.validateForm.patchValue({
      name: data.name,
      code: type === 'MODULE' ? data.moduleCode : data.routePath,
      icon: data.icon || null,
      sequence: data.sequence,
      isActive: !!data.isActive
    });
  }

  private mapMenuItemToNode(item: MenuItem): any {
    return {
      title: item.name,
      key: item.id,
      icon: item.routePath ? 'file' : 'folder',
      isLeaf: (item.subItems || []).length === 0 && !!item.routePath,
      type: 'ITEM',
      origin: item,
      children: (item.subItems || []).map(si => this.mapMenuItemToNode(si))
    };
  }

  async toggleAction(action: Action) {
    const selected = this.selectedNode();
    if (!selected || selected.type !== 'ITEM') return;

    const currentActions: MenuItemAction[] = selected.data.actions || [];
    const existingBinding = currentActions.find(a => a.actionId === action.id);

    try {
      if (existingBinding) {
        await this.menuItemActionService.delete(existingBinding.id);
        this.message.success(`Acción ${action.name} desvinculada`);
      } else {
        await this.menuItemActionService.create(selected.data.id, action.id);
        this.message.success(`Acción ${action.name} vinculada`);
      }
      await this.refreshSelectedNode();
    } catch (error) {
      this.message.error('Error al actualizar acción');
    }
  }

  async refreshSelectedNode() {
    const selected = this.selectedNode();
    if (!selected || selected.type !== 'ITEM') return;

    const updatedItem = await this.menuItemService.getById(selected.data.id);
    if (updatedItem) {
      this.selectedNode.set({ ...selected, data: updatedItem });
      // Recargamos el árbol para que los datos estén sincronizados globalmente
      const modulesData = await this.menuService.getTree();
      this.modules.set(modulesData);
    }
  }

  isActionSelected(actionId: string): boolean {
    const selected = this.selectedNode();
    if (!selected || selected.type !== 'ITEM') return false;
    const currentActions: MenuItemAction[] = selected.data.actions || [];
    return currentActions.some(a => a.actionId === actionId);
  }

  async save() {
    if (this.validateForm.invalid) {
      this.markFormDirty();
      return;
    }

    const selected = this.selectedNode();
    if (!selected) return;

    this.isSaving.set(true);
    const val = this.validateForm.value;
try {
  const id = selected.data.id;
  if (selected.type === 'MODULE') {
    await this.menuService.update(id, {
      id: id,
      name: val.name,
      moduleCode: val.code,
      icon: val.icon,
      sequence: val.sequence,
      isActive: val.isActive
    });
  } else {
    await this.menuItemService.update(id, {
      id: id,
      coreMenuId: selected.data.coreMenuId,
      coreMenuItemIdParent: selected.data.coreMenuItemIdParent,
      moduleCode: selected.data.moduleCode,
      name: val.name,
      routePath: val.code,
      sequence: val.sequence,
      isActive: val.isActive
    });
  }
  this.message.success('Actualizado correctamente');
  this.loadInitialData();
} catch (error) {

      this.message.error('Error al guardar');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteNode() {
    const selected = this.selectedNode();
    if (!selected) return;

    try {
      if (selected.type === 'MODULE') {
        await this.menuService.delete(selected.data.id);
      } else {
        await this.menuItemService.delete(selected.data.id);
      }
      this.message.success('Eliminado');
      this.selectedNode.set(null);
      this.loadInitialData();
    } catch (error) {
      this.message.error('Error al eliminar');
    }
  }

  private markFormDirty() {
    Object.values(this.validateForm.controls).forEach(control => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  addNewChild() {
    const selected = this.selectedNode();
    if (!selected) {
      this.message.warning('Seleccione un nodo padre');
      return;
    }

    const coreMenuId = selected.type === 'MODULE' ? selected.data.id : selected.data.coreMenuId;
    const parentId = selected.type === 'ITEM' ? selected.data.id : null;
    const moduleCode = selected.data.moduleCode;

    const modalRef = this.modal.create({
      nzTitle: `Añadir ítem a "${selected.data.name}"`,
      nzContent: MenuItemFormComponent,
      nzData: {
        coreMenuId: coreMenuId,
        parentId: parentId,
        moduleCode: moduleCode
      },
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '0' }
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result?.success) this.loadInitialData();
    });
  }
}
