import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { TaxTypeService } from '../../../../../core/services/core/tax-type.service';
import { TaxType } from '../../../../../core/models/core/tax-type/tax-type.model';

@Component({
  selector: 'app-tax-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule
  ],
  templateUrl: './tax-type-form.component.html',
  styleUrl: './tax-type-form.component.css'
})
export class TaxTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taxTypeService = inject(TaxTypeService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);

  ngOnInit(): void {
    this.initForm();
    if (this.nzModalData?.taxTypeData) {
      this.isEdit = true;
      this.validateForm.patchValue(this.nzModalData.taxTypeData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      isRetention: [false],
      isActive: [true]
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.taxTypeData.id;
          await this.taxTypeService.update(data.id, data);
          this.message.success('Tipo de impuesto actualizado');
        } else {
          await this.taxTypeService.create(data);
          this.message.success('Tipo de impuesto creado');
        }
        this.modalRef.close({ success: true });
      } catch (error) {
        this.message.error('Error al guardar');
      } finally {
        this.isLoading.set(false);
      }
    } else {
      Object.values(this.validateForm.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  cancel() {
    this.modalRef.close();
  }
}
