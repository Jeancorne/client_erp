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
import { TaxService } from '../../../../../core/services/core/tax.service';
import { Tax } from '../../../../../core/models/core/tax/tax.model';
import { TaxFormComponent } from '../../components/tax-form/tax-form.component';

@Component({
  selector: 'app-tax',
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
  templateUrl: './tax.component.html',
  styleUrl: './tax.component.css'
})
export class TaxComponent implements OnInit {
  private taxService = inject(TaxService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Catálogo de Impuestos' }];
  
  taxes = signal<Tax[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadTaxes();
  }

  async loadTaxes() {
    this.isLoading.set(true);
    try {
      const data = await this.taxService.getAll();
      this.taxes.set(data);
    } catch (error) {
      this.message.error('Error al cargar impuestos');
    } finally {
      this.isLoading.set(false);
    }
  }

  openTaxModal(tax?: Tax) {
    const modalRef = this.modal.create({
      nzTitle: tax ? 'Editar Impuesto' : 'Nuevo Impuesto',
      nzContent: TaxFormComponent,
      nzData: { taxData: tax },
      nzFooter: null,
      nzWidth: 800,
      nzCentered: true,
      nzMaskClosable: false,
      nzBodyStyle: { padding: '0' }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadTaxes();
    });
  }

  deleteTax(tax: Tax) {
    this.modal.confirm({
      nzTitle: '¿Eliminar impuesto?',
      nzContent: `Se eliminará el impuesto <b>${tax.name}</b>. Esta acción no se puede deshacer.`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.taxService.delete(tax.id);
          this.message.success('Impuesto eliminado correctamente');
          this.loadTaxes();
        } catch (error) {
          this.message.error('Error al eliminar el impuesto');
        }
      }
    });
  }
}
