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
import { BusinessUnitFormComponent } from '../../components/business-unit-form/business-unit-form.component';
import { BusinessUnitService } from '../../../../../core/services/core/business-unit.service';
import { BusinessUnit } from '../../../../../core/models/core/business-unit.models';

@Component({
  selector: 'app-business-unit',
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
  templateUrl: './business-unit.component.html',
  styleUrl: './business-unit.component.css'
})
export class BusinessUnitComponent implements OnInit {
  private modal = inject(NzModalService);
  private businessUnitService = inject(BusinessUnitService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Core System' }, { name: 'Unidades de Negocio' }];

  units = signal<BusinessUnit[]>([]);
  isLoading = signal<boolean>(false);
  searchValue = signal<string>('');

  filteredUnits = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.units();
    if (!term) return list;
    return list.filter(item => 
      item.name.toLowerCase().includes(term) || 
      item.companyName?.toLowerCase().includes(term) ||
      item.managerFullName?.toLowerCase().includes(term)
    );
  });

  sortName = (a: BusinessUnit, b: BusinessUnit) => a.name.localeCompare(b.name);
  sortCompany = (a: BusinessUnit, b: BusinessUnit) => (a.companyName || '').localeCompare(b.companyName || '');
  sortManager = (a: BusinessUnit, b: BusinessUnit) => (a.managerFullName || '').localeCompare(b.managerFullName || '');
  sortStatus = (a: BusinessUnit, b: BusinessUnit) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit() {
    this.loadUnits();
  }

  async loadUnits() {
    this.isLoading.set(true);
    try {
      const data = await this.businessUnitService.getAll();
      this.units.set(data);
    } catch (error) {
      this.message.error('Error al cargar la lista de unidades de negocio');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: BusinessUnit) {
    const title = data ? 'Editar Unidad de Negocio' : 'Registrar Nueva Unidad';
    
    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: BusinessUnitFormComponent,
      nzWidth: 700,
      nzMaskClosable: false,
      nzFooter: null,
      nzData: {
        unitData: data
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadUnits();
      }
    });
  }

  addUnit() { this.openModal(); }
  editUnit(data: BusinessUnit) { this.openModal(data); }

  deleteUnit(data: BusinessUnit) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar esta unidad?',
      nzContent: `<b style="color: red;">${data.name}</b> de la empresa <b>${data.companyName}</b> será eliminada.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const response = await this.businessUnitService.delete(data.id!);
          if (response.succeeded) {
            this.message.success('Unidad eliminada correctamente');
            this.loadUnits();
          } else {
            this.message.error(response.message || 'Error al eliminar la unidad');
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
