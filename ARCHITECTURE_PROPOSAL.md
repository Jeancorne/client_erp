# 🏗️ Arquitectura ERP Standalone (Angular 21 - Especificación Maestra)

Esta arquitectura es el "Sistema Operativo" del frontend. Utiliza **Angular 21.2.7**, **Standalone Components**, **Signals**, **Zoneless** y **NG-ZORRO**. 

---

## 1. 📂 Estructura de Directorios y Organización de Código

### 1.1 Modelos (DTOs) por Tabla
Los modelos no deben agruparse en un solo archivo. Cada tabla/entidad debe tener su propia carpeta para permitir múltiples DTOs (Create, Update, List).
- **Ruta:** `src/app/core/models/[modulo]/[entidad]/`
- **Archivos:** `[entidad].model.ts`, `index.ts` (Barrel pattern).
- **Regla:** Reutilizar modelos del modulo `core` (ej: `CompanyLookup`) en lugar de duplicarlos.

### 1.2 Servicios Granulares
Siguiendo el principio de responsabilidad única, cada entidad debe tener su propio servicio.
- **Ruta:** `src/app/core/services/[modulo]/[entidad].service.ts`
- **Regla:** Usar `environment.apiInventory` o `environment.apiUrl` según el dominio.

---

## 2. 🧩 Estándares de UI/UX (Layouts Maestros)

### 2.1 Estructura de Páginas (Pages)
Todas las páginas de listado deben seguir la estructura de `core/pages/partner` o `core/pages/branch`.
```html
<div>
  <app-breadcrumb [items]="breadcrumbItems"></app-breadcrumb>
  <div class="body-content mt-3">
    <nz-spin [nzSpinning]="isLoading()">
      <!-- Header con acciones (Select empresa, Registrar) -->
      <!-- Tabla con filtros en cabecera -->
    </nz-spin>
  </div>
</div>
```

### 2.2 Tablas con Filtros Integrados
No usar barras de búsqueda externas arriba de la tabla si se puede integrar en la cabecera.
- **Búsqueda:** Usar `nzCustomFilter` con `app-table-filter` dentro del `<th>`.
- **Filtros:** Usar `[nzFilters]` para estados o tipos.
- **Orden:** Usar `[nzSortFn]` para columnas críticas (SKU, Nombre, Fecha).

### 2.3 Estándar de Formulario (Modales y Drawers)
Para garantizar que los botones de acción nunca se pierdan y el modal mantenga un tamaño profesional constante, usar las clases:
- `erp-form-container`: Contenedor raíz del formulario (Flex column).
- `erp-form-body`: Cuerpo del formulario con `flex: 1` y `overflow-y: auto`.
- `erp-form-footer`: Pie de página fijo con botones de acción.

---

## 3. 🚦 Gestión de Estado y Datos (Signals First)

1.  **Reactividad:** Usar `computed()` para filtros combinados (Texto + Columna + Empresa).
2.  **Zoneless:** No usar `setTimeout` nativo; la detección de cambios es automática vía Signals.
3.  **Type Safety:** Prohibido el uso de `any`. Las respuestas de API deben tiparse con `ApiResponse<T>`.

---

## 4. 📚 Referencias de Implementación (Ejemplos Reales)

Para nuevas funcionalidades, la IA debe basarse en estos archivos:
- **Listado Estándar:** `src/app/web/features/inventory/pages/product-list/`
- **Formulario Complejo (Tabs):** `src/app/web/features/inventory/components/product-form/`
- **Configurador Pro (Split View):** `src/app/web/features/inventory/components/product-form/variant-config/`
- **Servicio Granular:** `src/app/core/services/inventory/product.service.ts`

---
**Estado:** Especificación Activa | **Versión:** 3.0 | **Framework:** Angular 21 (Zoneless)
