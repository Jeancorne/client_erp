import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzModalRef, NZ_MODAL_DATA, NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzDividerModule } from 'ng-zorro-antd/divider';

import { PartnerService } from '../../../../../core/services/core/partner.service';
import { IdentificationTypeService } from '../../../../../core/services/core/identification-type.service';
import { CurrencyService } from '../../../../../core/services/core/currency.service';
import { FiscalResponsibilityService } from '../../../../../core/services/core/fiscal-responsibility.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { AuthService } from '../../../../../core/services/auth.service';

import { Partner } from '../../../../../core/models/core/partner/partner.model';
import { PartnerAddress } from '../../../../../core/models/core/partner/partner-address.model';
import { PartnerContact } from '../../../../../core/models/core/partner/partner-contact.model';
import { PartnerFiscalResponsibility } from '../../../../../core/models/core/partner/partner-fiscal-responsibility.model';
import { Currency } from '../../../../../core/models/core/currency/currency.model';
import { FiscalResponsibility } from '../../../../../core/models/core/fiscal-responsibility/fiscal-responsibility.model';

import { PartnerAddressFormComponent } from '../partner-address-form/partner-address-form.component';
import { PartnerContactFormComponent } from '../partner-contact-form/partner-contact-form.component';

@Component({
  selector: 'app-partner-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzTabsModule,
    NzTableModule,
    NzIconModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzModalModule,
    NzDividerModule
  ],
  templateUrl: './partner-form.component.html'
})
export class PartnerFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private partnerService = inject(PartnerService);
  private idTypeService = inject(IdentificationTypeService);
  private currencyService = inject(CurrencyService);
  private fiscalService = inject(FiscalResponsibilityService);
  private companyService = inject(CompanyService);
  private authService = inject(AuthService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  isEditMode = signal(false);
  isSubmitting = signal(false);
  partnerId = signal<string | null>(null);

  // Lookups
  identificationTypes = signal<any[]>([]);
  currencies = signal<Currency[]>([]);
  fiscalResponsibilities = signal<FiscalResponsibility[]>([]);
  parentPartners = signal<Partner[]>([]);
  companies = signal<any[]>([]);
  
  personTypes = [
    { label: 'Persona Natural', value: 'NATURAL' },
    { label: 'Persona Jurídica', value: 'JURIDICA' }
  ];

  partnerTypes = [
    { label: 'Cliente', value: 'CLIENTE' },
    { label: 'Proveedor', value: 'PROVEEDOR' },
    { label: 'Ambos', value: 'AMBOS' }
  ];

  // Tab Data
  addresses = signal<PartnerAddress[]>([]);
  contacts = signal<PartnerContact[]>([]);

  formatterDollar = (value: number): string => (value ? `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',') : '$ 0');
  parserDollar = (value: string): number => Number(value.replace(/\$\s?|(,*)/g, ''));

  validateForm = this.fb.group({
    coreCompanyId: [null as string | null, [Validators.required]],
    partnerFullName: ['', [Validators.required]],
    coreIdentificationTypeId: [null as string | null, [Validators.required]],
    nitTaxId: ['', [Validators.required]],
    parentPartnerId: [null as string | null],
    personType: ['NATURAL', [Validators.required]],
    dianCiiuCode: [''],
    partnerType: ['CLIENTE', [Validators.required]],
    creditLimit: [0],
    defaultCurrencyId: [null as string | null],
    isActive: [true],
    fiscalResponsibilities: [[] as string[]]
  });

  ngOnInit(): void {
    this.loadLookups();
    if (this.modalData && this.modalData.partnerData) {
      this.loadPartnerData(this.modalData.partnerData.id);
    } else {
      // Set current company as default for new partners
      const user = this.authService.currentUser();
      if (user?.defaultCompanyId) {
        this.validateForm.patchValue({ coreCompanyId: user.defaultCompanyId });
      }
    }
  }

  async loadPartnerData(id: string) {
    this.isSubmitting.set(true);
    try {
      const response = await this.partnerService.getById(id);
      if (response.succeeded && response.data) {
        const data = response.data as Partner;
        this.partnerId.set(data.id!);
        this.isEditMode.set(true);
        
        // Mapear IDs de responsabilidades fiscales si vienen como objetos
        let fiscalIds: string[] = [];
        
        // El backend puede enviar los datos en 'partnerFiscalResponsibilities' o 'fiscalResponsibilities'
        const rawFiscals = (data as any).partnerFiscalResponsibilities || data.fiscalResponsibilities;
        
        if (Array.isArray(rawFiscals)) {
          fiscalIds = rawFiscals.map((f: any) => f.coreFiscalResponsibilityId || f.id || f);
        }

        this.validateForm.patchValue({
          coreCompanyId: data.coreCompanyId,
          partnerFullName: data.partnerFullName,
          coreIdentificationTypeId: data.coreIdentificationTypeId,
          nitTaxId: data.nitTaxId ?? '',
          parentPartnerId: data.parentPartnerId,
          personType: data.personType || 'NATURAL',
          dianCiiuCode: data.dianCiiuCode || '',
          partnerType: data.partnerType,
          creditLimit: data.creditLimit,
          defaultCurrencyId: data.defaultCurrencyId,
          isActive: data.isActive,
          fiscalResponsibilities: fiscalIds
        });

        this.loadTabsData();
      }
    } catch (error) {
      this.message.error('Error al cargar datos del tercero');
    } finally {
      this.isSubmitting.set(false);
    }
  }

  async loadLookups() {
    try {
      const [idTypes, currs, fiscals, partners, comps] = await Promise.all([
        this.idTypeService.getAll(),
        this.currencyService.getAll(),
        this.fiscalService.getAll(),
        this.partnerService.getAll(),
        this.companyService.getLookup()
      ]);
      this.identificationTypes.set(idTypes);
      this.currencies.set(currs);
      this.fiscalResponsibilities.set(fiscals);
      this.parentPartners.set(partners.filter(p => p.id !== this.partnerId()));
      this.companies.set(comps);
    } catch (error) {
      console.error('Error loading lookups', error);
    }
  }

  async loadTabsData() {
    if (!this.partnerId()) return;
    
    try {
      const [addr, cont] = await Promise.all([
        this.partnerService.getAddressesByPartner(this.partnerId()!),
        this.partnerService.getContactsByPartner(this.partnerId()!)
      ]);
      this.addresses.set(addr);
      this.contacts.set(cont);
    } catch (error) {
      console.error('Error loading tabs data', error);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();

        const body: Partner = {
          ...formValues,
          coreCompanyId: formValues.coreCompanyId!,
          id: this.partnerId() || undefined
        };

        let result;
        if (this.isEditMode()) {
          result = await this.partnerService.update(this.partnerId()!, body);
        } else {
          result = await this.partnerService.create(body);
        }

        if (result.succeeded) {
          this.message.success(this.isEditMode() ? 'Tercero actualizado' : 'Tercero registrado');
          this.modalRef.destroy({ success: true });
        } else {
          this.message.error(result.message || 'Error al procesar');
        }
      } catch (error: any) {
        this.message.error(error.error?.message || 'Error de conexión');
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

  // --- Address Methods ---
  openAddressModal(address?: PartnerAddress) {
    if (!this.partnerId()) {
      this.message.warning('Primero debe guardar los datos básicos del tercero');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: address ? 'Editar Dirección' : 'Nueva Dirección',
      nzContent: PartnerAddressFormComponent,
      nzWidth: 850,
      nzData: {
        addressData: address,
        partnerId: this.partnerId()
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadTabsData();
    });
  }

  async deleteAddress(address: PartnerAddress) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar esta dirección?',
      nzContent: `La dirección <b style="color: red;">${address.name}</b> será eliminada.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.partnerService.deleteAddress(address.id!);
          if (result.succeeded) {
            this.message.success('Dirección eliminada');
            this.loadTabsData();
          }
        } catch (error) {
          this.message.error('Error al eliminar dirección');
        }
      }
    });
  }

  // --- Contact Methods ---
  openContactModal(contact?: PartnerContact) {
    if (!this.partnerId()) {
      this.message.warning('Primero debe guardar los datos básicos del tercero');
      return;
    }

    const modalRef = this.modal.create({
      nzTitle: contact ? 'Editar Contacto' : 'Nuevo Contacto',
      nzContent: PartnerContactFormComponent,
      nzData: {
        contactData: contact,
        partnerId: this.partnerId()
      },
      nzFooter: null
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadTabsData();
    });
  }

  async deleteContact(contact: PartnerContact) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar este contacto?',
      nzContent: `El contacto <b style="color: red;">${contact.firstName} ${contact.lastName}</b> será eliminado.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.partnerService.deleteContact(contact.id!);
          if (result.succeeded) {
            this.message.success('Contacto eliminado');
            this.loadTabsData();
          }
        } catch (error) {
          this.message.error('Error al eliminar contacto');
        }
      }
    });
  }

  handleCancel() {
    this.modalRef.destroy();
  }
}
