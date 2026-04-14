import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { FormsModule } from '@angular/forms';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TableFilterComponent } from '../../../../shared/table-filter/table-filter.component';
import { PartnerService } from '../../../../../core/services/core/partner.service';
import { Partner } from '../../../../../core/models/core/partner/partner.model';
import { PartnerFormComponent } from '../../components/partner-form/partner-form.component';

@Component({
  selector: 'app-partner',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzModalModule,
    NzTagModule,
    NzSpinModule,
    NzInputModule,
    NzBadgeModule,
    NzDividerModule,
    BreadcrumbComponent,
    TableFilterComponent
  ],
  templateUrl: './partner.component.html',
  styleUrl: './partner.component.css'
})
export class PartnerComponent implements OnInit {
  private partnerService = inject(PartnerService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Seguridad y Maestros' }, { name: 'Directorio de Terceros' }];
  
  partners = signal<Partner[]>([]);
  isLoading = signal(false);
  searchValue = signal<string>('');

  // Filtrado reactivo computado
  filteredPartners = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.partners();
    if (!term) return list;
    return list.filter(item => 
      item.partnerFullName.toLowerCase().includes(term) || 
      (item.nitTaxId && item.nitTaxId.toLowerCase().includes(term))
    );
  });

  // Funciones de ordenamiento
  sortName = (a: Partner, b: Partner) => a.partnerFullName.localeCompare(b.partnerFullName);
  sortCompanyName = (a: Partner, b: Partner) => (a.companyName || '').localeCompare(b.companyName || '');
  sortNit = (a: Partner, b: Partner) => (a.nitTaxId || '').localeCompare(b.nitTaxId || '');
  sortType = (a: Partner, b: Partner) => (a.partnerType || '').localeCompare(b.partnerType || '');
  sortStatus = (a: Partner, b: Partner) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit(): void {
    this.loadPartners();
  }

  async loadPartners() {
    this.isLoading.set(true);
    try {
      const data = await this.partnerService.getAll();
      this.partners.set(data);
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar terceros');
    } finally {
      this.isLoading.set(false);
    }
  }

  openPartnerModal(partner?: Partner) {
    const title = partner ? 'Editar Tercero' : 'Registrar Nuevo Tercero';
    
    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: PartnerFormComponent,
      nzWidth: 900,
      nzMaskClosable: false,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzData: {
        partnerData: partner
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadPartners();
      }
    });
  }

  deletePartner(partner: Partner) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar este tercero?',
      nzContent: `<b style="color: red;">${partner.partnerFullName}</b> será eliminado permanentemente.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.partnerService.delete(partner.id!);
          if (result.succeeded) {
            this.message.success('Tercero eliminado correctamente');
            this.loadPartners();
          } else {
            this.message.error(result.message || 'Error al eliminar');
          }
        } catch (error: any) {
          this.message.error(error.error?.message || 'Error de conexión');
        }
      }
    });
  }

  importCsv() {
    this.message.info('Funcionalidad de Importar CSV en desarrollo');
  }
}
