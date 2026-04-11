import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators, FormsModule } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzModalRef, NZ_MODAL_DATA, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { UserService } from '../../../../../core/services/core/user.service';
import { CompanyService } from '../../../../../core/services/core/company.service';
import { BranchService } from '../../../../../core/services/core/branch.service';
import { IdentificationTypeService } from '../../../../../core/services/core/identification-type.service';
import { User, UserCompany, UserRoleMatrix, UserBranch } from '../../../../../core/models/core/user.models';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzSelectModule,
    NzCheckboxModule,
    NzTabsModule,
    NzTableModule,
    NzIconModule,
    NzDividerModule,
    NzTagModule
  ],
  templateUrl: './user-form.component.html'
})
export class UserFormComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  private modalRef = inject(NzModalRef);
  private modalService = inject(NzModalService);
  private message = inject(NzMessageService);
  private modalData = inject(NZ_MODAL_DATA);
  
  private userService = inject(UserService);
  private companyService = inject(CompanyService);
  private branchService = inject(BranchService);
  private identificationTypeService = inject(IdentificationTypeService);

  isEditMode = signal<boolean>(false);
  isSubmitting = signal(false);
  userId = signal<string | null>(null);

  identificationTypes = signal<any[]>([]);
  allCompanies = signal<any[]>([]);
  
  // Tabs Data
  userCompanies = signal<UserCompany[]>([]);
  roleMatrix = signal<UserRoleMatrix[]>([]);
  userBranches = signal<UserBranch[]>([]);

  // Selection for adding
  selectedCompanyForBranch = signal<string | null>(null);
  selectedBranchToAdd = signal<string | null>(null);
  availableBranches = signal<any[]>([]);
  
  selectedCompanyForUser = signal<string | null>(null);
  isDefaultCompany = signal<boolean>(false);

  validateForm = this.fb.group({
    username: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    coreIdentificationTypeId: [null as string | null],
    identificationNumber: [null as string | null],
    phone: [null as string | null],
    isMainAdmin: [false],
    isActive: [true]
  });

  async ngOnInit() {
    await this.loadInitialData();
    
    if (this.modalData && this.modalData.userData) {
      this.isEditMode.set(true);
      this.userId.set(this.modalData.userData.id);
      
      this.validateForm.get('username')?.disable();
      this.validateForm.get('email')?.disable();

      await this.loadFullUserData();
    }
  }

  async loadInitialData() {
    try {
      const [idTypes, companies] = await Promise.all([
        this.identificationTypeService.getAll(),
        this.companyService.getAll()
      ]);
      this.identificationTypes.set(idTypes);
      this.allCompanies.set(companies);
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar datos iniciales');
    }
  }

  async loadFullUserData() {
    if (!this.userId()) return;
    try {
      const response = await this.userService.getById(this.userId()!);
      if (response.succeeded) {
        const data = response.data;
        this.validateForm.patchValue({
          username: data.username,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          coreIdentificationTypeId: data.coreIdentificationTypeId,
          identificationNumber: data.identificationNumber,
          phone: data.phone,
          isMainAdmin: data.isMainAdmin,
          isActive: data.isActive
        });
        
        await Promise.all([
          this.loadUserCompanies(),
          this.loadUserBranches(),
          this.loadRoleMatrix()
        ]);
      }
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar detalle del usuario');
    }
  }

  async loadRoleMatrix() {
    if (!this.userId()) return;
    try {
      const matrix = await this.userService.getRoleMatrix(this.userId()!);
      this.roleMatrix.set(matrix);
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar matriz de roles');
    }
  }

  async loadUserCompanies() {
    if (!this.userId()) return;
    try {
      const comps = await this.userService.getCompaniesByUser(this.userId()!);
      this.userCompanies.set(comps);
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar empresas del usuario');
    }
  }

  async loadUserBranches() {
    if (!this.userId()) return;
    try {
      const branches = await this.userService.getBranchesByUser(this.userId()!);
      this.userBranches.set(branches);
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al cargar sedes del usuario');
    }
  }

  async handleOk() {
    if (this.validateForm.valid) {
      this.isSubmitting.set(true);
      try {
        const formValues = this.validateForm.getRawValue();
        let result;

        if (this.isEditMode()) {
          const bodyToUpdate: User = {
            id: this.userId()!,
            ...formValues,
          };
          result = await this.userService.update(this.userId()!, bodyToUpdate);
        } else {
          const createData = {
            ...formValues,
            coreCompanyId: this.allCompanies().length > 0 ? this.allCompanies()[0].id : null
          };
          result = await this.userService.create(createData as any);
        }
        
        if (result && result.succeeded !== false) {
          this.message.success(this.isEditMode() ? 'Usuario actualizado' : 'Usuario registrado');
          this.modalRef.destroy({ success: true });
        } else {
          this.message.error(result?.message || 'Error al procesar');
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

  async addCompany() {
    if (!this.selectedCompanyForUser() || !this.userId()) return;
    try {
      const result = await this.userService.addCompanyToUser({
        coreUserId: this.userId()!,
        coreCompanyId: this.selectedCompanyForUser()!,
        isDefault: this.isDefaultCompany()
      });
      
      if (result.succeeded) {
        this.message.success('Empresa vinculada');
        this.selectedCompanyForUser.set(null);
        await this.loadUserCompanies();
      } else {
        this.message.error(result.message || 'Error al vincular empresa');
      }
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al vincular empresa');
    }
  }

  async removeCompany(data: UserCompany) {
    this.modalService.confirm({
      nzTitle: '¿Estás seguro de desvincular esta empresa?',
      nzContent: `Se eliminará el acceso del usuario a la empresa <b>${data.companyName}</b>.`,
      nzOkText: 'Desvincular',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.userService.removeCompanyFromUser(data.id);
          if (result.succeeded) {
            this.message.success('Vinculación eliminada');
            await this.loadUserCompanies();
          } else {
            this.message.error(result.message || 'Error al eliminar vinculación');
          }
        } catch (error: any) {
          this.message.error(error.error?.message || 'Error al eliminar vinculación');
        }
      }
    });
  }

  async toggleRole(assigned: boolean, role: any) {
    try {
      if (assigned) {
        const result = await this.userService.assignRole({
          coreUserId: this.userId()!,
          coreRoleId: role.roleId
        });
        if (result.succeeded) {
          this.message.success('Rol asignado');
        } else {
          this.message.error(result.message || 'Error al asignar rol');
        }
      } else {
        if (role.userRoleId) {
          const result = await this.userService.removeRole(role.userRoleId);
          if (result.succeeded) {
            this.message.success('Rol removido');
          } else {
            this.message.error(result.message || 'Error al remover rol');
          }
        }
      }
      await this.loadRoleMatrix();
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al actualizar rol');
      await this.loadRoleMatrix();
    }
  }

  async onCompanyBranchChange(companyId: string) {
    this.selectedBranchToAdd.set(null);
    this.availableBranches.set([]);
    if (companyId) {
      try {
        const data = await this.branchService.getLookupByCompany(companyId);
        this.availableBranches.set(data);
      } catch (error: any) {
        this.message.error(error.error?.message || 'Error al cargar sedes de la empresa');
      }
    }
  }

  async addBranch() {
    if (!this.selectedBranchToAdd() || !this.userId()) return;
    try {
      const result = await this.userService.addBranchToUser({
        coreUserId: this.userId()!,
        coreBranchId: this.selectedBranchToAdd()!
      });
      if (result.succeeded) {
        this.message.success('Sede autorizada');
        this.selectedBranchToAdd.set(null);
        await this.loadUserBranches();
      } else {
        this.message.error(result.message || 'Error al autorizar sede');
      }
    } catch (error: any) {
      this.message.error(error.error?.message || 'Error al autorizar sede');
    }
  }

  async removeBranch(data: UserBranch) {
    this.modalService.confirm({
      nzTitle: '¿Estás seguro de revocar el acceso a esta sede?',
      nzContent: `Se eliminará el acceso a <b>${data.branchName}</b> de la empresa <b>${data.companyName}</b>.`,
      nzOkText: 'Revocar',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const result = await this.userService.removeBranchFromUser(data.id);
          if (result.succeeded) {
            this.message.success('Sede removida');
            await this.loadUserBranches();
          } else {
            this.message.error(result.message || 'Error al remover sede');
          }
        } catch (error: any) {
          this.message.error(error.error?.message || 'Error al remover sede');
        }
      }
    });
  }

  handleCancel() {
    this.modalRef.destroy();
  }
}
