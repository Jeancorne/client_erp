import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Action } from '../../models/core/menu/menu.model';

@Injectable({
  providedIn: 'root'
})
export class ActionService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/action`;

  async getAll(): Promise<Action[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }
}
