import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { RolesService } from '../../../../../core/services/core/roles.service';
import { DuplicatePermissionRequest } from '../../../../../core/models/core/role/duplicate-permission.request';

@Component({
  selector: 'app-duplicate-role-config',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzButtonModule,
    NzSelectModule
  ],
  templateUrl: './duplicate-role-config.component.html'
})
export class DuplicateRoleConfigComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  private rolesService = inject(RolesService);

  isSubmitting = signal<boolean>(false);
  availableCompanies = signal<any[]>([]);

  validateForm = this.fb.group({
    targetCompanyIds: [[] as string[], [Validators.required]]
  });

  ngOnInit(): void {
    if (this.modalData) {
      const sourceId = this.modalData.sourceCompanyId;
      const allCompanies = this.modalData.companies || [];
      this.availableCompanies.set(allCompanies.filter((c: any) => c.id !== sourceId));
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const request: DuplicatePermissionRequest = {
          sourceCompanyId: this.modalData.sourceCompanyId,
          targetCompanyIds: formValues.targetCompanyIds,
          menuItemIds: this.modalData.menuItemIds
        };

        const result = await this.rolesService.duplicateConfiguration(request);
        
        if (result.succeeded || !result.errors) {
          this.message.success('Configuración duplicada correctamente');
          this.modalRef.destroy({ success: true });
        } else {
          this.message.error(result.message || 'Error al duplicar configuración');
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
