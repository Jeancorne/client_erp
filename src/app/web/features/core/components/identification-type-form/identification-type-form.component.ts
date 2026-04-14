import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { IdentificationTypeService } from '../../../../../core/services/core/identification-type.service';
import { CountryService } from '../../../../../core/services/core/country.service';
import { Country } from '../../../../../core/models/core/country/country.model';
import { IdentificationType } from '../../../../../core/models/core/identification-type/identification-type.model';

@Component({
  selector: 'app-identification-type-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzButtonModule,
    NzIconModule
  ],
  templateUrl: './identification-type-form.component.html',
  styleUrl: './identification-type-form.component.css'
})
export class IdentificationTypeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private identificationTypeService = inject(IdentificationTypeService);
  private countryService = inject(CountryService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);
  countries = signal<Country[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    if (this.nzModalData?.typeData) {
      this.isEdit = true;
      this.validateForm.patchValue(this.nzModalData.typeData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      coreCountryId: [null, [Validators.required]],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]]
    });
  }

  async loadLookups() {
    try {
      const data = await this.countryService.getAll();
      this.countries.set(data);
    } catch (error) {
      this.message.error('Error al cargar países');
    }
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.typeData.id;
          await this.identificationTypeService.update(data.id, data);
          this.message.success('Tipo de identificación actualizado');
        } else {
          await this.identificationTypeService.create(data);
          this.message.success('Tipo de identificación creado');
        }
        this.modalRef.close({ success: true });
      } catch (error) {
        this.message.error('Error al guardar');
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
