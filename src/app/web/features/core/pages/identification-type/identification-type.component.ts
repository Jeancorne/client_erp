import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { IdentificationTypeService } from '../../../../../core/services/core/identification-type.service';
import { IdentificationType } from '../../../../../core/models/core/identification-type/identification-type.model';
import { IdentificationTypeFormComponent } from '../../components/identification-type-form/identification-type-form.component';
import { NzTagComponent } from "ng-zorro-antd/tag";

@Component({
  selector: 'app-identification-type',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzTooltipModule,
    BreadcrumbComponent,
    NzTagComponent
],
  templateUrl: './identification-type.component.html'
})
export class IdentificationTypeComponent implements OnInit {
  private identificationTypeService = inject(IdentificationTypeService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Tipos de Identificación' }];
  
  identificationTypes = signal<IdentificationType[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadData();
  }

  async loadData() {
    this.isLoading.set(true);
    try {
      const data = await this.identificationTypeService.getAll();
      this.identificationTypes.set(data);
    } catch (error) {
      this.message.error('Error al cargar tipos de identificación');
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: IdentificationType) {
    const modalRef = this.modal.create({
      nzTitle: data ? 'Editar Tipo de Identificación' : 'Nuevo Tipo de Identificación',
      nzContent: IdentificationTypeFormComponent,
      nzData: { typeData: data },
      nzFooter: null,
      nzWidth: 600,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzMaskClosable: false
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadData();
    });
  }

  deleteItem(item: IdentificationType) {
    this.modal.confirm({
      nzTitle: '¿Eliminar tipo de identificación?',
      nzContent: `Se eliminará el tipo <b>${item.name}</b> (${item.code}).`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.identificationTypeService.delete(item.id);
          this.message.success('Eliminado correctamente');
          this.loadData();
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }
}
