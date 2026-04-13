import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from '../../../../../core/services/core/partner.service';
import { CountryService } from '../../../../../core/services/core/country.service';
import { StateService } from '../../../../../core/services/core/state.service';
import { CityService } from '../../../../../core/services/core/city.service';
import { PartnerAddress } from '../../../../../core/models/core/partner/partner-address.model';
import { Country } from '../../../../../core/models/core/country/country.model';
import { State } from '../../../../../core/models/core/state/state.model';

@Component({
  selector: 'app-partner-address-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzSwitchModule
  ],
  templateUrl: './partner-address-form.component.html'
})
export class PartnerAddressFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private partnerService = inject(PartnerService);
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private cityService = inject(CityService);
  private message = inject(NzMessageService);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  
  countries = signal<Country[]>([]);
  states = signal<State[]>([]);
  cities = signal<any[]>([]);
  
  addressTypes = [
    { label: 'Facturación', value: 'FACTURACION' },
    { label: 'Entrega', value: 'ENTREGA' },
    { label: 'Trabajo', value: 'TRABAJO' },
    { label: 'Otro', value: 'OTRO' }
  ];

  validateForm = this.fb.group({
    name: ['', [Validators.required]],
    addressLine1: ['', [Validators.required]],
    addressLine2: [''],
    coreCountryId: [null as string | null, [Validators.required]],
    coreStateId: [null as string | null, [Validators.required]],
    coreCityId: [null as string | null, [Validators.required]],
    zipCode: [''],
    addressType: ['FACTURACION', [Validators.required]],
    isActive: [true]
  });

  ngOnInit(): void {
    this.loadCountries();
    if (this.modalData && this.modalData.addressData) {
      const data = this.modalData.addressData;
      this.isEditMode.set(true);
      
      // Load dependencies for edit mode
      if (data.coreCountryId) this.onCountryChange(data.coreCountryId, false);
      if (data.coreStateId) this.onStateChange(data.coreStateId, false);
      
      this.validateForm.patchValue(data);
    }
  }

  async loadCountries() {
    try {
      const data = await this.countryService.getAll();
      this.countries.set(data);
    } catch (error) {
      console.error('Error loading countries', error);
    }
  }

  async onCountryChange(countryId: string, resetLower: boolean = true) {
    if (resetLower) {
      this.validateForm.patchValue({ coreStateId: null, coreCityId: null });
      this.states.set([]);
      this.cities.set([]);
    }
    
    if (!countryId) return;
    
    try {
      const data = await this.stateService.getByCountry(countryId);
      this.states.set(data);
    } catch (error) {
      console.error('Error loading states', error);
    }
  }

  async onStateChange(stateId: string, resetLower: boolean = true) {
    if (resetLower) {
      this.validateForm.patchValue({ coreCityId: null });
      this.cities.set([]);
    }
    
    if (!stateId) return;
    
    try {
      const data = await this.cityService.getByState(stateId);
      this.cities.set(data);
    } catch (error) {
      console.error('Error loading cities', error);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const body: any = {
          ...formValues,
          corePartnerId: this.modalData.partnerId,
          id: this.modalData.addressData?.id
        };

        let result;
        if (this.isEditMode()) {
          result = await this.partnerService.updateAddress(body.id!, body);
        } else {
          result = await this.partnerService.createAddress(body);
        }

        if (Array.isArray(result) || result.succeeded) {
          this.message.success('Dirección guardada');
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
