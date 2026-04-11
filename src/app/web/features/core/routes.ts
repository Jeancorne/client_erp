import { Routes } from '@angular/router';
import { CompanyComponent } from './pages/company/company.component';
import { BranchComponent } from './pages/branch/branch.component';
import { BusinessUnitComponent } from './pages/business-unit/business-unit.component';
import { UserComponent } from './pages/user/user.component';

export const CORE_ROUTES: Routes = [
  { path: 'core/companies', component: CompanyComponent },
  { path: 'core/branches', component: BranchComponent },
  { path: 'core/business-units', component: BusinessUnitComponent },
  { path: 'core/users', component: UserComponent },
];
