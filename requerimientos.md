Crear la siguiente pantalla:

Pantalla "Tipos de Impuestos"

GET
{{baseUrl}}/api/v1/tax-type
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "f4300ac8-a951-434c-b7c4-c4a3badb9aad",
            "name": "IVA 19%",
            "code": "VAT_19",
            "isRetention": false,
            "isActive": true,
            "createdAt": "2026-04-13T09:23:08.356535"
        }
    ],
    "traceId": "fd6ca95cff1c32960d3082cf7b81583b"
}


POST
{{baseUrl}}/api/v1/tax-type
{
  "name": "string",
  "code": "string",
  "isRetention": false,
  "isActive": true
}

PUT
{{baseUrl}}/api/v1/tax-type/:id
{
  "id": "94631e33-2542-de03-8d3f-0a419720c805",
  "name": "string",
  "code": "string",
  "isRetention": true,
  "isActive": true
}

DELETE
{{baseUrl}}/api/v1/tax-type/:id

NOTA: el modulo: "NzToolTipModule" no existe, es "NzTooltipModule".