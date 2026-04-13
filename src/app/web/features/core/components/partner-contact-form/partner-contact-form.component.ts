import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzModalRef, NZ_MODAL_DATA } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { PartnerService } from '../../../../../core/services/core/partner.service';
import { PartnerContact } from '../../../../../core/models/core/partner/partner-contact.model';

@Component({
  selector: 'app-partner-contact-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule
  ],
  templateUrl: './partner-contact-form.component.html'
})
export class PartnerContactFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalData = inject(NZ_MODAL_DATA);
  private partnerService = inject(PartnerService);
  private message = inject(NzMessageService);

  isEditMode = signal(false);
  isSubmitting = signal(false);

  validateForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    jobTitle: [''],
    isBillingContact: [false],
    isActive: [true]
  });

  ngOnInit(): void {
    if (this.modalData && this.modalData.contactData) {
      const data = this.modalData.contactData as PartnerContact;
      this.isEditMode.set(true);
      this.validateForm.patchValue(data);
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        const body: PartnerContact = {
          ...formValues,
          corePartnerId: this.modalData.partnerId,
          id: this.modalData.contactData?.id
        };

        let result;
        if (this.isEditMode()) {
          result = await this.partnerService.updateContact(body.id!, body);
        } else {
          result = await this.partnerService.createContact(body);
        }

        if (result.succeeded) {
          this.message.success('Contacto guardado');
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
