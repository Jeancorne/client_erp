import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { User } from '../../models/core/user/user.model';
import { UserRoleMatrix } from '../../models/core/user/user-role-matrix.model';
import { UserCompany } from '../../models/core/user/user-company.model';
import { UserBranch } from '../../models/core/user/user-branch.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/user`;

  async getAll(): Promise<User[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  async create(user: User): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.apiUrl, user));
    return response;
  }

  async update(id: string, user: User): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, user));
    return response;
  }

  async delete(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  // --- User Company ---
  async getCompaniesByUser(userId: string): Promise<UserCompany[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/user-company/user/${userId}`));
    return response.succeeded ? response.data : [];
  }

  async addCompanyToUser(data: { coreUserId: string, coreCompanyId: string, isDefault: boolean }): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/user-company`, data));
  }

  async removeCompanyFromUser(userCompanyId: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/user-company/${userCompanyId}`));
  }

  // --- User Role ---
  async getRoleMatrix(userId: string): Promise<UserRoleMatrix[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/user-role/global-matrix/user/${userId}`));
    return response.succeeded ? response.data : [];
  }

  async assignRole(data: { coreUserId: string, coreRoleId: string }): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/user-role`, data));
  }

  async removeRole(userRoleId: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/user-role/${userRoleId}`));
  }

  // --- User Branch ---
  async getBranchesByUser(userId: string): Promise<UserBranch[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/user-branch/user/${userId}`));
    return response.succeeded ? response.data : [];
  }

  async addBranchToUser(data: { coreUserId: string, coreBranchId: string }): Promise<any> {
    return await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/user-branch`, data));
  }

  async removeBranchFromUser(userBranchId: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/user-branch/${userBranchId}`));
  }
}
