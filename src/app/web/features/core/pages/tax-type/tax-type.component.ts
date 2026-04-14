import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TaxTypeService } from '../../../../../core/services/core/tax-type.service';
import { TaxType } from '../../../../../core/models/core/tax-type/tax-type.model';
import { TaxTypeFormComponent } from '../../components/tax-type-form/tax-type-form.component';

@Component({
  selector: 'app-tax-type',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzTagModule,
    NzTooltipModule,
    BreadcrumbComponent
  ],
  providers: [NzModalService],
  templateUrl: './tax-type.component.html'
})
export class TaxTypeComponent implements OnInit {
  private taxTypeService = inject(TaxTypeService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Tipos de Impuestos' }];
  
  taxTypes = signal<TaxType[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const data = await this.taxTypeService.getAll();
      this.taxTypes.set(data);
    } catch (error) {
      this.message.error('Error al cargar tipos de impuestos');
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: TaxType) {
    const modalRef = this.modal.create({
      nzTitle: data ? 'Editar Tipo de Impuesto' : 'Nuevo Tipo de Impuesto',
      nzContent: TaxTypeFormComponent,
      nzData: { taxTypeData: data },
      nzFooter: null,
      nzWidth: 500,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzMaskClosable: false
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result?.success) this.loadData();
    });
  }

  deleteItem(item: TaxType) {
    this.modal.confirm({
      nzTitle: '¿Eliminar tipo de impuesto?',
      nzContent: `Se eliminará el tipo <b>${item.name}</b> (${item.code}).`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.taxTypeService.delete(item.id);
          this.message.success('Eliminado correctamente');
          this.loadData();
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }
}
