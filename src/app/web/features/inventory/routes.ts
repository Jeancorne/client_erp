import { Routes } from '@angular/router';
import { ProductListComponent } from './pages/product-list/product-list.component';

export const INVENTORY_ROUTES: Routes = [
  { path: 'inv/products', component: ProductListComponent }  
];
