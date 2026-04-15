import { Component, OnInit, inject, signal, input, output, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzUploadModule } from 'ng-zorro-antd/upload';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { Observable } from 'rxjs';

import { ProductService } from '../../../../../core/services/inventory/product.service';
import { ProductVariantService } from '../../../../../core/services/inventory/product-variant.service';
import { ReorderRuleService } from '../../../../../core/services/inventory/reorder-rule.service';
import { CategoryService } from '../../../../../core/services/inventory/category.service';
import { UomService } from '../../../../../core/services/inventory/uom.service';
import { LocationService } from '../../../../../core/services/inventory/location.service';
import { CompanyService } from '../../../../../core/services/core/company.service';

import { 
  CategoryLookup, 
  UomLookup,   
  ProductVariant,
  ReorderRule,
  Product,
  LocationLookup
} from '../../../../../core/models/inventory';
import { CompanyLookup } from '../../../../../core/models/core/company/company-lookup.model';
import { ApiResponse } from '../../../../../core/models/shared/api-response.model';
import { NzTagModule } from "ng-zorro-antd/tag";
import { VariantConfigComponent } from './variant-config/variant-config.component';
import { ReorderRuleFormComponent } from './reorder-rule-form/reorder-rule-form.component';
import { NzEmptyComponent } from "ng-zorro-antd/empty";

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTabsModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzUploadModule,
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule,
    NzTooltipModule,
    NzEmptyComponent
],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css'
})
export class ProductFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef, { optional: true });
  private modalService = inject(NzModalService);
  private productService = inject(ProductService);
  private productVariantService = inject(ProductVariantService);
  private reorderRuleService = inject(ReorderRuleService);
  private categoryService = inject(CategoryService);
  private uomService = inject(UomService);
  private locationService = inject(LocationService);
  private companyService = inject(CompanyService);
  private message = inject(NzMessageService);
  readonly nzModalData = inject(NZ_MODAL_DATA, { optional: true });

  // Inputs & Outputs for embedded usage
  productData = input<Product | null>(null);
  companyId = input<string | null>(null); 
  onSuccess = output<void>();
  onCancel = output<void>();

  productForm: FormGroup;
  isEdit = signal(false);
  isLoading = signal(false);
  isModal = false;
  activeCompanyId: string | null = null;

  // Lookups
  categories = signal<CategoryLookup[]>([]);
  uoms = signal<UomLookup[]>([]);
  companies = signal<CompanyLookup[]>([]);
  locationsMap = signal<Record<string, string>>({});
  
  // Tab Data
  variants = signal<ProductVariant[]>([]);
  reorderRules = signal<ReorderRule[]>([]);

  // Inline Edit State for Variants
  editId = signal<string | null>(null);
  editCache: Record<string, { data: ProductVariant }> = {};

  constructor() {
    this.isModal = !!this.modalRef;

    this.productForm = this.fb.group({
      id: [null],
      coreCompanyId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      defaultCode: [null, [Validators.required]],
      barcode: [null],
      productType: ['STOR', [Validators.required]],
      invCategoryId: [null, [Validators.required]],
      invUomId: [null, [Validators.required]],
      invUomIdPurchase: [null],
      invUomIdSale: [null],
      salePrice: [0, [Validators.required, Validators.min(0)]],
      standardPrice: [0, [Validators.required, Validators.min(0)]],
      purchaseCostAvg: [{ value: 0, disabled: true }],
      costMethod: ['AVG', [Validators.required]],
      weight: [0],
      volume: [0],
      imageUrl: [null],
      isActive: [true]
    });

    // Effect for embedded Master-Detail flow
    effect(() => {
      const data = this.productData();
      const compId = this.companyId();
      if (this.isModal) return;

      untracked(() => {
        this.activeCompanyId = compId;
        if (data) {
          this.fillForm(data);
        } else {
          this.isEdit.set(false);
          this.resetForm();
        }
      });
    });
  }

  ngOnInit() {
    if (this.isModal) {
      this.activeCompanyId = this.nzModalData?.companyId || null;
    } else {
      this.activeCompanyId = this.companyId();
    }

    this.loadLookups();
    
    if (this.isModal && this.nzModalData?.productData) {
      this.fillForm(this.nzModalData.productData);
    } else if (!this.isModal && !this.productData()) {
      this.resetForm();
    }
  }

  private fillForm(data: Product) {
    this.isEdit.set(true);
    this.productForm.patchValue(data);
    this.loadTabsData(data.id);
  }

  resetForm() {
    this.productForm.reset({
      productType: 'STOR',
      costMethod: 'AVG',
      isActive: true,
      salePrice: 0,
      standardPrice: 0,
      coreCompanyId: this.activeCompanyId 
    });
    this.variants.set([]);
    this.reorderRules.set([]);
  }

  loadLookups() {
    if (!this.activeCompanyId) {
      this.companyService.getLookup().then(data => this.companies.set(data));
      this.uomService.getUomsLookup().subscribe(res => this.uoms.set(res.data));
      return;
    }

    this.locationService.getLocationsLookup(this.activeCompanyId).subscribe(res => {
      const map: Record<string, string> = {};
      res.data.forEach(l => map[l.id] = l.name);
      this.locationsMap.set(map);
    });

    this.categoryService.getCategoriesLookup(this.activeCompanyId).subscribe((res: ApiResponse<any>) => {
      this.categories.set(res.data);
    });
    
    this.uomService.getUomsLookup().subscribe(res => this.uoms.set(res.data));
    this.companyService.getLookup().then(data => this.companies.set(data));
  }

  loadTabsData(productId: string) {
    if (!productId) return;
    this.productVariantService.getProductVariants(productId).subscribe(res => {
      this.variants.set(res.data);
      this.updateEditCache();
    });
    this.reorderRuleService.getReorderRules(productId).subscribe(res => this.reorderRules.set(res.data));
  }

  updateEditCache(): void {
    this.variants().forEach(item => {
      this.editCache[item.id] = {
        data: { ...item }
      };
    });
  }

  save() {
    if (this.productForm.invalid) {
      Object.values(this.productForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isLoading.set(true);
    const productValue = this.productForm.getRawValue();

    const request$: Observable<ApiResponse<any>> = this.isEdit() 
      ? this.productService.updateProduct(productValue.id, productValue)
      : this.productService.createProduct(productValue);

    request$.subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.succeeded) {
          this.message.success(this.isEdit() ? 'Producto actualizado' : 'Producto creado');
          if (this.modalRef) this.modalRef.close({ success: true });
          this.onSuccess.emit();
        } else {
          this.message.error(res.message || 'Error en la operación');
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  cancel() {
    if (this.modalRef) this.modalRef.close();
    this.onCancel.emit();
  }

  // --- Variant Actions ---
  generateVariants() {
    const productId = this.productForm.get('id')?.value;
    if (!productId) {
      this.message.warning('Primero debe guardar el producto para generar variantes');
      return;
    }

    const modal = this.modalService.create({
      nzTitle: 'Configuración de Variantes / Atributos',
      nzContent: VariantConfigComponent,
      nzWidth: 1000,
      nzCentered: true,
      nzMaskClosable: false,
      nzFooter: null,
      nzData: {
        productId: productId,
        companyId: this.activeCompanyId,
        productName: this.productForm.get('name')?.value,
        productCode: this.productForm.get('defaultCode')?.value
      }
    });

    modal.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadTabsData(productId);
      }
    });
  }

  startEditVariant(id: string): void {
    this.editId.set(id);
  }

  cancelEditVariant(id: string): void {
    const index = this.variants().findIndex(item => item.id === id);
    this.editCache[id].data = { ...this.variants()[index] };
    this.editId.set(null);
  }

  saveEditVariant(id: string): void {
    const updatedData = this.editCache[id].data;
    this.productVariantService.updateProductVariant(id, updatedData).subscribe((res: ApiResponse<any>) => {
      if (res.succeeded) {
        this.message.success('Variante actualizada');
        this.editId.set(null);
        this.loadTabsData(this.productForm.get('id')?.value);
      } else {
        this.message.error(res.message || 'Error al actualizar');
      }
    });
  }

  deleteVariant(v: ProductVariant) {
    this.modalService.confirm({
      nzTitle: '¿Eliminar variante?',
      nzContent: `¿Estás seguro de eliminar la variante <b>${v.skuCode}</b>?`,
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.productVariantService.deleteProductVariant(v.id).subscribe((res: ApiResponse<any>) => {
          if (res.succeeded) {
            this.message.success('Variante eliminada');
            this.loadTabsData(this.productForm.get('id')?.value);
          }
        });
      }
    });
  }

  // --- Reorder Rule Actions ---
  addReorderRule(rule?: ReorderRule) {
    const productId = this.productForm.get('id')?.value;
    if (!productId) {
      this.message.warning('Guarde el producto primero');
      return;
    }

    const modal = this.modalService.create({
      nzTitle: rule ? 'Editar Regla de Abastecimiento' : 'Nueva Regla de Abastecimiento',
      nzContent: ReorderRuleFormComponent,
      nzWidth: 600,
      nzCentered: true,
      nzFooter: null,
      nzData: {
        productId: productId,
        companyId: this.activeCompanyId,
        ruleData: rule
      }
    });

    modal.afterClose.subscribe(res => {
      if (res?.success) {
        this.loadTabsData(productId);
      }
    });
  }

  deleteReorderRule(id: string) {
    this.modalService.confirm({
      nzTitle: '¿Eliminar regla?',
      nzContent: '¿Estás seguro de eliminar esta regla de reabastecimiento?',
      nzOkText: 'Eliminar',
      nzOkDanger: true,
      nzOnOk: () => {
        this.reorderRuleService.deleteReorderRule(id).subscribe((res: ApiResponse<any>) => {
          if (res.succeeded) {
            this.message.success('Regla eliminada');
            const productId = this.productForm.get('id')?.value;
            if (productId) this.loadTabsData(productId);
          }
        });
      }
    });
  }

  // Formatters
  formatterDollar = (value: number | string): string => 
    value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ 0';
  
  parserDollar = (value: string): number => 
    Number(value.replace(/\$\s?|(,*)/g, ''));
}
