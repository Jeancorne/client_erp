import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { FormsModule } from '@angular/forms';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TableFilterComponent } from '../../../../shared/table-filter/table-filter.component';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductService } from '../../../../../core/services/inventory/product.service';
import { CategoryService } from '../../../../../core/services/inventory/category.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { Product } from '../../../../../core/models/inventory';
import { CompanyLookup } from '../../../../../core/models/core/company/company-lookup.model';
import { ApiResponse } from '../../../../../core/models/shared/api-response.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzBadgeModule,
    NzDividerModule,
    NzSpinModule,
    NzModalModule,
    NzTooltipModule,
    NzSelectModule,
    NzPageHeaderModule,
    BreadcrumbComponent,
    TableFilterComponent
  ],
  templateUrl: './product-list.component.html'
})
export class ProductListComponent implements OnInit {
  private modal = inject(NzModalService);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  private companyService = inject(CompanyService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Inventarios' }, { name: 'Maestro de Productos' }];

  // State Signals
  products = signal<Product[]>([]);
  categories = signal<Record<string, string>>({});
  companies = signal<CompanyLookup[]>([]);
  selectedCompanyId = signal<string | null>(null);
  
  isLoading = signal<boolean>(false);
  searchValue = signal<string>('');
  
  // Filtros de Columna
  filterType = signal<string[]>([]);
  filterStatus = signal<boolean | null>(null);

  typeFilterOptions = [
    { text: 'Almacenable', value: 'STOR' },
    { text: 'Consumible', value: 'CONS' },
    { text: 'Servicio', value: 'SERV' }
  ];

  statusFilterOptions = [
    { text: 'Activo', value: true },
    { text: 'Inactivo', value: false }
  ];

  // Funciones de Ordenamiento
  sortSKU = (a: Product, b: Product) => a.defaultCode.localeCompare(b.defaultCode);
  sortName = (a: Product, b: Product) => a.name.localeCompare(b.name);
  sortCost = (a: Product, b: Product) => a.purchaseCostAvg - b.purchaseCostAvg;

  filteredProducts = computed(() => {
    let list = this.products();
    const term = this.searchValue().toLowerCase();
    const types = this.filterType();
    const status = this.filterStatus();

    // 1. Filtro por Texto
    if (term) {
      list = list.filter(item => 
        item.name.toLowerCase().includes(term) || 
        item.defaultCode.toLowerCase().includes(term) ||
        item.barcode?.toLowerCase().includes(term)
      );
    }

    // 2. Filtro por Tipo (Multiselect)
    if (types.length > 0) {
      list = list.filter(item => types.includes(item.productType));
    }

    // 3. Filtro por Estado
    if (status !== null) {
      list = list.filter(item => item.isActive === status);
    }

    return list;
  });

  ngOnInit() {
    this.loadInitialData();
  }

  async loadInitialData() {
    this.isLoading.set(true);
    try {
      const companies = await this.companyService.getLookup();
      this.companies.set(companies);
      if (companies.length === 1) {
        const companyId = companies[0].id;
        this.selectedCompanyId.set(companyId);
        this.onCompanyChange(companyId);
      }
    } catch (error) {
      this.message.error('Error al cargar empresas');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCompanyChange(companyId: string) {
    if (!companyId) {
      this.products.set([]);
      this.categories.set({});
      return;
    }

    this.isLoading.set(true);
    this.categoryService.getCategoriesLookup(companyId).subscribe(res => {
      const map: Record<string, string> = {};
      res.data.forEach(c => map[c.id] = c.name);
      this.categories.set(map);
      this.loadProducts(companyId);
    });
  }

  async loadProducts(companyId: string) {
    this.isLoading.set(true);
    this.productService.getProducts(companyId).subscribe({
      next: (response: ApiResponse<Product[]>) => {
        if (response.succeeded) {
          this.products.set(response.data);
        } else {
          this.message.error(response.message || 'Error al cargar productos');
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.message.error('Error de conexión al cargar productos');
        this.isLoading.set(false);
      }
    });
  }

  openModal(data?: Product) {
    const title = data ? `Editar Producto: ${data.name}` : 'Registrar Nuevo Producto';
    
    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: ProductFormComponent,
      nzWidth: 1000,
      nzMaskClosable: false,
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '24px' },
      nzData: {
        productData: data,
        companyId: this.selectedCompanyId() // Enviamos la empresa actual
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success && this.selectedCompanyId()) {
        this.loadProducts(this.selectedCompanyId()!);
      }
    });
  }

  addProduct() { this.openModal(); }
  editProduct(data: Product) { this.openModal(data); }

  deleteProduct(data: Product) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar este producto?',
      nzContent: `<b style="color: red;">${data.defaultCode}</b> - ${data.name} será eliminado.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => {
        return new Promise((resolve) => {
          this.productService.deleteProduct(data.id).subscribe({
            next: (response: ApiResponse<any>) => {
              if (response.succeeded) {
                this.message.success('Producto eliminado correctamente');
                if (this.selectedCompanyId()) {
                  this.loadProducts(this.selectedCompanyId()!);
                }
              } else {
                this.message.error(response.message || 'Error al eliminar el producto');
              }
              resolve(true);
            },
            error: (err) => {
              this.message.error('Error al intentar eliminar el producto');
              resolve(false);
            }
          });
        });
      },
      nzCancelText: 'Cancelar'
    });
  }
}
