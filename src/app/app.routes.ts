import { Routes } from '@angular/router';
import { MainLayout } from './web/layouts/main/main.component';
import { NotFoundComponent } from './web/shared/notFound/notFound.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta de Login
  { 
    path: 'login', 
    loadComponent: () => import('./web/features/login/login.component').then(c => c.LoginComponent),
    canActivate: [publicGuard]
  },

  // Rutas de la App
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'main',
        loadChildren: () => import('./web/features/main/routes').then(m => m.MAIN_ROUTES)
      },
      {
        path: 'main',
        loadChildren: () => import('./web/features/core/routes').then(m => m.CORE_ROUTES)
      },
      {
        path: 'main',
        loadChildren: () => import('./web/features/inventory/routes').then(m => m.INVENTORY_ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'main' },
    ]
  },

  // 404
  {
    path: '**',
    component: NotFoundComponent
  }
];
