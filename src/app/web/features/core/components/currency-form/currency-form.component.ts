import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { CurrencyService } from '../../../../../core/services/core/currency.service';
import { Currency } from '../../../../../core/models/core/currency/currency.model';

@Component({
  selector: 'app-currency-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './currency-form.component.html',
  styleUrl: './currency-form.component.css'
})
export class CurrencyFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private currencyService = inject(CurrencyService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);

  ngOnInit(): void {
    this.initForm();
    if (this.nzModalData?.currencyData) {
      this.isEdit = true;
      this.validateForm.patchValue(this.nzModalData.currencyData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      code: [null, [Validators.required, Validators.maxLength(5)]],
      name: [null, [Validators.required]],
      symbol: [null, [Validators.required, Validators.maxLength(5)]]
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.currencyData.id;
          await this.currencyService.update(data.id, data);
          this.message.success('Moneda actualizada');
        } else {
          await this.currencyService.create(data);
          this.message.success('Moneda creada');
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
