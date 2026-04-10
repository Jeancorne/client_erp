import { Routes } from '@angular/router';
import { MainLayout } from './web/layouts/main/main.component';
import { NotFoundComponent } from './web/shared/notFound/notFound.component';
import { authGuard, publicGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Ruta de Login (Protegida para que logueados no vuelvan)
  { 
    path: 'login', 
    loadComponent: () => import('./web/features/login/login.component').then(c => c.LoginComponent),
    canActivate: [publicGuard]
  },

  // Rutas de la App (Protegidas por authGuard)
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      // Podrías añadir un Dashboard aquí en el futuro
      // { path: 'dashboard', loadComponent: ... },
      {
        path: 'core',
        loadChildren: () => import('./web/features/core/routes').then(m => m.CORE_ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'core/companies' }, // Redirección inicial temporal
    ]
  },

  // 404
  {
    path: '**',
    component: NotFoundComponent
  }
];
