import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

// Servicios modulares
import { CurrencyService } from '../../../../../core/services/core/currency.service';
import { FiscalResponsibilityService } from '../../../../../core/services/core/fiscal-responsibility.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { Company } from '../../../../../core/models/company/company.model';
import { Currency } from '../../../../../core/models/core/currency/currency.model';
import { FiscalResponsibility } from '../../../../../core/models/core/fiscal-responsibility/fiscal-responsibility.model';

@Component({
  selector: 'app-company-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzTabsModule
  ],
  templateUrl: './company-form.component.html'
})
export class CompanyFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  
  private currencyService = inject(CurrencyService);
  private fiscalResponsibilityService = inject(FiscalResponsibilityService);
  private companyService = inject(CompanyService);

  originalData = signal<Company | null>(null);
  isEditMode = signal<boolean>(false);

  currencies = signal<Currency[]>([]);
  fiscalResponsibilities = signal<FiscalResponsibility[]>([]);
  parentCompanies = signal<Company[]>([]);
  
  isSubmitting = signal(false);

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    nitTaxId: [null as string | null, [Validators.required]],
    coreCompanyIdParent: [null as string | null],
    coreCurrencyId: [null as string | null, [Validators.required]],
    isBillingContact: [true],
    personType: ['LEGAL' as string | null],
    dianCiiuCode: [null as string | null],
    address: [null as string | null],
    phone: [null as string | null],
    email: [null as string | null, [Validators.email]],
    isMaster: [false],
    isActive: [true],
    fiscalResponsibilityIds: [[] as string[]]
  });

  async ngOnInit() {
    await this.loadMasters();
    
    if (this.modalData && this.modalData.companyData) {
      const data = this.modalData.companyData as Company;
      this.originalData.set(data);
      this.isEditMode.set(true);
      
      // MAPEo ESPECIAL: Convertimos el array de objetos en array de IDs para el selector
      const fiscalIds = data.fiscalResponsibilities?.map(fr => fr.coreFiscalResponsibilityId) || [];
      
      this.validateForm.patchValue({
        ...data,
        fiscalResponsibilityIds: fiscalIds
      });
    }
  }

  async loadMasters() {
    try {
      const [currencies, fiscal, companies] = await Promise.all([
        this.currencyService.getAll(),
        this.fiscalResponsibilityService.getAll(),
        this.companyService.getAll()
      ]);

      this.currencies.set(currencies);
      this.fiscalResponsibilities.set(fiscal);
      this.parentCompanies.set(companies.filter(c => c.id !== this.originalData()?.id));
    } catch (error) {
      this.message.error('Error al cargar datos maestros');
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        let result;

        if (this.isEditMode() && this.originalData()) {
          // Fusionamos manteniendo la integridad del objeto
          const bodyToUpdate: any = {
            ...this.originalData()!,
            ...formValues,
          };
          // Eliminamos la propiedad de solo lectura del GET antes de enviar el PUT
          delete bodyToUpdate.fiscalResponsibilities;
          
          result = await this.companyService.update(bodyToUpdate.id!, bodyToUpdate);
        } else {
          result = await this.companyService.create(formValues as Company);
        }
        
        if (result && result.succeeded !== false) {
          this.message.success(this.isEditMode() ? 'Empresa actualizada correctamente' : 'Empresa registrada correctamente');
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
