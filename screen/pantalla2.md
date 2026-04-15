
================================================================================

Subpantalla: Configuración de Variantes (INV_PRODUCT_VARIANT)

Tipo UI: TIPO 2 (POPUP)

Panel: Definición de Atributos (Tallas / Colores)

Acciones:
- Añadir Atributo (Abre Popup: Selector Atributo)

Tabla de Configuración:
- Atributo (INV_PRODUCT_ATTRIBUTE.name)
- Valores Seleccionados (INV_PRODUCT_ATTRIBUTE_VALUE.name - TAGS)


================================================================================

ENDPOINTS REQUERIDOS
================================================================================

1. Gestión de Atributos (Definición)
   - GET    /api/v1/attributes/lookup          (INV_ATTRIBUTE_VIEW)
   - POST   /api/v1/attributes                 (INV_ATTRIBUTE_CREATE)

2. Gestión de Valores (Tags)
   - GET    /api/v1/attribute-values/attribute/{id} (INV_ATTRIBUTE_VIEW)
   - POST   /api/v1/attribute-values           (INV_ATTRIBUTE_CREATE)
   - PUT    /api/v1/attribute-values/{id}      (INV_ATTRIBUTE_EDIT)
   - DELETE /api/v1/attribute-values/{id}      (INV_ATTRIBUTE_DELETE)

================================================================================


GET
{{baseUrl}}/api/v1/attributes?companyId=40000000-0000-0000-0000-000000000001
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "a5000000-0000-0000-0000-000000000002",
            "coreCompanyId": "40000000-0000-0000-0000-000000000001",
            "name": "Capacidad"
        },
        {
            "id": "a5000000-0000-0000-0000-000000000001",
            "coreCompanyId": "40000000-0000-0000-0000-000000000001",
            "name": "Color"
        }
    ],
    "traceId": "7d32b0b786abc8f7863f19421535319b"
}

POST
{{baseUrl}}/api/v1/attributes
{
  "coreCompanyId": "98b87cab-5a9d-11a7-e6fa-1c8cf766fb88",
  "name": "string"
}


DropDown para company:
GET
{{baseUrl}}/api/v1/company/lookup
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [       
        {
            "id": "40000000-0000-0000-0000-000000000001",
            "name": "Acme Corporation S.A."
        }
    ],
    "traceId": "b98c6460615511f530ab3a5c84d3ba4a"
}



GET
{{baseUrl}}/api/v1/attribute-values/attribute/:attributeId
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "a5100000-0000-0000-0000-000000000002",
            "invProductAttributeId": "a5000000-0000-0000-0000-000000000001",
            "name": "Blanco"
        },
        {
            "id": "a5100000-0000-0000-0000-000000000001",
            "invProductAttributeId": "a5000000-0000-0000-0000-000000000001",
            "name": "Negro"
        }
    ],
    "traceId": "ed8535a9c0cdf559f727b70e712ef751"
}

================================================================================
