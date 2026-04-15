import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';

import { ReorderRuleService } from '../../../../../../core/services/inventory/reorder-rule.service';
import { LocationService } from '../../../../../../core/services/inventory/location.service';
import { LocationLookup, ReorderRule } from '../../../../../../core/models/inventory';
import { ApiResponse } from '../../../../../../core/models/shared/api-response.model';

@Component({
  selector: 'app-reorder-rule-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzInputNumberModule
  ],
  templateUrl: './reorder-rule-form.component.html'
})
export class ReorderRuleFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private modalRef = inject(NzModalRef);
  private reorderRuleService = inject(ReorderRuleService);
  private locationService = inject(LocationService);
  private message = inject(NzMessageService);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  ruleForm: FormGroup;
  locations = signal<LocationLookup[]>([]);
  isLoading = signal(false);
  isEdit = false;

  constructor() {
    this.ruleForm = this.fb.group({
      id: [null],
      coreCompanyId: [null, [Validators.required]],
      invProductId: [null, [Validators.required]],
      invLocationId: [null, [Validators.required]],
      minQuantity: [0, [Validators.required, Validators.min(0)]],
      maxQuantity: [0, [Validators.required, Validators.min(0)]],
      multipleQuantity: [1, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit() {
    this.loadLocations();
    const data = this.nzModalData?.ruleData;
    if (data) {
      this.isEdit = true;
      this.ruleForm.patchValue(data);
    } else {
      this.ruleForm.patchValue({
        coreCompanyId: this.nzModalData.companyId,
        invProductId: this.nzModalData.productId
      });
    }
  }

  loadLocations() {
    const companyId = this.nzModalData?.companyId;
    if (!companyId) return;

    this.locationService.getLocationsLookup(companyId).subscribe(res => {
      this.locations.set(res.data);
    });
  }

  save() {
    if (this.ruleForm.invalid) {
      Object.values(this.ruleForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
      return;
    }

    this.isLoading.set(true);
    const val = this.ruleForm.getRawValue();

    const request$ = this.isEdit 
      ? this.reorderRuleService.updateReorderRule(val.id, val)
      : this.reorderRuleService.createReorderRule(val);

    request$.subscribe({
      next: (res: ApiResponse<any>) => {
        if (res.succeeded) {
          this.message.success(this.isEdit ? 'Regla actualizada' : 'Regla creada');
          this.modalRef.close({ success: true });
        } else {
          this.message.error(res.message || 'Error en la operación');
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  cancel() {
    this.modalRef.close();
  }
}
