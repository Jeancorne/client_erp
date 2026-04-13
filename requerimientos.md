Requerimientos para la siguiente pantalla



======================================================================================================
Pantalla: 4.4 Geografía Global (CORE_COUNTRY / CORE_STATE / CORE_CITY)

Tipo UI: TIPO 3 (MATRIZ JERÁRQUICA)

Panel: Navegación Geográfica

Campos en cabecera:
- Nombre (CORE_COUNTRY.name / CORE_STATE.name / CORE_CITY.name) - UI
- Código ISO/DANE (CORE_COUNTRY.iso_code_2 / CORE_CITY.dane_code) - UI

La idea es hacer que yo seleccione el país en un dropdown, le de filtrar y me muestre los departamentos con ciudades en modo tree.

======================================================================================================

### Endpoints Relacionados:

#### Países (Country)
- `GET /api/v1/country` - Obtener todos los países.
- `GET /api/v1/country/{id}` - Obtener un país por ID.
- `POST /api/v1/country` - Crear un país.
- `PUT /api/v1/country/{id}` - Actualizar un país.
- `DELETE /api/v1/country/{id}` - Eliminar un país.

#### Departamentos/Estados (State)
- `GET /api/v1/state` - Obtener todos los departamentos.
- `GET /api/v1/state/{id}` - Obtener un departamento por ID.
- `GET /api/v1/state/country/{countryId}` - Obtener departamentos por ID de país.
- `POST /api/v1/state` - Crear un departamento.
- `PUT /api/v1/state/{id}` - Actualizar un departamento.
- `DELETE /api/v1/state/{id}` - Eliminar un departamento.

#### Ciudades (City)
- `GET /api/v1/city` - Obtener todas las ciudades.
- `GET /api/v1/city/{id}` - Obtener una ciudad por ID.
- `GET /api/v1/city/state/{stateId}` - Obtener ciudades por ID de departamento.
- `POST /api/v1/city` - Crear una ciudad.
- `PUT /api/v1/city/{id}` - Actualizar una ciudad.
- `DELETE /api/v1/city/{id}` - Eliminar una ciudad.

======================================================================================================