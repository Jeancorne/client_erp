import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BusinessUnitService } from '../../../../../core/services/core/business-unit.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { UserCompanyService } from '../../../../../core/services/core/user-company.service';
import { BusinessUnit } from '../../../../../core/models/core/business-unit.models';
import { Company } from '../../../../../core/models/company.models';

@Component({
  selector: 'app-business-unit-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule
  ],
  templateUrl: './business-unit-form.component.html'
})
export class BusinessUnitFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  
  private businessUnitService = inject(BusinessUnitService);
  private companyService = inject(CompanyService);
  private userCompanyService = inject(UserCompanyService);

  originalData = signal<BusinessUnit | null>(null);
  isEditMode = signal<boolean>(false);
  isSubmitting = signal(false);

  companies = signal<Company[]>([]);
  managers = signal<any[]>([]);

  validateForm = this.fb.group({
    coreCompanyId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    coreUserIdManager: [null as string | null, [Validators.required]],
    isActive: [true]
  });

  async ngOnInit() {
    await this.loadInitialData();
    
    if (this.modalData && this.modalData.unitData) {
      this.isEditMode.set(true);
      const unitId = this.modalData.unitData.id;
      
      try {
        const response = await this.businessUnitService.getById(unitId);
        if (response.succeeded) {
          const data = response.data;
          this.originalData.set(data);
          
          if (data.coreCompanyId) {
            await this.onCompanyChange(data.coreCompanyId);
          }

          this.validateForm.patchValue({
            coreCompanyId: data.coreCompanyId,
            name: data.name,
            coreUserIdManager: data.coreUserIdManager,
            isActive: data.isActive
          });
        }
      } catch (error) {
        this.message.error('Error al cargar los detalles de la unidad de negocio');
      }
    }
  }

  async loadInitialData() {
    try {
      const companies = await this.companyService.getAll();
      this.companies.set(companies);
    } catch (error) {
      this.message.error('Error al cargar datos iniciales');
    }
  }

  async onCompanyChange(companyId: string) {
    this.managers.set([]);
    this.validateForm.patchValue({ coreUserIdManager: null });
    
    if (companyId) {
      try {
        const users = await this.userCompanyService.getUsersByCompany(companyId);
        this.managers.set(users);
      } catch (error) {
        this.message.error('Error al cargar responsables');
      }
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        let result;

        if (this.isEditMode() && this.originalData()) {
          const bodyToUpdate: BusinessUnit = {
            ...this.originalData()!,
            ...formValues,
          };
          result = await this.businessUnitService.update(bodyToUpdate.id!, bodyToUpdate);
        } else {
          result = await this.businessUnitService.create(formValues as BusinessUnit);
        }
        
        if (result && result.succeeded !== false) {
          this.message.success(this.isEditMode() ? 'Unidad de negocio actualizada correctamente' : 'Unidad de negocio registrada correctamente');
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
