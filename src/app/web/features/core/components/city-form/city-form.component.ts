import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CityService } from '../../../../../core/services/core/city.service';
import { City } from '../../../../../core/models/core/city/city.model';

@Component({
  selector: 'app-city-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './city-form.component.html'
})
export class CityFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private cityService = inject(CityService);
  private message = inject(NzMessageService);

  isEditMode = signal(false);
  isSubmitting = signal(false);

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    daneCode: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.modalData && this.modalData.cityData) {
      this.isEditMode.set(true);
      this.validateForm.patchValue(this.modalData.cityData);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const body: City = {
          ...formValues,
          coreStateId: this.modalData.stateId,
          id: this.modalData.cityData?.id
        };

        let result;
        if (this.isEditMode()) {
          result = await this.cityService.update(body.id!, body);
        } else {
          result = await this.cityService.create(body);
        }

        if (result.succeeded) {
          this.message.success(this.isEditMode() ? 'Ciudad actualizada' : 'Ciudad creada');
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
