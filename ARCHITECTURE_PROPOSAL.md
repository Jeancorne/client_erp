# Arquitectura ERP Standalone (Angular 21 - Modern Stack)

Esta arquitectura utiliza el patrón **Standalone** (sin `NgModule`), optimizada para **Signals**, **Zoneless** y **NG-ZORRO**. Es la forma más eficiente de construir aplicaciones de alto nivel en 2026.

## 1. Estructura de Directorios (Standalone Focus)

```text
src/
├── app/
│   ├── core/                  # LÓGICA GLOBAL (Singletons)
│   │   ├── services/          # Servicios de API y Negocio (Basados en Signals)
│   │   ├── models/            # Interfaces y Tipos de datos
│   │   ├── state/             # Estado global (Signal Stores)
│   │   ├── guards/            # Protectores de rutas
│   │   └── interceptors/      # Interceptores HTTP (Funcionales, no clases)
│   │
│   ├── web/                   # CAPA VISUAL (UI/UX)
│   │   ├── layouts/           # Componentes Standalone de estructura (Main, Auth)
│   │   ├── shared/            # UI Kit Standalone (Botones, Tablas, Inputs reusables)
│   │   ├── features/          # Módulos de negocio (Accounting, Inventory, etc.)
│   │   │   └── [feature-name]/
│   │   │       ├── pages/      # Smart Components (Puntos de entrada)
│   │   │       ├── components/ # Componentes exclusivos de la feature
│   │   │       └── routes.ts   # Rutas hijas de la feature (Lazy Loaded)
│   │   ├── directives/        # Directivas Standalone
│   │   └── pipes/             # Pipes Standalone
│   │
│   ├── app.config.ts          # Configuración Global (Providers de NG-ZORRO, Routing, HTTP)
│   ├── app.routes.ts          # Enrutamiento Raíz (Carga perezosa de features)
│   └── app.ts                 # Componente Raíz (Standalone)
│
├── assets/                    # Archivos estáticos
└── styles/                    # Diseño Visual (Vanilla CSS + NG-ZORRO variables)
```

## 2. ¿Cómo funciona Standalone en un ERP?

### A. Componentes Auto-Suficientes
Ya no existe `SharedModule`. Si un componente necesita una tabla de NG-ZORRO, la importa directamente:
```typescript
@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [NzTableModule, CommonModule, CustomButtonComponent], // Importa lo que usa
  template: `<nz-table ...></nz-table>`
})
export class UserListComponent {}
```

### B. Lazy Loading sin Módulos
En `app.routes.ts`, cargamos las funcionalidades del ERP de forma ultra-rápida:
```typescript
export const routes: Routes = [
  {
    path: 'accounting',
    loadChildren: () => import('./web/features/accounting/routes').then(r => r.ACCOUNTING_ROUTES)
  }
];
```

### C. Proveedores Globales (app.config.ts)
Toda la configuración que antes iba en `AppModule` ahora reside en `app.config.ts`. Aquí activamos NG-ZORRO, las animaciones y el cliente HTTP una sola vez para toda la app.

## 3. Ventajas para el ERP
1. **Tree Shaking Real:** Si un módulo no usa "Gráficos", el código de los gráficos ni siquiera se descarga.
2. **Navegación Instantánea:** El enrutamiento standalone es más ligero que el basado en módulos.
3. **Mantenimiento Localizado:** Si borras una carpeta de una feature, no dejas "basura" en archivos de módulos compartidos.

---
**Estado:** Propuesta Standalone | **Versión:** 1.1 | **Framework:** Angular 21.2.7
