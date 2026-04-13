import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RolesService } from '../../../../../core/services/core/roles.service';
import { Role } from '../../../../../core/models/core/role/role.model';

@Component({
  selector: 'app-role-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule
  ],
  templateUrl: './role-form.component.html'
})
export class RoleFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  private rolesService = inject(RolesService);

  isEditMode = signal<boolean>(false);
  isSubmitting = signal<boolean>(false);
  originalData = signal<Role | null>(null);
  companyName = signal<string>('');

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    description: ['']
  });

  ngOnInit(): void {
    if (this.modalData) {
      this.companyName.set(this.modalData.companyName || '');
      
      if (this.modalData.roleData) {
        const data = this.modalData.roleData as Role;
        this.originalData.set(data);
        this.isEditMode.set(true);
        this.validateForm.patchValue({
          name: data.name,
          description: data.description || ''
        });
      }
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const companyId = this.modalData.companyId;

        let result;
        if (this.isEditMode() && this.originalData()) {
          const body = {
            id: this.originalData()!.id,
            coreCompanyId: companyId,
            ...formValues
          };
          result = await this.rolesService.updateRole(body.id, body);
        } else {
          const body = {
            coreCompanyId: companyId,
            ...formValues
          };
          result = await this.rolesService.createRole(body);
        }

        if (result && (result.succeeded || !result.errors)) {
          this.message.success(this.isEditMode() ? 'Rol actualizado correctamente' : 'Rol creado correctamente');
          this.modalRef.destroy({ success: true });
        } else {
          this.message.error(result?.message || 'Error al procesar la solicitud');
        }
      } catch (error: any) {
        this.message.error(error.error?.message || error.message || 'Error de conexión');
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
