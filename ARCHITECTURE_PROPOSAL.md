# 🏗️ Arquitectura ERP Standalone (Angular 21 - Especificación Maestra)

Esta arquitectura es el "Sistema Operativo" del frontend. Utiliza **Angular 21.2.7**, **Standalone Components**, **Signals**, **Zoneless** y **NG-ZORRO**. 

---

## 1. 📂 Estructura de Directorios por Dominios (Domain-Driven)

La organización sigue la lógica del negocio, no solo la del framework.

```text
src/app/
├── core/                       # LÓGICA GLOBAL (Single Source of Truth)
│   ├── services/               # Servicios transversales (Auth, Notification, Storage)
│   ├── models/                 # MODELOS POR DOMINIO (Importante para IA)
│   │   └── [modulo]/           # Ej: accounting, sales, core
│   │       ├── [tabla].model.ts # Interfaz TypeScript que espeja la DB
│   │       └── index.ts        # Barril de exportación por módulo
│   ├── state/                  # Estado global (SignalStores)
│   ├── guards/                 # Protectores de rutas (Funcionales)
│   └── interceptors/           # Interceptores HTTP (Funcionales)
│
├── web/                        # CAPA VISUAL (UI/UX)
│   ├── layouts/                # Estructuras maestras (Main, Auth, Print)
│   ├── shared/                 # UI KIT (Componentes 100% reutilizables y puros)
│   │   ├── components/         # Botones, Tablas genéricas, Inputs dinámicos
│   │   ├── pipes/              # Formateadores (Currency, Date, ERP_Translate)
│   │   └── directives/         # Comportamientos (InputUpperCase, Permissions)
│   │
│   └── features/               # MÓDULOS DE NEGOCIO (Entidades ERP)
│       └── [modulo]/           # Ej: inventory, core, finance
│           ├── pages/          # SMART COMPONENTS (Contenedores de lógica y orquestación)
│           │   └── [feature]/  # Ej: location, user-list, sale-order-form
│           ├── components/     # DUMB COMPONENTS (UI específica del módulo)
│           ├── services/       # Servicios específicos del módulo (API calls)
│           └── routes.ts       # Enrutamiento del módulo (Lazy Loaded)
```

---

## 2. 🧩 Anatomía de Componentes (Smart vs Dumb)

### A. Pages (Smart Components) - `features/[modulo]/pages/`
- **Responsabilidad:** Gestionar el estado, llamar a servicios, orquestar datos y manejar navegación.
- **Regla:** No contienen CSS complejo, solo estructura.
- **Interacción:** Usan `Signals` para reaccionar a cambios de datos. Consumen servicios del módulo.

### B. Components (Dumb Components) - `features/[modulo]/components/` o `shared/`
- **Responsabilidad:** Presentar datos y emitir eventos.
- **Regla:** Reciben datos vía `@Input` (Signals preferred) y notifican vía `Output`.

---

## 3. 🚦 Gestión de Estado y Datos (Signals First)

1.  **Servicios de API:** Deben retornar `Observable` pero el componente debe transformarlos en `Signal` usando `toSignal()` o manejarlos mediante `signal()` para estados mutables.
2.  **Estado Local:** Usar `signal()`, `computed()` y `effect()` para lógica reactiva sin Zone.js.

```typescript
// Ejemplo de Smart Component (Page)
export class UserListPage {
  private userService = inject(UserService);
  
  // Signal de estado obtenido de API
  users = toSignal(this.userService.getAll(), { initialValue: [] });
  
  // Computed para filtros reactivos
  activeUsers = computed(() => this.users().filter(u => u.is_active()));
}
```
---

## 5. 🛠️ Estándares de Codificación (Best Practices)

- **Naming:** 
  - Archivos: `kebab-case` (ej: `sale-order.model.ts`).
  - Clases: `PascalCase` (ej: `SaleOrderComponent`).
- **Standalone:** Prohibido usar `NgModule`. Cada componente importa exactamente lo que necesita.
- **Zoneless:** No usar `setTimeout` o `setInterval` de forma nativa para lógica de negocio; preferir `rxjs` o utilitarios de Angular. La detección de cambios es automática vía Signals.
- **Type Safety:** Prohibido el uso de `any`. Todo debe estar tipado en `core/models/[modulo]/`.

---
**Estado:** Especificación Activa | **Versión:** 2.0 | **Framework:** Angular 21 (Zoneless)
