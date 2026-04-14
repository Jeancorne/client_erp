import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { MenuModule } from '../../models/core/menu/menu.model';

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/menu`;

  async getAll(): Promise<MenuModule[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getTree(): Promise<MenuModule[]> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/tree`));
    return response.succeeded ? response.data : [];
  }

  async create(data: Partial<MenuModule>): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, data));
  }

  async update(id: string, data: Partial<MenuModule>): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, data));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
