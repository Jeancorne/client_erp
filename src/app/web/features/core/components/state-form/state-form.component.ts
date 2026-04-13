import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { StateService } from '../../../../../core/services/core/state.service';
import { State } from '../../../../../core/models/core/state/state.model';

@Component({
  selector: 'app-state-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './state-form.component.html'
})
export class StateFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private stateService = inject(StateService);
  private message = inject(NzMessageService);

  isEditMode = signal(false);
  isSubmitting = signal(false);

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    code: ['', [Validators.required]]
  });

  ngOnInit(): void {
    if (this.modalData && this.modalData.stateData) {
      this.isEditMode.set(true);
      this.validateForm.patchValue(this.modalData.stateData);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const body: State = {
          ...formValues,
          coreCountryId: this.modalData.countryId,
          id: this.modalData.stateData?.id
        };

        let result;
        if (this.isEditMode()) {
          result = await this.stateService.update(body.id!, body);
        } else {
          result = await this.stateService.create(body);
        }

        if (result.succeeded) {
          this.message.success(this.isEditMode() ? 'Departamento actualizado' : 'Departamento creado');
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
