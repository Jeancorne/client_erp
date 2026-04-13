import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { RoleMatrixData } from '../../models/core/role/role-matrix.model';
import { CreateRoleRequest } from '../../models/core/role/create-role.request';
import { BatchPermissionRequest } from '../../models/core/role/batch-permission.request';
import { DuplicatePermissionRequest } from '../../models/core/role/duplicate-permission.request';

@Injectable({
  providedIn: 'root'
})
export class RolesService {
  private http = inject(HttpClient);
  private readonly roleApiUrl = `${environment.apiUrl}/role`;
  private readonly matrixApiUrl = `${environment.apiUrl}/role-permission`;

  async getMatrix(companyId: string): Promise<RoleMatrixData | null> {
    const response = await firstValueFrom(this.http.get<any>(`${this.matrixApiUrl}/matrix/${companyId}`));
    return response.succeeded ? response.data : null;
  }

  async createRole(role: CreateRoleRequest): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.roleApiUrl, role));
    return response;
  }

  async updateRole(id: string, role: any): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.roleApiUrl}/${id}`, role));
    return response;
  }

  async deleteRole(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.roleApiUrl}/${id}`));
    return response;
  }

  async batchUpdatePermissions(request: BatchPermissionRequest): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(`${this.matrixApiUrl}/batch`, request));
    return response;
  }

  async duplicateConfiguration(request: DuplicatePermissionRequest): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(`${this.matrixApiUrl}/duplicate`, request));
    return response;
  }
}
