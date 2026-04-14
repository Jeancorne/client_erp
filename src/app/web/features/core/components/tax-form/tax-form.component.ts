import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { TaxService } from '../../../../../core/services/core/tax.service';
import { TaxTypeService } from '../../../../../core/services/core/tax-type.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { CountryService } from '../../../../../core/services/core/country.service';
import { StateService } from '../../../../../core/services/core/state.service';
import { CityService } from '../../../../../core/services/core/city.service';

import { Tax } from '../../../../../core/models/core/tax/tax.model';
import { TaxType } from '../../../../../core/models/core/tax-type/tax-type.model';
import { CompanyLookup } from '../../../../../core/models/core/company/company-lookup.model';
import { Country } from '../../../../../core/models/core/country/country.model';
import { State } from '../../../../../core/models/core/state/state.model';
import { City } from '../../../../../core/models/core/city/city.model';

@Component({
  selector: 'app-tax-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzDividerModule,
    NzIconModule
  ],
  templateUrl: './tax-form.component.html',
  styleUrl: './tax-form.component.css'
})
export class TaxFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private taxService = inject(TaxService);
  private taxTypeService = inject(TaxTypeService);
  private companyService = inject(CompanyService);
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private cityService = inject(CityService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);
  isPercentage = signal(true);
  private isInitializing = false;

  taxTypes = signal<TaxType[]>([]);
  companies = signal<CompanyLookup[]>([]);
  countries = signal<Country[]>([]);
  states = signal<State[]>([]);
  cities = signal<City[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    if (this.nzModalData?.taxData) {
      this.isEdit = true;
      this.loadEditData(this.nzModalData.taxData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      coreCompanyId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      coreTaxTypeId: [null, [Validators.required]],
      calculationType: ['PERC', [Validators.required]],
      ratePercent: [0],
      fixedAmount: [0],
      minBaseAmount: [0],
      minBaseUvt: [0],
      coreCountryId: [null],
      coreStateId: [null],
      coreCityId: [null],
      accAccountIdSales: [null],
      accAccountIdPurch: [null],
      isActive: [true]
    });
  }

  async loadEditData(tax: Tax) {
    this.isInitializing = true;
    this.isPercentage.set(tax.calculationType === 'PERC');
    
    if (tax.coreCountryId) {
      const states = await this.stateService.getByCountry(tax.coreCountryId);
      this.states.set(states);
      
      if (tax.coreStateId) {
        const cities = await this.cityService.getByState(tax.coreStateId);
        this.cities.set(cities);
      }
    }
    
    this.validateForm.patchValue(tax);
    
    setTimeout(() => {
      this.isInitializing = false;
    }, 200);
  }

  onCalculationTypeChange(value: string) {
    if (this.isInitializing) return;
    this.isPercentage.set(value === 'PERC');
    if (value === 'PERC') {
      this.validateForm.get('fixedAmount')?.setValue(0);
    } else {
      this.validateForm.get('ratePercent')?.setValue(0);
    }
  }

  async loadLookups() {
    try {
      this.taxTypes.set(await this.taxTypeService.getAll());
      this.companies.set(await this.companyService.getLookup());
      this.countries.set(await this.countryService.getAll());
    } catch (error) {
      this.message.error('Error al cargar datos iniciales');
    }
  }

  async onCountryChange(countryId: string) {
    if (this.isInitializing) return;
    this.validateForm.patchValue({ coreStateId: null, coreCityId: null });
    if (countryId) {
      this.states.set(await this.stateService.getByCountry(countryId));
    } else {
      this.states.set([]);
    }
  }

  async onStateChange(stateId: string) {
    if (this.isInitializing) return;
    this.validateForm.patchValue({ coreCityId: null });
    if (stateId) {
      this.cities.set(await this.cityService.getByState(stateId));
    } else {
      this.cities.set([]);
    }
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.taxData.id;
          await this.taxService.update(data.id, data);
          this.message.success('Impuesto actualizado correctamente');
        } else {
          await this.taxService.create(data);
          this.message.success('Impuesto creado correctamente');
        }
        this.modalRef.close({ success: true });
      } catch (error) {
        this.message.error('Error al guardar el impuesto');
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
