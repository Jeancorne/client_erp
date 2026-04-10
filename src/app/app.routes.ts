import { Routes } from '@angular/router';
import { MainLayout } from './web/layouts/main/main.component';
import { NotFoundComponent } from './web/shared/notFound/notFound.component';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'welcome',
        loadChildren: () => import('./web/features/main/routes').then(m => m.MAIN_ROUTES)
      },
      {
        path: 'core',
        loadChildren: () => import('./web/features/core/routes').then(m => m.CORE_ROUTES)
      },
      { path: '', pathMatch: 'full', redirectTo: 'welcome' },
      {
        path: '**',
        component: NotFoundComponent
      }
    ]
  },
  // Aquí podrías añadir otras rutas fuera del layout (como el Login)
  // { path: 'login', loadComponent: () => import('./web/features/auth/login').then(c => c.LoginComponent) },
];
