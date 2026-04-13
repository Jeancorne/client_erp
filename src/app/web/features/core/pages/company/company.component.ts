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
import { CompanyFormComponent } from '../../components/company-form/company-form.component';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { Company } from '../../../../../core/models/company/company.model';

@Component({
  selector: 'app-company',
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
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  private modal = inject(NzModalService);
  private companyService = inject(CompanyService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Estructura Organizativa' }, { name: 'Empresas' }];

  companies = signal<Company[]>([]);
  isLoading = signal<boolean>(false);
  searchValue = signal<string>('');

  // Filtrado reactivo computado
  filteredCompanies = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.companies();
    if (!term) return list;
    return list.filter(item => item.name.toLowerCase().includes(term));
  });

  // Funciones de ordenamiento
  sortName = (a: Company, b: Company) => a.name.localeCompare(b.name);
  sortNit = (a: Company, b: Company) => (a.nitTaxId || '').localeCompare(b.nitTaxId || '');
  sortCurrency = (a: Company, b: Company) => (a.coreCurrencyId || '').localeCompare(b.coreCurrencyId || '');
  sortType = (a: Company, b: Company) => (a.personType || '').localeCompare(b.personType || '');
  sortStatus = (a: Company, b: Company) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit() {
    this.loadCompanies();
  }

  async loadCompanies() {
    this.isLoading.set(true);
    try {
      const data = await this.companyService.getAll();
      this.companies.set(data);
    } catch (error) {
      this.message.error('Error al cargar la lista de empresas');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: Company) {
    const title = data ? 'Editar Empresa' : 'Registrar Nueva Empresa';
    
    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: CompanyFormComponent,
      nzWidth: 800,
      nzMaskClosable: false,
      nzFooter: null,
      nzData: {
        companyData: data,
        companies: this.companies()
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadCompanies();
      }
    });
  }

  addCompany() { this.openModal(); }
  editCompany(data: Company) { this.openModal(data); }

  deleteCompany(data: Company) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar esta empresa?',
      nzContent: `<b style="color: red;">${data.name}</b> será eliminada permanentemente.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const response = await this.companyService.delete(data.id!);
          if (response.succeeded) {
            this.message.success('Empresa eliminada correctamente');
            this.loadCompanies();
          } else {
            this.message.error(response.message || 'Error al eliminar la empresa');
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
