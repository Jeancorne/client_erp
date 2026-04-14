import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NZ_MODAL_DATA, NzModalRef } from 'ng-zorro-antd/modal';

import { MenuItemService } from '../../../../../core/services/core/menu-item.service';
import { MenuItem } from '../../../../../core/models/core/menu/menu.model';

@Component({
  selector: 'app-menu-item-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSwitchModule,
    NzInputNumberModule
  ],
  templateUrl: './menu-item-form.component.html',
  styleUrl: './menu-item-form.component.css'
})
export class MenuItemFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private menuItemService = inject(MenuItemService);
  private message = inject(NzMessageService);
  private modalRef = inject(NzModalRef);
  readonly nzModalData = inject(NZ_MODAL_DATA);

  validateForm!: FormGroup;
  isLoading = signal(false);
  
  // Datos del contexto
  coreMenuId!: string;
  parentId: string | null = null;
  moduleCode: string | null = null;

  ngOnInit(): void {
    this.coreMenuId = this.nzModalData.coreMenuId;
    this.parentId = this.nzModalData.parentId || null;
    this.moduleCode = this.nzModalData.moduleCode || null;
    
    this.initForm();
  }

  private initForm(): void {
    this.validateForm = this.fb.group({
      coreMenuId: [this.coreMenuId, [Validators.required]],
      coreMenuItemIdParent: [this.parentId],
      moduleCode: [this.moduleCode, [Validators.required]],
      name: [null, [Validators.required]],
      routePath: [null],
      sequence: [0, [Validators.required]],
      isActive: [true]
    });
  }

  async submitForm() {
    if (this.validateForm.valid) {
      this.isLoading.set(true);
      try {
        await this.menuItemService.create(this.validateForm.value);
        this.message.success('Ítem de menú creado correctamente');
        this.modalRef.close({ success: true });
      } catch (error) {
        this.message.error('Error al crear el ítem');
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
