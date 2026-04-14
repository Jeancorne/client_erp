import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { FiscalResponsibilityService } from '../../../../../core/services/core/fiscal-responsibility.service';
import { FiscalResponsibility } from '../../../../../core/models/core/fiscal-responsibility/fiscal-responsibility.model';
import { FiscalResponsibilityFormComponent } from '../../components/fiscal-responsibility-form/fiscal-responsibility-form.component';

@Component({
  selector: 'app-fiscal-responsibility',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzDividerModule,
    NzModalModule,
    NzTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './fiscal-responsibility.component.html'
})
export class FiscalResponsibilityComponent implements OnInit {
  private fiscalService = inject(FiscalResponsibilityService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Responsabilidad Fiscal' }];
  
  items = signal<FiscalResponsibility[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const data = await this.fiscalService.getAll();
      this.items.set(data);
    } catch (error) {
      this.message.error('Error al cargar datos');
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: FiscalResponsibility) {
    const modalRef = this.modal.create({
      nzTitle: data ? 'Editar Responsabilidad' : 'Nueva Responsabilidad',
      nzContent: FiscalResponsibilityFormComponent,
      nzData: { fiscalData: data },
      nzFooter: null,
      nzWidth: 650,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzMaskClosable: false
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadData();
    });
  }

  deleteItem(item: FiscalResponsibility) {
    this.modal.confirm({
      nzTitle: '¿Eliminar responsabilidad fiscal?',
      nzContent: `Se eliminará <b>${item.name}</b> (${item.code}).`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.fiscalService.delete(item.id);
          this.message.success('Eliminado correctamente');
          this.loadData();
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }
}
