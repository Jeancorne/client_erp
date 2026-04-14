import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Sequence } from '../../models/core/sequence/sequence.model';

@Injectable({
  providedIn: 'root'
})
export class SequenceService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/sequence`;

  async getAll(): Promise<Sequence[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    return await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
  }

  async create(sequence: Partial<Sequence>): Promise<any> {
    return await firstValueFrom(this.http.post<any>(this.apiUrl, sequence));
  }

  async update(id: string, sequence: Partial<Sequence>): Promise<any> {
    return await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, sequence));
  }

  async delete(id: string): Promise<any> {
    return await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
  }
}
