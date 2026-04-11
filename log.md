==== Implementa en la siguiente subpantallas en:
pantalla principal: F:\ERPNew\client_erp\src\app\web\features\core\pages\user\user.component.ts.


================================================================================

Subpantalla: Formulario Usuario (CORE_USER)

Tipo UI: TIPO 2 (FORMULARIO CON TABS)

Panel: Identidad de Acceso

Campos en cabecera:
- Usuario (CORE_USER.username) - UI
- Email (CORE_USER.email) - UI
- Tipo Identificación (CORE_USER.core_identification_type_id) - FK
- No. Identificación (CORE_USER.identification_number) - UI
- Teléfono (CORE_USER.phone) - UI
- Es Admin Principal? (CORE_USER.is_main_admin) - BOOLEAN
- Estado Activo (CORE_USER.is_active) - BOOLEAN

Tabs:
    - Empresas Autorizadas
    - Roles Asignados
    - Sedes Autorizadas

Tab: Empresas Autorizadas
   *VER LÓGICA PARA TAB EMPRESAS AUTORIZADAS*
  
Acciones:
- Eliminar

Tab: Roles Asignados
    *VER LÓGICA PARA TAB ROLES Y PERMISOS*

Acciones:
- Eliminar

Tab: Sedes Autorizadas
   *VER LÓGICA PARA ESTE SEDES DEL USUARIO*

Acciones:
- Eliminar

================================================================================

== Obtener información del usuario
GET
{{baseUrl}}/api/v1/user/:id
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": {
        "id": "0e3f3c87-1a04-45f2-997f-ae5f33c555e0",
        "username": "admin1",
        "email": "admin1@gmail.com",
        "firstName": "Carlos",
        "lastName": "Gómez",
        "identificationNumber": "1234567890",
        "phone": "3001234567",
        "isMainAdmin": true,
        "isActive": true,
        "createdAt": "2026-04-09T15:21:54.252418",
        "companies": [
            {
                "companyId": "40000000-0000-0000-0000-000000000001",
                "companyName": "Acme Corporation S.A.",
                "isDefault": true
            },
            {
                "companyId": "5d19900c-5178-460b-99aa-d538acfd97cc",
                "companyName": "prueba",
                "isDefault": false
            },
            {
                "companyId": "b4588ff1-dd02-4e0b-9b4e-23ebf69cf3a0",
                "companyName": "TEST1",
                "isDefault": false
            }
        ],
        "roles": [
            {
                "roleId": "60000000-0000-0000-0000-000000000001",
                "roleName": "Super Admin"
            }
        ],
        "branches": [
            {
                "branchId": "55000000-0000-0000-0000-000000000001",
                "branchName": "Sede Principal - Bogotá",
                "companyName": "Acme Corporation S.A."
            }
        ]
    },
    "traceId": "87e670ff89c5557fdc17886ec91fd50d"
}


== Agregar empresa al usuario
POST
{{baseUrl}}/api/v1/user-company
{
    "coreUserId": "0e3f3c87-1a04-45f2-997f-ae5f33c555e0",
    "coreCompanyId": "40000000-0000-0000-0000-000000000001",
    "isDefault": true
}

== Eliminar user-company 
DELETE
{{baseUrl}}/api/v1/user-company/:id

NOTA: user-company no tiene UPDATE, solo o agrega o elimina.




== LÓGICA PARA TAB ROLES Y PERMISOS
        
    == Al Marcar un Checkbox (Asignar Rol)
    POST {{baseUrl}}/api/v1/user-role
    Cuerpo:
            {
            "coreUserId": "id-del-usuario",
            "coreRoleId": "id-del-rol-marcado"
            }   

===  Al Desmarcar un Checkbox (Quitar Rol)
     DELETE {{baseUrl}}/api/v1/user-role/{id}

==   1. Carga: Llamas a la Matriz Global.   
    Estado:
       Si isAssigned es true, el checkbox aparece marcado.
       Si isAssigned es false, aparece desmarcado.

== MATRIZ CON EL SIGUIENTE SERVICIO:
        GET
        {{baseUrl}}/api/v1/user-role/global-matrix/user/:userId
        {
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "companyId": "40000000-0000-0000-0000-000000000001",
            "companyName": "Acme Corporation S.A.",
            "isDefault": true,
            "roles": [
                {
                    "roleId": "60000000-0000-0000-0000-000000000001",
                    "roleName": "Super Admin",
                    "isAssigned": true,
                    "userRoleId": "6e5bd935-9fcd-4cfa-be12-97f820d7ee7a"
                }
            ]
        }
    ],
    "traceId": "7ed7875e7a136cd296fcbc9b2d35c89b"
}
    

== LÓGICA PARA SEDES DEL USUARIO

Debe tener una tabla que se llena con "branches". este viene en el detalle del usuario:
GET
{{baseUrl}}/api/v1/user/:id
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": {
        ...
        "branches": [
            {
                "branchId": "55000000-0000-0000-0000-000000000001",
                "branchName": "Sede Principal - Bogotá",
                "companyName": "Acme Corporation S.A."
            }
        ]
        ..
    },
    "traceId": "a9c80b622df9b1290285b30d1719a6f9"
}

Debe tener 2 dropdown:
- Empresa
    - GET
        {{baseUrl}}/api/v1/company/lookup
        {
            "succeeded": true,
            "message": null,
            "errors": null,
            "data": [
                {
                    "id": "0a9d9ba3-6cca-4b36-8631-072d5d71883a",
                    "name": "222ee",
                    "nitTaxId": "333"
                },
                {
                    "id": "f1758c0d-b9c7-4da6-8eb5-649f9a0e6873",
                    "name": "aaaa22e",
                    "nitTaxId": "22222"
                },
                {
                    "id": "40000000-0000-0000-0000-000000000001",
                    "name": "Acme Corporation S.A.",
                    "nitTaxId": "900123456-7"
                },
                {
                    "id": "5d19900c-5178-460b-99aa-d538acfd97cc",
                    "name": "prueba",
                    "nitTaxId": null
                },
                {
                    "id": "b4588ff1-dd02-4e0b-9b4e-23ebf69cf3a0",
                    "name": "TEST1",
                    "nitTaxId": "10101010"
                }
            ],
            "traceId": "9ee873898a7471823619f006d479e1e1"
        }
- sedes
    - cuando se seleccione la empresa se ejecuta
    GET 
    {{baseUrl}}/api/v1/branch/lookup/company/:companyId
    {
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "d39bd721-c4b1-4557-adfe-17b9e1e85dc4",
            "branchName": "Sede Norte",
            "companyName": "Acme Corporation S.A.",
            "address": "Cra 80 #45-10",
            "cityName": "Bogotá"
        },
        {
            "id": "55000000-0000-0000-0000-000000000001",
            "branchName": "Sede Principal - Bogotá",
            "companyName": "Acme Corporation S.A.",
            "address": "Calle 100 # 15-20",
            "cityName": "Bogotá"
        }
    ],
    "traceId": "eb25fd394cf77be8779795b1c877899a"
}

- boton de registrar, al seleccionar la empresa y la sede, se registra
nota: siempre y cuando el usuario es para editar.
POST
{{baseUrl}}/api/v1/user-branch
{
  "coreUserId": "db353163-4e71-54b6-0dbf-a1f7b8e7eb20",
  "coreBranchId": "65384d71-d45e-16cb-3f07-7bfd32b1aeec"
}


NOTA: si es un crear usuario, se debe crear en la tabla temporalmente
el siguiente objeto:
{
 "id": "00000000-0000-0000-0000-000000000000",
 "branchId": "55000000-0000-0000-0000-000000000001",
 "branchName": "Sede Principal - Bogotá",
 "companyName": "Acme Corporation S.A."
}
y si se elimina, se elimina de la tabla (no de la BD ya que al momento de registrar un usuario, no hay datos en la BD para ese usuario)


NOTA 2: Si el usuario es para editar y se registra una sede para el usuario, se puede refrescar la tabla llamando 
GET
{{baseUrl}}/api/v1/user-branch/user/:userId
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "ee780a02-9371-4a10-a8ca-0d70bfbcd341",
            "branchId": "55000000-0000-0000-0000-000000000001",
            "branchName": "Sede Principal - Bogotá",
            "companyName": "Acme Corporation S.A."
        }
    ],
    "traceId": "7034c423b8e623f47dd02f6e71ee8cdd"
}

== Eliminar una sede asociada a un usuario
DELETE
{{baseUrl}}/api/v1/user-branch/{id}


== LÓGICA PARA TAB EMPRESAS AUTORIZADAS

Para el tab de empresas autorizadas se debe tener:
- 1 dropdown de empresa  ( {{baseUrl}}/api/v1/company/lookup ) 
- 1 boton de registrar 
- 1 tabla

Cuando el usuario es para editar, en el 
{{baseUrl}}/api/v1/user/:id
ya viene 
...
  "companies": [
            {
                "companyId": "40000000-0000-0000-0000-000000000001",
                "companyName": "Acme Corporation S.A.",
                "isDefault": true
            },
            {
                "companyId": "5d19900c-5178-460b-99aa-d538acfd97cc",
                "companyName": "prueba",
                "isDefault": false
            },
            {
                "companyId": "b4588ff1-dd02-4e0b-9b4e-23ebf69cf3a0",
                "companyName": "TEST1",
                "isDefault": false
            }
]
...

== Para registrar una nueva empresa al usuario es 
Cuando seleccione el dropdown de la empresa, se registra:
POST
{{baseUrl}}/api/v1/user-company
{
    "coreUserId": "14822619-b001-f38e-b124-a8d65d98fd1e",
    "coreCompanyId": "770a2962-944d-eceb-7e03-a99bb3591fc4",
    "isDefault": false
}

== para eliminar
DELETE
{{baseUrl}}/api/v1/user-company/:id


== Para refrescar la tabla cuando registren una empresa para el usuario
GET
{{baseUrl}}/api/v1/user-company/user/:userId
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "533a2ce3-8acb-4e42-83d2-9dfc413d1059",
            "companyId": "40000000-0000-0000-0000-000000000001",
            "companyName": "Acme Corporation S.A.",
            "isDefault": true
        },
        {
            "id": "7b2d030d-a1a7-400d-b773-183eb5ac0a1f",
            "companyId": "5d19900c-5178-460b-99aa-d538acfd97cc",
            "companyName": "prueba",
            "isDefault": false
        },
        {
            "id": "f41a76b1-9b26-4e96-a6e0-8227923e1fba",
            "companyId": "b4588ff1-dd02-4e0b-9b4e-23ebf69cf3a0",
            "companyName": "TEST1",
            "isDefault": false
        }
    ],
    "traceId": "b5f0010ed90338e31ef21ac532edbe57"
}


=== Obtener identificationTypes
GET
{{baseUrl}}/api/v1/identification-type
{
    "succeeded": true,
    "message": null,
    "errors": null,
    "data": [
        {
            "id": "50000000-0000-0000-0000-000000000001",
            "coreCountryId": "30000000-0000-0000-0000-000000000001",
            "name": "NIT",
            "code": "NIT",
            "createdAt": "2026-04-11T07:09:58.05824"
        },
        {
            "id": "50000000-0000-0000-0000-000000000002",
            "coreCountryId": "30000000-0000-0000-0000-000000000001",
            "name": "Cédula de Ciudadanía",
            "code": "CC",
            "createdAt": "2026-04-11T07:09:58.05824"
        }
    ],
    "traceId": "3102a13fa8e6b71418427215f093c54b"
}

== Actualizar Usuario
PUT {{baseUrl}}/api/v1/user/:id
{
  "id": "7e7ba351-815d-d9cc-2931-e454f58e0be7",
  "username": "string",
  "email": "string",  
  "firstName": "string",
  "lastName": "string",
  "coreIdentificationTypeId": null,
  "identificationNumber": "string",
  "phone": "string",
  "isMainAdmin": false,
  "isActive": false
}


========================== NOTAS IMPORTANTES ========================================

1: Para este formulario del usuario, si es para registrar, se ocultan todos los tabs y solo se muestran para los datos basicos:
POST
{{baseUrl}}/api/v1/user
{
  "coreCompanyId": "d8034ffb-50d6-1d60-903d-362fd8cfdc85",
  "username": "string",
  "email": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string",
  "coreIdentificationTypeId": null,
  "identificationNumber": null,
  "phone": "string",
  "isMainAdmin": false
}


2: Cuando es para editar, se muestran los otros tabs y se registra/actualiza/elimina cada tab independiente de acuerdo a los endpoints
y se actualiza  de acuerdo a la lógica de cada uno.

3: El boton de actualizar general es para solo los datos del usuario, ya cada tab tiene su crear/eliminar independiente







