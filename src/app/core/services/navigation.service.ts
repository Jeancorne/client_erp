import { Injectable, signal, computed } from '@angular/core';
import { MenuItem } from '../models/auth.models';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly STORAGE_KEY = 'erp_pinned_menus';

  // Signal para los favoritos persistidos
  private _pinnedItems = signal<MenuItem[]>(this.loadFromStorage());
  pinnedItems = computed(() => this._pinnedItems());

  constructor() {}

  togglePin(item: MenuItem) {
    const current = this._pinnedItems();
    const exists = current.find(p => p.id === item.id);
    
    let updated;
    if (exists) {
      updated = current.filter(p => p.id !== item.id);
    } else {
      updated = [...current, item];
    }
    
    this._pinnedItems.set(updated);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated));
  }

  isPinned(itemId: string): boolean {
    return this._pinnedItems().some(p => p.id === itemId);
  }

  private loadFromStorage(): MenuItem[] {
    const stored = localStorage.getItem(this.STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  }
}
