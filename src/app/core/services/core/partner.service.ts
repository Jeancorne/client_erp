import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Partner } from '../../models/core/partner/partner.model';
import { PartnerAddress } from '../../models/core/partner/partner-address.model';
import { PartnerContact } from '../../models/core/partner/partner-contact.model';
import { PartnerFiscalResponsibility } from '../../models/core/partner/partner-fiscal-responsibility.model';

@Injectable({
  providedIn: 'root'
})
export class PartnerService {
  private http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/partner`;

  async getAll(): Promise<Partner[]> {
    const response = await firstValueFrom(this.http.get<any>(this.apiUrl));
    return response.succeeded ? response.data : [];
  }

  async getById(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.get<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  async create(partner: Partner): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(this.apiUrl, partner));
    return response;
  }

  async update(id: string, partner: Partner): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${this.apiUrl}/${id}`, partner));
    return response;
  }

  async delete(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${this.apiUrl}/${id}`));
    return response;
  }

  // --- Partner Address ---
  async getAddressesByPartner(partnerId: string): Promise<PartnerAddress[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/partner-address/partner/${partnerId}`));
    return response.succeeded ? response.data : [];
  }

  async createAddress(address: PartnerAddress): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/partner-address`, address));
    if (response.succeeded) {
      return await this.getAddressesByPartner(address.corePartnerId);
    }
    return response;
  }

  async updateAddress(id: string, address: PartnerAddress): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${environment.apiUrl}/partner-address/${id}`, address));
    if (response.succeeded) {
      return await this.getAddressesByPartner(address.corePartnerId);
    }
    return response;
  }

  async deleteAddress(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/partner-address/${id}`));
    return response;
  }

  // --- Partner Contact ---
  async getContactsByPartner(partnerId: string): Promise<PartnerContact[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/partner-contact/partner/${partnerId}`));
    return response.succeeded ? response.data : [];
  }

  async createContact(contact: PartnerContact): Promise<any> {
    const response = await firstValueFrom(this.http.post<any>(`${environment.apiUrl}/partner-contact`, contact));
    return response;
  }

  async updateContact(id: string, contact: PartnerContact): Promise<any> {
    const response = await firstValueFrom(this.http.put<any>(`${environment.apiUrl}/partner-contact/${id}`, contact));
    return response;
  }

  async deleteContact(id: string): Promise<any> {
    const response = await firstValueFrom(this.http.delete<any>(`${environment.apiUrl}/partner-contact/${id}`));
    return response;
  }

  // --- Fiscal Responsibilities ---
  async getFiscalResponsibilitiesByPartner(partnerId: string): Promise<PartnerFiscalResponsibility[]> {
    const response = await firstValueFrom(this.http.get<any>(`${environment.apiUrl}/partner-fiscal-responsibility/partner/${partnerId}`));
    return response.succeeded ? response.data : [];
  }
}
