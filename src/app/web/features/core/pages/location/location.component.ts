import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService, NzModalModule } from 'ng-zorro-antd/modal';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { BreadcrumbComponent } from '../../../../shared/breadcrumb/breadcrumb.component';
import { CountryService } from '../../../../../core/services/core/country.service';
import { StateService } from '../../../../../core/services/core/state.service';
import { CityService } from '../../../../../core/services/core/city.service';
import { Country } from '../../../../../core/models/core/country/country.model';
import { State } from '../../../../../core/models/core/state/state.model';
import { City } from '../../../../../core/models/core/city/city.model';
import { CountryFormComponent } from '../../components/country-form/country-form.component';
import { StateFormComponent } from '../../components/state-form/state-form.component';
import { CityFormComponent } from '../../components/city-form/city-form.component';

interface StateWithCities extends State {
  cities?: City[];
  isExpanded?: boolean;
}

@Component({
  selector: 'app-location',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzTableModule,
    NzButtonModule,    
    NzSelectModule,
    NzIconModule,
    NzModalModule,
    NzSpinModule,
    NzDividerModule,
    NzTooltipModule,
    BreadcrumbComponent
  ],
  templateUrl: './location.component.html',
  styleUrl: './location.component.css'
})
export class LocationComponent implements OnInit {
  private countryService = inject(CountryService);
  private stateService = inject(StateService);
  private cityService = inject(CityService);
  private message = inject(NzMessageService);
  private modal = inject(NzModalService);

  breadcrumbItems = [{ name: 'Seguridad y Maestros' }, { name: 'Geografía Global' }];

  countries = signal<Country[]>([]);
  selectedCountryId = signal<string | null>(null);
  states = signal<StateWithCities[]>([]);
  isLoading = signal(false);

  ngOnInit(): void {
    this.loadCountries();
  }

  async loadCountries() {
    try {
      const data = await this.countryService.getAll();
      this.countries.set(data);
    } catch (error) {
      this.message.error('Error al cargar países');
    }
  }

  async filter() {
    const countryId = this.selectedCountryId();
    if (!countryId) {
      this.message.warning('Por favor seleccione un país');
      return;
    }

    this.isLoading.set(true);
    try {
      const data = await this.stateService.getByCountryWithCities(countryId);
      this.states.set(data.map(s => ({ ...s, isExpanded: false })));
    } catch (error) {
      this.message.error('Error al cargar departamentos');
    } finally {
      this.isLoading.set(false);
    }
  }

  toggleState(state: StateWithCities) {
    state.isExpanded = !state.isExpanded;
  }

  // --- CRUD Country ---
  openCountryModal(country?: Country) {
    const modalRef = this.modal.create({
      nzTitle: country ? 'Editar País' : 'Nuevo País',
      nzContent: CountryFormComponent,
      nzData: { countryData: country },
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '0' }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.loadCountries();
    });
  }

  deleteCountry() {
    const id = this.selectedCountryId();
    if (!id) return;
    const country = this.countries().find(c => c.id === id);

    this.modal.confirm({
      nzTitle: '¿Eliminar país?',
      nzContent: `Se eliminará <b>${country?.name}</b> y toda su jerarquía relacionada.`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.countryService.delete(id);
          this.message.success('País eliminado');
          this.selectedCountryId.set(null);
          this.states.set([]);
          this.loadCountries();
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }

  // --- CRUD State ---
  openStateModal(state?: State) {
    if (!this.selectedCountryId()) return;

    const modalRef = this.modal.create({
      nzTitle: state ? 'Editar Departamento' : 'Nuevo Departamento',
      nzContent: StateFormComponent,
      nzData: { 
        stateData: state,
        countryId: this.selectedCountryId()
      },
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '0' }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) this.filter();
    });
  }

  deleteState(state: State) {
    this.modal.confirm({
      nzTitle: '¿Eliminar departamento?',
      nzContent: `Se eliminará <b>${state.name}</b> y sus ciudades.`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.stateService.delete(state.id);
          this.message.success('Departamento eliminado');
          this.filter();
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }

  // --- CRUD City ---
  openCityModal(stateId: string, city?: City) {
    const modalRef = this.modal.create({
      nzTitle: city ? 'Editar Ciudad' : 'Nueva Ciudad',
      nzContent: CityFormComponent,
      nzData: { 
        cityData: city,
        stateId: stateId
      },
      nzFooter: null,
      nzCentered: true,
      nzBodyStyle: { padding: '0' }
    });

    modalRef.afterClose.subscribe(result => {
      if (result?.success) {
        const state = this.states().find(s => s.id === stateId);
        if (state) {
          state.cities = []; // Force reload
          this.toggleState(state);
          if (!state.isExpanded) state.isExpanded = true;
        }
      }
    });
  }

  deleteCity(stateId: string, city: City) {
    this.modal.confirm({
      nzTitle: '¿Eliminar ciudad?',
      nzContent: `Se eliminará <b>${city.name}</b>.`,
      nzOkDanger: true,
      nzOnOk: async () => {
        try {
          await this.cityService.delete(city.id);
          this.message.success('Ciudad eliminada');
          const state = this.states().find(s => s.id === stateId);
          if (state) {
            state.cities = state.cities?.filter(c => c.id !== city.id);
          }
        } catch (error) {
          this.message.error('Error al eliminar');
        }
      }
    });
  }
}
