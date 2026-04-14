import { Routes } from '@angular/router';
import { CompanyComponent } from './pages/company/company.component';
import { BranchComponent } from './pages/branch/branch.component';
import { BusinessUnitComponent } from './pages/business-unit/business-unit.component';
import { UserComponent } from './pages/user/user.component';
import { RolesComponent } from './pages/roles/roles.component';
import { PartnerComponent } from './pages/partner/partner.component';
import { LocationComponent } from './pages/location/location.component';
import { TaxComponent } from './pages/tax/tax.component';
import { SequenceComponent } from './pages/sequence/sequence.component';
import { IdentificationTypeComponent } from './pages/identification-type/identification-type.component';
import { FiscalResponsibilityComponent } from './pages/fiscal-responsibility/fiscal-responsibility.component';
import { MenuStructureComponent } from './pages/menu-structure/menu-structure.component';
import { CurrencyComponent } from './pages/currency/currency.component';
import { TaxTypeComponent } from './pages/tax-type/tax-type.component';

export const CORE_ROUTES: Routes = [
  { path: 'core/companies', component: CompanyComponent },
  { path: 'core/branches', component: BranchComponent },
  { path: 'core/business-units', component: BusinessUnitComponent },
  { path: 'core/users', component: UserComponent },
  { path: 'core/roles', component: RolesComponent },
  { path: 'core/partners', component: PartnerComponent },
  { path: 'core/geography', component: LocationComponent },
  { path: 'core/taxes', component: TaxComponent },
  { path: 'core/sequences', component: SequenceComponent },
  { path: 'core/identification-types', component: IdentificationTypeComponent },
  { path: 'core/fiscal-resp', component: FiscalResponsibilityComponent },
  { path: 'core/menu-config', component: MenuStructureComponent },
  { path: 'core/currencies', component: CurrencyComponent },
  { path: 'core/tax-types', component: TaxTypeComponent },
];

