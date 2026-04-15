Pantalla "Maestro de Productos"
Ruta: F:\ERPNew\client_erp\src\app\web\features\inventory, aquí crear components/page y las routes.ts para administrar todo el modulo INV
DTO: F:\ERPNew\client_erp\src\app\core\models\inventory
Servicios: F:\ERPNew\client_erp\src\app\core\services\inventory


================================================================================
ESPECIFICACIÓN DE INTERFAZ DE USUARIO (MÓDULO 08: INVENTARIO)
================================================================================

Pantalla: 8.1 Maestro de Productos (INV_PRODUCT)

Tipo UI: TIPO 1 (LISTADO)

Botones principales:
    - Registrar Producto (Abre Subpantalla: Formulario Producto)

Tabla:

Columnas:
- Referencia SKU (INV_PRODUCT.default_code)
- Nombre (INV_PRODUCT.name)
- Categoría (INV_PRODUCT.inv_category_id)
- Tipo (INV_PRODUCT.product_type)
- Costo Promedio (INV_PRODUCT.purchase_cost_avg)
- Activo (INV_PRODUCT.is_active)

Acciones:
- Ver (Abre Subpantalla: Formulario Producto)
- Eliminar

Subpantallas en modo popup dentro de "Maestro de Productos":
- Formulario Producto (INV_PRODUCT)
- Formulario Regla Reorden (INV_REORDER_RULE)
- Configuración de Variantes (INV_PRODUCT_VARIANT)


================================================================================

Subpantalla: Formulario Producto (INV_PRODUCT)

Tipo UI: TIPO 2 (FORMULARIO CON TABS)

Panel: Información Básica del Producto

Campos en cabecera:
- Imagen del Producto (INV_PRODUCT.image_url) - IMAGE_UPLOAD
- Nombre del Ítem (INV_PRODUCT.name) - UI
- Código SKU (INV_PRODUCT.default_code) - UI
- Código de Barras (INV_PRODUCT.barcode) - UI
- Empresa (INV_PRODUCT.core_company_id) - FK
- Categoría (INV_PRODUCT.inv_category_id) - FK
- Tipo de Producto (INV_PRODUCT.product_type) - SELECT
- Estado Activo (INV_PRODUCT.is_active) - BOOLEAN

Tabs:
    - Precios y Costos
    - Logística y Unidades
    - Variantes y Atributos
    - Reglas de Abastecimiento

Tab: Variantes y Atributos

Acciones:
- Generar Matriz de Variantes (Abre Popup: Configuración de Variantes)

Tabla:
- Variante SKU (INV_PRODUCT_VARIANT.sku_code)
- Nombre Atributos (INV_PRODUCT_VARIANT.name)
- Código de Barras (INV_PRODUCT_VARIANT.barcode)

Tab: Precios y Costos

Campos:
- Precio de Venta (INV_PRODUCT.sale_price) - DECIMAL
- Costo Estándar (INV_PRODUCT.standard_price) - DECIMAL
- Costo Promedio (INV_PRODUCT.purchase_cost_avg) - DECIMAL (READONLY)
- Método de Costeo (INV_PRODUCT.cost_method) - SELECT

Tab: Logística y Unidades

Campos:
- Unidad Base (INV_PRODUCT.inv_uom_id) - FK
- Unidad Compra (INV_PRODUCT.inv_uom_id_purchase) - FK
- Unidad Venta (INV_PRODUCT.inv_uom_id_sale) - FK
- Peso en Kg (INV_PRODUCT.weight) - DECIMAL
- Volumen m3 (INV_PRODUCT.volume) - DECIMAL

Tab: Reglas de Abastecimiento

Acciones:
- Nueva Regla (Abre Popup: Formulario Regla Reorden)

Tabla:

Columnas:
- Ubicación (INV_REORDER_RULE.inv_location_id)
- Stock Mínimo (INV_REORDER_RULE.min_quantity)
- Stock Máximo (INV_REORDER_RULE.max_quantity)
- Múltiplo (INV_REORDER_RULE.multiple_quantity)

Acciones:
- Ver (Abre Popup: Formulario Regla Reorden)
- Eliminar

================================================================================

ENDPOINTS REQUERIDOS
================================================================================

1. Maestro de Productos (Listado)
   - GET    /api/v1/product?companyId={guid}   (INV_PRODUCT_VIEW)
   - DELETE /api/v1/product/{id}               (INV_PRODUCT_DELETE)

2. Formulario Producto (CRUD)
   - GET    /api/v1/product/{id}               (INV_PRODUCT_VIEW)
   - POST   /api/v1/product                    (INV_PRODUCT_CREATE)
   - PUT    /api/v1/product/{id}               (INV_PRODUCT_EDIT)

3. Tab: Variantes y Atributos
   - GET    /api/v1/product/{id}/variants      (INV_PRODUCT_VIEW)
   - POST   /api/v1/product/variants           (INV_PRODUCT_EDIT)
   - GET    /api/v1/attributes/lookup          (INV_ATTRIBUTE_VIEW)
   - GET    /api/v1/attribute-values/attribute/{id} (INV_ATTRIBUTE_VIEW)

4. Tab: Reglas de Abastecimiento
   - GET    /api/v1/reorder-rules/product/{id} (INV_REORDER_VIEW)
   - POST   /api/v1/reorder-rules              (INV_REORDER_CREATE)
   - DELETE /api/v1/reorder-rules/{id}         (INV_REORDER_DELETE)
   - GET    /api/v1/locations/lookup           (INV_LOCATION_VIEW)

5. Selectores y Dropdowns (Lookups Optimizado)
   - GET    /api/v1/categories/lookup          (INV_CATEGORY_VIEW)
   - GET    /api/v1/uoms/lookup                (INV_UOM_VIEW)
   - GET    /api/v1/companies                  (INV_COMPANY_VIEW)

================================================================================

GET Productos
{{baseUrl}}/api/v1/product?companyId=40000000-0000-0000-0000-000000000001
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "a6000000-0000-0000-0000-000000000002",
            "coreCompanyId": "40000000-0000-0000-0000-000000000001",
            "name": "Escritorio Ergonómico",
            "defaultCode": "FUR-001",
            "barcode": "7709876543210",
            "productType": "PRODUCT",
            "invCategoryId": "a4000000-0000-0000-0000-000000000002",
            "invUomId": "a1000000-0000-0000-0000-000000000001",
            "invUomIdPurchase": null,
            "invUomIdSale": null,
            "salePrice": 850000.0000,
            "standardPrice": 420000.0000,
            "purchaseCostAvg": 0,
            "costMethod": "AVERAGE",
            "weight": 0,
            "volume": 0,
            "imageUrl": null,
            "isActive": true
        }
    ]
}
================================================================================

invCategoryId 
GET
{{baseUrl}}/api/v1/categories/lookup?companyId=40000000-0000-0000-0000-000000000001
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "38eee1b0-bde0-43ed-a6a0-55d0eee9fbb8",
            "name": "Categoria1"
        },
        {
            "id": "a4000000-0000-0000-0000-000000000001",
            "name": "Electrónica"
        },
        {
            "id": "a4000000-0000-0000-0000-000000000002",
            "name": "Oficina"
        }
    ],
    "traceId": "939dad089c5c0b46a69053f29af67e46"
}


================================================================================

invUomId
invUomIdPurchase
invUomIdSale

GET {{baseUrl}}/api/v1/uoms/lookup
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "a1000000-0000-0000-0000-000000000002",
            "name": "Docena"
        },
        {
            "id": "a1000000-0000-0000-0000-000000000004",
            "name": "Gramo"
        },
        {
            "id": "a1000000-0000-0000-0000-000000000003",
            "name": "Kilogramo"
        },
        {
            "id": "a1000000-0000-0000-0000-000000000001",
            "name": "Unidad(es)"
        }
    ],
    "traceId": "1f72664d45ccf8cf52dc43387ca5de4b"
}
================================================================================

GET
{{baseUrl}}/api/v1/product/:id/variants
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "a7000000-0000-0000-0000-000000000001",
            "invProductId": "a6000000-0000-0000-0000-000000000001",
            "name": "Laptop Pro 15 (Negro, 512GB)",
            "skuCode": "LAP-001-B512",
            "barcode": null
        }
    ],
    "traceId": "1df4ffb9e64856a87667bb7f2bc15a9d"
}


POST
{{baseUrl}}/api/v1/product/variants
{
    "invProductId": "a6000000-0000-0000-0000-000000000002", 
    "name": "Camiseta Básica Negra - Talla M",
    "skuCode": "CAM-NEG-M-001",
    "barcode": "7701234567890"
}

================================================================================

GET
{{baseUrl}}/api/v1/reorder-rules/product/:productId
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "aa000000-0000-0000-0000-000000000001",
            "coreCompanyId": "40000000-0000-0000-0000-000000000001",
            "invProductId": "a6000000-0000-0000-0000-000000000001",
            "invLocationId": "a3000000-0000-0000-0000-000000000001",
            "minQuantity": 5.0000,
            "maxQuantity": 20.0000,
            "multipleQuantity": 1.0000
        },
        {
            "id": "b8000000-0000-0000-0000-000000000001",
            "coreCompanyId": "40000000-0000-0000-0000-000000000001",
            "invProductId": "a6000000-0000-0000-0000-000000000001",
            "invLocationId": "a3000000-0000-0000-0000-000000000001",
            "minQuantity": 5.0000,
            "maxQuantity": 20.0000,
            "multipleQuantity": 1.0000
        }
    ],
    "traceId": "4e182f4bb20eaad49313c0da364cca3c"
}

POST
{{baseUrl}}/api/v1/reorder-rules
{
  "coreCompanyId": "1b205179-9bb1-48d7-c1e2-54b93bac7f41",
  "invProductId": "2f5d9f2c-f9d5-a828-ab55-a6c2ef4262a7",
  "invLocationId": "2a4d15f6-2b0a-49ec-d920-0c5c19082f4b",
  "minQuantity": "481565.3929",
  "maxQuantity": "-0",
  "multipleQuantity": "92654"
}

================================================================================



