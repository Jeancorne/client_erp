import { Component, inject, signal, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BranchService } from '../../../../../core/services/core/branch.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { CountryService } from '../../../../../core/services/core/country.service';
import { StateService } from '../../../../../core/services/core/state.service';
import { CityService } from '../../../../../core/services/core/city.service';
import { Branch } from '../../../../../core/models/core/branch.models';
import { Company } from '../../../../../core/models/company.models';
import { Country, State, City } from '../../../../../core/models/core/location.models';

@Component({
  selector: 'app-branch-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule
  ],
  templateUrl: './branch-form.component.html'
})
export class BranchFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  
  private branchService = inject(BranchService);
  private companyService = inject(CompanyService);
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private cityService = inject(CityService);

  originalData = signal<Branch | null>(null);
  isEditMode = signal<boolean>(false);
  isSubmitting = signal(false);

  companies = signal<Company[]>([]);
  countries = signal<Country[]>([]);
  states = signal<State[]>([]);
  cities = signal<City[]>([]);

  selectedCountryId = signal<string | null>(null);
  selectedStateId = signal<string | null>(null);

  validateForm = this.fb.group({
    coreCompanyId: ['', [Validators.required]],
    name: ['', [Validators.required]],
    address: [null as string | null],
    coreCityId: [null as string | null, [Validators.required]],
    phone: [null as string | null],
    defaultAccAnalyticAccountId: [null as string | null],
    isActive: [true]
  });

  async ngOnInit() {
    await this.loadInitialData();
    
    if (this.modalData && this.modalData.branchData) {
      this.isEditMode.set(true);
      const branchId = this.modalData.branchData.id;
      
      try {
        const response = await this.branchService.getById(branchId);
        if (response.succeeded) {
          const data = response.data;
          this.originalData.set(data);
          
          // Primero seteamos los IDs de ubicación para que los selectores carguen
          if (data.coreCountryId) {
            await this.onCountryChange(data.coreCountryId);
          }
          if (data.coreStateId) {
            await this.onStateChange(data.coreStateId);
          }

          this.validateForm.patchValue({
            coreCompanyId: data.coreCompanyId,
            name: data.name,
            address: data.address,
            coreCityId: data.coreCityId,
            phone: data.phone,
            defaultAccAnalyticAccountId: data.defaultAccAnalyticAccountId,
            isActive: data.isActive
          });
        }
      } catch (error) {
        this.message.error('Error al cargar los detalles de la sede');
      }
    }
  }

  async loadInitialData() {
    try {
      const [companies, countries] = await Promise.all([
        this.companyService.getAll(),
        this.countryService.getAll()
      ]);
      this.companies.set(companies);
      this.countries.set(countries);
    } catch (error) {
      this.message.error('Error al cargar datos iniciales');
    }
  }

  async onCountryChange(countryId: string) {
    this.selectedCountryId.set(countryId);
    this.states.set([]);
    this.cities.set([]);
    this.validateForm.patchValue({ coreCityId: null });
    
    if (countryId) {
      try {
        const states = await this.stateService.getByCountry(countryId);
        this.states.set(states);
      } catch (error) {
        this.message.error('Error al cargar departamentos');
      }
    }
  }

  async onStateChange(stateId: string) {
    this.selectedStateId.set(stateId);
    this.cities.set([]);
    this.validateForm.patchValue({ coreCityId: null });
    
    if (stateId) {
      try {
        const cities = await this.cityService.getByState(stateId);
        this.cities.set(cities);
      } catch (error) {
        this.message.error('Error al cargar ciudades');
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
          const bodyToUpdate: Branch = {
            ...this.originalData()!,
            ...formValues,
          };
          result = await this.branchService.update(bodyToUpdate.id!, bodyToUpdate);
        } else {
          result = await this.branchService.create(formValues as Branch);
        }
        
        if (result && result.succeeded !== false) {
          this.message.success(this.isEditMode() ? 'Sede actualizada correctamente' : 'Sede registrada correctamente');
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
