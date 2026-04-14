import { Component, signal, OnInit, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPageHeaderModule } from 'ng-zorro-antd/page-header';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { TableFilterComponent } from '../../../../shared/table-filter/table-filter.component';
import { UserFormComponent } from '../../components/user-form/user-form.component';
import { UserService } from '../../../../../core/services/core/user.service';
import { User } from '../../../../../core/models/core/user/user.model';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzPageHeaderModule,
    NzTagModule,
    NzBadgeModule,
    NzDividerModule,
    BreadcrumbComponent,
    NzSpinModule,
    TableFilterComponent,
    NzModalModule
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit {
  private modal = inject(NzModalService);
  private userService = inject(UserService);
  private message = inject(NzMessageService);

  breadcrumbItems = [{ name: 'Seguridad y Maestros' }, { name: 'Usuarios y Acceso' }];

  users = signal<User[]>([]);
  isLoading = signal<boolean>(false);
  searchValue = signal<string>('');

  filteredUsers = computed(() => {
    const term = this.searchValue().toLowerCase();
    const list = this.users();
    if (!term) return list;
    return list.filter(item => 
      item.username.toLowerCase().includes(term) || 
      item.firstName.toLowerCase().includes(term) ||
      item.lastName.toLowerCase().includes(term) ||
      item.email.toLowerCase().includes(term)
    );
  });

  sortUsername = (a: User, b: User) => a.username.localeCompare(b.username);
  sortName = (a: User, b: User) => a.firstName.localeCompare(b.firstName);
  sortLastName = (a: User, b: User) => a.lastName.localeCompare(b.lastName);
  sortEmail = (a: User, b: User) => a.email.localeCompare(b.email);
  sortStatus = (a: User, b: User) => (a.isActive === b.isActive ? 0 : a.isActive ? -1 : 1);

  ngOnInit() {
    this.loadUsers();
  }

  async loadUsers() {
    this.isLoading.set(true);
    try {
      const data = await this.userService.getAll();
      this.users.set(data);
    } catch (error) {
      this.message.error('Error al cargar la lista de usuarios');
      console.error(error);
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(data?: User) {
    const title = data ? 'Editar Usuario' : 'Registrar Nuevo Usuario';
    
    const modalRef = this.modal.create({
      nzTitle: title,
      nzContent: UserFormComponent,
      nzWidth: 900,
      nzMaskClosable: false,
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzData: {
        userData: data
      }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        this.loadUsers();
      }
    });
  }

  addUser() { this.openModal(); }
  editUser(data: User) { this.openModal(data); }

  deleteUser(data: User) {
    this.modal.confirm({
      nzTitle: '¿Estás seguro de eliminar este usuario?',
      nzContent: `<b style="color: red;">${data.username}</b> (${data.firstName} ${data.lastName}) será eliminado.`,
      nzOkText: 'Eliminar',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          const response = await this.userService.delete(data.id!);
          if (response.succeeded) {
            this.message.success('Usuario eliminado correctamente');
            this.loadUsers();
          } else {
            this.message.error(response.message || 'Error al eliminar el usuario');
          }
        } catch (error) {
          this.message.error('Ocurrió un error inesperado al eliminar');
          console.error(error);
        }
      },
      nzCancelText: 'Cancelar'
    });
  }
}
