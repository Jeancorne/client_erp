import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TableFilterComponent } from '../../../../shared/table-filter/table-filter.component';
import { BranchFormComponent } from '../../components/branch-form/branch-form.component';
import { BranchService } from '../../../../../core/services/core/branch.service';
import { Branch } from '../../../../../core/models/core/branch.models';

@Component({
  selector: 'app-branch',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderModule,
    NzCardModule,
    NzTagModule,
    NzBadgeModule,
    NzDividerModule,
    BreadcrumbComponent,
    NzSpinModule,
    TableFilterComponent,
    NzModalModule
  ],
  templateUrl: './branch.component.html',
  styleUrl: './branch.component.css'
})
export class BranchComponent implements OnInit {
  private modal = inject(NzModalService);
  private branchService = inject(BranchService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Estructura Organizativa' }, { name: 'Sedes / Sucursales' }];

  branches = signal<Branch[]>([]);
  isLoading = signal<boolean>(false);
  searchValue = signal<string>('');

  filteredBranches = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.branches();
    if (!term) return list;
    return list.filter(item =>
      item.name.toLowerCase().includes(term) ||
      item.companyName?.toLowerCase().includes(term) ||
      item.cityName?.toLowerCase().includes(term)
    );
  });

  sortName = (a: Branch, b: Branch) => a.name.localeCompare(b.name);
  sortCompany = (a: Branch, b: Branch) => (a.companyName || '').localeCompare(b.companyName || '');
  sortCity = (a: Branch, b: Branch) => (a.cityName || '').localeCompare(b.cityName || '');
  sortStatus = (a: Branch, b: Branch) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit() {
    this.loadBranches();
  }

  async loadBranches() {
    this.isLoading.set(true);
    try {
      const data = await this.branchService.getAll();
      this.branches.set(data);
    } catch (error) {
      this.message.error('Error al cargar la lista de sedes');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: Branch) {
    const title = data ? 'Editar Sede' : 'Registrar Nueva Sede';

    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: BranchFormComponent,
      nzWidth: 800,
      nzMaskClosable: false,
      nzFooter: null,
      nzData: {
        branchData: data
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadBranches();
      }
    });
  }

  addBranch() { this.openModal(); }
  editBranch(data: Branch) { this.openModal(data); }

  deleteBranch(data: Branch) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar esta sede?',
      nzContent: `<b style="color: red;">${data.name}</b> de la empresa <b>${data.companyName}</b> será eliminada.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const response = await this.branchService.delete(data.id!);
          if (response.succeeded) {
            this.message.success('Sede eliminada correctamente');
            this.loadBranches();
          } else {
            this.message.error(response.message || 'Error al eliminar la sede');
          }
        } catch (error) {
          this.message.error('Ocurrió un error inesperado al eliminar');
          console.error(error);
        }
      },
      nzCancelText: 'Cancelar'
    });
  }
}
