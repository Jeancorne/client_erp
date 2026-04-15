import { Component, OnInit, inject, signal, effect, untracked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, FormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';

import { AttributeService } from '../../../../../../core/services/inventory/attribute.service';
import { ProductVariantService } from '../../../../../../core/services/inventory/product-variant.service';
import { AttributeLookup, AttributeValueLookup } from '../../../../../../core/models/inventory';
import { ApiResponse } from '../../../../../../core/models/shared/api-response.model';

interface VariantPreview {
  name: string;
  skuCode: string;
  barcode: string | null;
  combination: any[];
}

@Component({
  selector: 'app-variant-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    NzEmptyModule,
    NzTagModule,
    NzBadgeModule,
    NzTooltipModule
  ],
  templateUrl: './variant-config.component.html',
  styleUrls: ['./variant-config.component.css']
})
export class VariantConfigComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private attributeService = inject(AttributeService);
  private productVariantService = inject(ProductVariantService);
  private message = inject(NzMessageService);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  configForm: FormGroup;
  attributes = signal<AttributeLookup[]>([]);
  attributeValuesMap = signal<Record<string, AttributeValueLookup[]>>({});
  isLoading = signal(false);
  isGenerating = signal(false);

  previewVariants = signal<VariantPreview[]>([]);

  constructor() {
    this.configForm = this.fb.group({
      attributeLines: this.fb.array([])
    });

    // Escuchar cambios para previsualizar automáticamente
    this.configForm.valueChanges.subscribe(() => {
      this.generatePreview();
    });
  }

  get attributeLines() {
    return this.configForm.get('attributeLines') as FormArray;
  }

  ngOnInit() {
    this.loadAttributes();
    this.addAttributeLine();
  }

  loadAttributes() {
    const companyId = this.nzModalData?.companyId;
    if (!companyId) return;

    this.attributeService.getAttributesLookup(companyId).subscribe(res => {
      this.attributes.set(res.data);
    });
  }

  addAttributeLine() {
    const line = this.fb.group({
      attributeId: [null, [Validators.required]],
      values: [[], [Validators.required]]
    });
    this.attributeLines.push(line);
  }

  removeAttributeLine(index: number) {
    this.attributeLines.removeAt(index);
  }

  onAttributeChange(attributeId: string, index: number) {
    if (!attributeId) return;

    this.isLoading.set(true);
    this.attributeService.getAttributeValues(attributeId).subscribe(res => {
      const currentMap = this.attributeValuesMap();
      currentMap[attributeId] = res.data;
      this.attributeValuesMap.set({ ...currentMap });
      this.isLoading.set(false);
    });
  }

  selectAllValues(index: number) {
    const attributeId = this.attributeLines.at(index).get('attributeId')?.value;
    if (!attributeId) return;
    const allValues = this.attributeValuesMap()[attributeId]?.map((v: AttributeValueLookup) => v.id) || [];
    this.attributeLines.at(index).get('values')?.setValue(allValues);
  }

  clearValues(index: number) {
    this.attributeLines.at(index).get('values')?.setValue([]);
  }

  generatePreview() {
    const lines = this.attributeLines.value.filter((l: any) => 
      l.attributeId && l.values && l.values.length > 0
    );

    if (lines.length === 0) {
      this.previewVariants.set([]);
      return;
    }

    const arraysToCombine = lines.map((l: any) => {
      return l.values.map((vId: string) => {
        const attr = this.attributes().find((a: AttributeLookup) => a.id === l.attributeId);
        const val = this.attributeValuesMap()[l.attributeId]?.find((v: AttributeValueLookup) => v.id === vId);
        return { 
          attributeId: l.attributeId, 
          attributeName: attr?.name,
          valueId: vId, 
          valueName: val?.name 
        };
      });
    });

    const combinations = this.cartesianProduct(arraysToCombine);
    const productName = this.nzModalData?.productName || 'Producto';
    const productCode = this.nzModalData?.productCode || 'SKU';

    const variants = combinations.map((combo: any[]) => {
      const nameParts = combo.map(c => c.valueName);
      const variantName = `${productName} (${nameParts.join(', ')})`;
      
      const skuSuffix = combo.map(c => {
        const val = c.valueName || '';
        return val.substring(0, 3).toUpperCase();
      }).join('-');
      
      return {
        name: variantName,
        skuCode: `${productCode}-${skuSuffix}`,
        barcode: null,
        combination: combo
      };
    });

    this.previewVariants.set(variants);
  }

  private cartesianProduct(arrays: any[][]) {
    // Algoritmo robusto para producto cartesiano N-dimensional
    return arrays.reduce((a, b) => a.flatMap(d => b.map(e => [d, e].flat())), [[]]);
  }

  save() {
    const variants = this.previewVariants();
    if (variants.length === 0) return;

    this.isGenerating.set(true);
    const productId = this.nzModalData?.productId;
    const variantsToSave = variants.map((v: VariantPreview) => ({
      invProductId: productId,
      name: v.name,
      skuCode: v.skuCode,
      barcode: v.barcode
    }));

    this.saveVariantsRecursively(variantsToSave, 0);
  }

  private saveVariantsRecursively(variants: any[], index: number) {
    if (index >= variants.length) {
      this.message.success(`${variants.length} variantes creadas`);
      this.isGenerating.set(false);
      this.modalRef.close({ success: true });
      return;
    }

    this.productVariantService.createProductVariant(variants[index]).subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.succeeded) {
          this.saveVariantsRecursively(variants, index + 1);
        } else {
          this.message.error(`Error: ${res.message}`);
          this.isGenerating.set(false);
        }
      },
      error: () => {
        this.message.error('Error de red');
        this.isGenerating.set(false);
      }
    });
  }

  cancel() {
    this.modalRef.close();
  }
}
