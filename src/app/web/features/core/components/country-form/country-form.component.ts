import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CountryService } from '../../../../../core/services/core/country.service';
import { Country } from '../../../../../core/models/core/country/country.model';

@Component({
  selector: 'app-country-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './country-form.component.html'
})
export class CountryFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private countryService = inject(CountryService);
  private message = inject(NzMessageService);

  isEditMode = signal(false);
  isSubmitting = signal(false);

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    isoCode2: ['', [Validators.required, Validators.maxLength(2)]],
    phonePrefix: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.modalData && this.modalData.countryData) {
      this.isEditMode.set(true);
      this.validateForm.patchValue(this.modalData.countryData);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        let result;
        if (this.isEditMode()) {
          result = await this.countryService.update(this.modalData.countryData.id, formValues as Country);
        } else {
          result = await this.countryService.create(formValues as Country);
        }

        if (result.succeeded) {
          this.message.success(this.isEditMode() ? 'País actualizado' : 'País creado');
          this.modalRef.destroy({ success: true });
        }
      } catch (error: any) {
        this.message.error(error.error?.message || 'Error al guardar');
      } finally {
        this.isSubmitting.set(false);
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

  handleCancel() {
    this.modalRef.destroy();
  }
}
