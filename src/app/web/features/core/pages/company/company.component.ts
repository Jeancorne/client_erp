import { Component, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';

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
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderModule,
    NzCardModule,
    NzTagModule,
    NzBadgeModule,
    NzDividerModule,
    BreadcrumbComponent
  ],
  templateUrl: './company.component.html',
  styleUrl: './company.component.css'
})
export class CompanyComponent implements OnInit {
  breadcrumbItems = [
    { name: 'Core System' },
    { name: 'Empresas' }
  ];

  companies = signal<Company[]>([]);
  isLoading = signal<boolean>(false);

  ngOnInit() {
    this.loadCompanies();
  }

  async loadCompanies() {
    this.isLoading.set(true);
    // Simulación de carga
    await new Promise(resolve => setTimeout(resolve, 800));
    
    this.companies.set([
      {
        id: '1',
        name: 'Acme Corporation S.A.',
        nitTaxId: '900.123.456-7',
        currency: 'COP',
        personType: 'Jurídica',
        isMaster: true,
        isActive: true
      },
      {
        id: '2',
        name: 'Acme Logistics LLC',
        nitTaxId: '800.987.654-3',
        currency: 'USD',
        personType: 'Jurídica',
        isMaster: false,
        isActive: true
      }
    ]);
    
    this.isLoading.set(false);
  }

  addCompany() { console.log('Nueva Empresa'); }
  editCompany(data: Company) { console.log('Editando:', data.name); }
}
