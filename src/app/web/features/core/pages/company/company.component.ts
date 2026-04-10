import { Component, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzDropdownModule } from 'ng-zorro-antd/dropdown';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TableFilterComponent } from '../../../../shared/table-filter/table-filter.component';

interface Company {
  id: string;
  name: string;
  nitTaxId: string;
  currency: string;
  personType: string;
  isMaster: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
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
    NzInputModule,
    NzDropdownModule,
    TableFilterComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  breadcrumbItems = [{ name: 'Estructura Organizativa' }, { name: 'Empresas' }];

  // Estado de los datos
  companies = signal<Company[]>([]);
  isLoading = signal<boolean>(false);

  // Estado de la búsqueda
  searchValue = signal<string>('');
  searchVisible = false;

  // Signal Computado para el filtrado reactivo
  filteredCompanies = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.companies();
    if (!term) return list;
    return list.filter(item => item.name.toLowerCase().includes(term));
  });

  // Funciones de ordenamiento
  sortName = (a: Company, b: Company) => a.name.localeCompare(b.name);
  sortNit = (a: Company, b: Company) => a.nitTaxId.localeCompare(b.nitTaxId);
  sortCurrency = (a: Company, b: Company) => a.currency.localeCompare(b.currency);
  sortType = (a: Company, b: Company) => a.personType.localeCompare(b.personType);
  sortStatus = (a: Company, b: Company) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit() {
    this.loadCompanies();
  }

  async loadCompanies() {
    this.isLoading.set(true);
    await new Promise(resolve => setTimeout(resolve, 800));

    this.companies.set([
      { id: '1', name: 'Acme Corporation S.A.', nitTaxId: '900.123.456-7', currency: 'COP', personType: 'Jurídica', isMaster: true, isActive: true },
      { id: '2', name: 'Acme Logistics LLC', nitTaxId: '800.987.654-3', currency: 'USD', personType: 'Jurídica', isMaster: false, isActive: true },
      { id: '3', name: 'Globex Corp', nitTaxId: '700.555.444-1', currency: 'EUR', personType: 'Jurídica', isMaster: false, isActive: false }
    ]);

    this.isLoading.set(false);
  }

  resetSearch() {
    this.searchValue.set('');
    this.searchVisible = false;
  }

  addCompany() { console.log('Nueva Empresa'); }
  editCompany(data: Company) { console.log('Editando:', data.name); }
}
