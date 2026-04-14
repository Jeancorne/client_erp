import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { SequenceService } from '../../../../../core/services/core/sequence.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { BranchService } from '../../../../../core/services/core/branch.service';
import { CompanyLookup } from '../../../../../core/models/core/company/company-lookup.model';
import { Sequence, ResetType, SequenceStatus } from '../../../../../core/models/core/sequence/sequence.model';

@Component({
  selector: 'app-sequence-form',
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
    NzTabsModule,
    NzDatePickerModule,
    NzIconModule
  ],
  templateUrl: './sequence-form.component.html',
  styleUrl: './sequence-form.component.css'
})
export class SequenceFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private sequenceService = inject(SequenceService);
  private companyService = inject(CompanyService);
  private branchService = inject(BranchService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isEdit = false;
  isLoading = signal(false);
  private isInitializing = false;

  companies = signal<CompanyLookup[]>([]);
  branches = signal<any[]>([]);

  resetTypes: { label: string, value: ResetType }[] = [
    { label: 'Ninguno', value: 'NONE' },
    { label: 'Diario', value: 'DAILY' },
    { label: 'Mensual', value: 'MONTHLY' },
    { label: 'Anual', value: 'YEARLY' }
  ];

  statuses: { label: string, value: SequenceStatus }[] = [
    { label: 'Borrador', value: 'DRAFT' },
    { label: 'Activo', value: 'ACTIVE' },
    { label: 'Agotado', value: 'DEPLETED' },
    { label: 'Expirado', value: 'EXPIRED' },
    { label: 'Cerrado', value: 'CLOSED' }
  ];

  ngOnInit(): void {
    this.initForm();
    this.loadLookups();
    if (this.nzModalData?.sequenceData) {
      this.isEdit = true;
      this.loadEditData(this.nzModalData.sequenceData);
    }
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      coreCompanyId: [null, [Validators.required]],
      coreBranchId: [null],
      name: [null, [Validators.required]],
      documentCode: [null, [Validators.required]],
      status: ['ACTIVE', [Validators.required]],
      isActive: [true],
      prefix: [''],
      suffix: [''],
      padding: [6, [Validators.required, Validators.min(0)]],
      nextNumber: [1, [Validators.required, Validators.min(1)]],
      rangeFrom: [1, [Validators.required]],
      rangeTo: [999999, [Validators.required]],
      validFrom: [null],
      validTo: [null],
      resetType: ['NONE', [Validators.required]],
      resetMonth: [null],
      resetDay: [null]
    });
  }

  async loadLookups() {
    try {
      this.companies.set(await this.companyService.getLookup());
    } catch (error) {
      this.message.error('Error al cargar empresas');
    }
  }

  async onCompanyChange(companyId: string) {
    if (this.isInitializing) return;
    this.validateForm.patchValue({ coreBranchId: null });
    if (companyId) {
      try {
        const data = await this.branchService.getLookupByCompany(companyId);
        this.branches.set(data.map(b => ({
          ...b,
          displayName: b.name || `Sede (${b.id.substring(0, 8)})`
        })));
      } catch (error) {
        this.message.error('Error al cargar sedes');
      }
    } else {
      this.branches.set([]);
    }
  }

  async loadEditData(sequence: Sequence) {
    this.isInitializing = true;
    if (sequence.coreCompanyId) {
      try {
        const data = await this.branchService.getLookupByCompany(sequence.coreCompanyId);
        this.branches.set(data.map(b => ({
          ...b,
          displayName: b.name || `Sede (${b.id.substring(0, 8)})`
        })));
      } catch (error) {
        console.error('Error loading branches for edit', error);
      }
    }
    this.validateForm.patchValue(sequence);
    setTimeout(() => {
      this.isInitializing = false;
    }, 200);
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        const data = { ...this.validateForm.value };
        if (this.isEdit) {
          data.id = this.nzModalData.sequenceData.id;
          data.rowVersion = this.nzModalData.sequenceData.rowVersion;
          await this.sequenceService.update(data.id, data);
          this.message.success('Secuencia actualizada correctamente');
        } else {
          await this.sequenceService.create(data);
          this.message.success('Secuencia creada correctamente');
        }
        this.modalRef.close({ success: true });
      } catch (error) {
        this.message.error('Error al guardar la secuencia');
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
