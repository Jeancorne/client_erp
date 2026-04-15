# 📦 GUÍA MAESTRA: MÓDULO DE INVENTARIOS (INV)

Este documento detalla el funcionamiento interno, la lógica de negocio y el comportamiento de los datos del módulo de Inventarios. Está diseñado para entender cómo interactúan los procesos físicos con la valoración financiera.

---

## 1. ARQUITECTURA DEL MOVIMIENTO (KÁRDEX Y CAPAS)

El sistema opera bajo un modelo de **Trazabilidad 360°**, donde cada cambio físico tiene un impacto financiero inmediato.

### A. Kárdex Físico (`INV_MOVEMENT`)
Es el registro inmutable de "qué pasó, dónde y cuándo".
- **Tipo de Registro:** 100% Automático.
- **Disparadores:** Validación de Recepciones de Compra, Despachos de Venta, Ajustes, Traslados o Consumos de Manufactura.
- **Lógica:** No se puede borrar ni editar un movimiento una vez validado. Para corregir, se debe realizar un movimiento inverso (Contrapartida).

### B. Capas de Valoración (`INV_VALUATION_LAYER`)
Es el corazón del costeo (FIFO/Promedio).
- **Tipo de Registro:** 100% Automático (con excepción de Landed Costs).
- **Lógica de Entrada:** Cada vez que entra mercancía (`IN`), se crea una "Capa" con su costo específico.
- **Lógica de Salida:** Al salir mercancía (`OUT`), el sistema busca la capa más antigua con `remaining_qty > 0` y descuenta de allí. Si la salida supera la cantidad de una capa, salta a la siguiente (Consumo en Cascada).

---

## 2. ANÁLISIS DETALLADO POR TABLA

### 2.1 Maestros y Configuración (Registro Manual)

| Tabla | Origen | Propósito de Negocio | Lógica Crítica |
| :--- | :--- | :--- | :--- |
| **INV_PRODUCT** | Manual | Catálogo maestro de productos y servicios. | Define el `cost_method` (FIFO, AVG, STD) que regirá las capas. |
| **INV_CATEGORY** | Manual | Jerarquía de productos y mapeo contable. | Define a qué cuentas de la Contabilidad (`ACC`) se irán los asientos de inventario. |
| **INV_WAREHOUSE** | Manual | Edificios físicos (Bodega Principal, Norte, etc.). | Punto de control para el reporte de inventario por sede. |
| **INV_LOCATION** | Manual | Pasillos, estantes o celdas dentro de una bodega. | Permite definir si una ubicación es de "Desecho" o si permite "Stock Negativo". |
| **INV_UOM** | Manual | Unidades de medida (Kg, Und, Caja). | Incluye ratios de conversión (Ej: 1 Caja = 12 Unds). |

### 2.2 Control de Existencias y Trazabilidad (Registro Mixto)

| Tabla | Registro | Lógica de Negocio |
| :--- | :--- | :--- |
| **INV_QUANT** | **AUTOMÁTICO** | Representa el "Saldo Actual". Se suma en entradas y se resta en salidas. Nunca tiene historial, es una foto del presente. |
| **INV_LOT** | Mixto | Rastreo de lotes de producción y fechas de vencimiento. Se puede crear manual o durante la recepción de compra. |
| **INV_SERIAL_NUMBER**| Mixto | Identificación única por unidad (1 Serial = 1 Cantidad). Obligatorio para productos de alta tecnología o activos. |

### 2.3 Procesos Transaccionales (Flujo de Documentos)

| Tabla | Acción Manual (Usuario) | Acción Automática (Sistema) |
| :--- | :--- | :--- |
| **INV_TRANSFER** | Crea el documento, elige origen/destino y agrega productos. | Al validar: Genera 2 `INV_MOVEMENT` (Salida Origen / Entrada Destino) y actualiza `INV_QUANT`. |
| **INV_ADJUSTMENT** | Crea la "Auditoría", cuenta físicamente y registra el `real_qty`. | Al validar: Calcula `difference_qty`. Si es (+), crea capa. Si es (-), consume capa. |
| **INV_SCRAP** | Registra el daño/pérdida de un producto y el motivo. | Mueve el stock de una ubicación interna a una ubicación tipo `SCRAP`. Genera salida del Kárdex. |
| **INV_REORDER_RULE**| Define el Stock Mínimo y Máximo deseado por ubicación. | El motor de abastecimiento lee esta tabla para sugerir Órdenes de Compra automáticamente. |

---

## 3. LÓGICAS DE NEGOCIO AVANZADAS

### 3.1 El Proceso de "Landed Cost" (Costo en Tierra)
Es una de las funciones más potentes del módulo.
1. Se recibe mercancía a un costo base (Ej: $100). Se crea la capa en `INV_VALUATION_LAYER`.
2. Días después, llega la factura del flete internacional ($20).
3. El usuario registra un `PURCH_LANDED_COST` y lo vincula a la recepción original.
4. **Sistema:** Localiza la capa original, le suma los $20 al `unit_cost` y actualiza el `remaining_value`. 
5. **Resultado:** El inventario ahora vale $120 sin haber alterado las unidades físicas.

### 3.2 Gestión de Stock Negativo
- Si `INV_LOCATION.allow_negative_stock` es **FALSE**: El sistema bloqueará cualquier `SALE_DELIVERY` si el `INV_QUANT` llega a cero.
- Si es **TRUE**: El sistema permite la salida. La capa de valoración se crea con "Costo Estimado" y se ajusta automáticamente cuando entre la compra real (Reconciliación de Costo).

### 3.3 Variantes y SKU Matrix
- `INV_PRODUCT` actúa como el "Padre" (Ej: Camiseta Polo).
- `INV_PRODUCT_VARIANT` es el SKU real (Ej: Camiseta Polo - Roja - Talla L).
- El stock (`INV_QUANT`) y los movimientos (`INV_MOVEMENT`) siempre ocurren a nivel de **Variante**, nunca a nivel de Padre.

---

## 4. INTEGRIDAD Y SEGURIDAD

1. **Relación Inter-Módulo:** Las cuentas contables en `INV_CATEGORY` son **FK Lógicas**. Si el módulo de Contabilidad (`ACC`) no está instalado, el inventario funciona pero no genera asientos.
2. **Multi-Empresa:** Cada registro en `INV_PRODUCT`, `INV_WAREHOUSE` y `INV_MOVEMENT` lleva obligatoriamente el `core_company_id`. No se pueden trasladar productos entre empresas sin un proceso de Venta/Compra Intercompany.
3. **Auditoría:** Cada inserción en `INV_MOVEMENT` dispara un log en el sistema de auditoría con el usuario y la IP que validó la transacción.

---
**FIN DEL DOCUMENTO**
