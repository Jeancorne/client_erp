import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { FiscalResponsibilityService } from '../../../../../core/services/core/fiscal-responsibility.service';
import { FiscalResponsibility } from '../../../../../core/models/core/fiscal-responsibility/fiscal-responsibility.model';

@Component({
  selector: 'app-fiscal-responsibility-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzIconModule
  ],
  templateUrl: './fiscal-responsibility-form.component.html',
  styleUrl: './fiscal-responsibility-form.component.css'
})
export class FiscalResponsibilityFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fiscalResponsibilityService = inject(FiscalResponsibilityService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);

  ngOnInit(): void {
    this.initForm();
    if (this.nzModalData?.fiscalData) {
      this.isEdit = true;
      this.validateForm.patchValue(this.nzModalData.fiscalData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required]],
      name: [null, [Validators.required]],
      description: [null],
      isActive: [true]
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.fiscalData.id;
          await this.fiscalResponsibilityService.update(data.id, data);
          this.message.success('Responsabilidad actualizada');
        } else {
          await this.fiscalResponsibilityService.create(data);
          this.message.success('Responsabilidad creada');
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
