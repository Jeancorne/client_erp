import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzTagModule } from 'ng-zorro-antd/tag';

import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { CurrencyService } from '../../../../../core/services/core/currency.service';
import { Currency } from '../../../../../core/models/core/currency/currency.model';
import { CurrencyFormComponent } from '../../components/currency-form/currency-form.component';

@Component({
  selector: 'app-currency',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzDividerModule,
    NzModalModule,
    NzTooltipModule,
    NzTagModule,
    BreadcrumbComponent
  ],
  providers: [NzModalService],
  templateUrl: './currency.component.html'
})
export class CurrencyComponent implements OnInit {
  private currencyService = inject(CurrencyService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Configuración' }, { name: 'Monedas' }];
  
  currencies = signal<Currency[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadCurrencies();
  }

  async loadCurrencies() {
    this.isLoading.set(true);
    try {
      const data = await this.currencyService.getAll();
      this.currencies.set(data);
    } catch (error) {
      this.message.error('Error al cargar monedas');
    } finally {
      this.isLoading.set(false);
    }
  }

  openModal(currency?: Currency) {
    const modalRef = this.modal.create({
      nzTitle: currency ? 'Editar Moneda' : 'Nueva Moneda',
      nzContent: CurrencyFormComponent,
      nzData: { currencyData: currency },
      nzFooter: null,
      nzWidth: 500,
      nzCentered: true,
      nzBodyStyle: { padding: '0' },
      nzMaskClosable: false
    });

    modalRef.afterClose.subscribe((result: any) => {
      if (result?.success) this.loadCurrencies();
    });
  }

  deleteCurrency(currency: Currency) {
    this.modal.confirm({
      nzTitle: '¿Eliminar moneda?',
      nzContent: `Se eliminará la moneda <b>${currency.name}</b> (${currency.code}).`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.currencyService.delete(currency.id);
          this.message.success('Moneda eliminada correctamente');
          this.loadCurrencies();
        } catch (error) {
          this.message.error('Error al eliminar la moneda');
        }
      }
    });
  }
}
