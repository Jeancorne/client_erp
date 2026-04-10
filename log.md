{
    
        "menus": [
            {
                "id": "10000000-0000-0000-0000-000000000001",
                "name": "Master Central",
                "icon": "settings_suggest",
                "sequence": 1,
                "items": [
                    {
                        "id": "20000001-0000-0000-0000-000000000001",
                        "name": "Estado de Suscripción",
                        "routePath": "/master/subscription",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000001-0000-0000-0000-000000000002",
                        "name": "Módulos Autorizados",
                        "routePath": "/master/modules",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000002",
                "name": "Mi Escritorio",
                "icon": "dashboard",
                "sequence": 2,
                "items": [
                    {
                        "id": "20000002-0000-0000-0000-000000000001",
                        "name": "Notificaciones",
                        "routePath": "/desktop/notifications",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000002-0000-0000-0000-000000000002",
                        "name": "Agenda Comercial",
                        "routePath": "/desktop/agenda",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000002-0000-0000-0000-000000000003",
                        "name": "Aprobaciones Pendientes",
                        "routePath": "/desktop/approvals",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000003",
                "name": "Estructura Organizativa",
                "icon": "account_tree",
                "sequence": 3,
                "items": [
                    {
                        "id": "20000003-0000-0000-0000-000000000001",
                        "name": "Holding / Empresa",
                        "routePath": "/core/companies",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000003-0000-0000-0000-000000000002",
                        "name": "Sedes / Sucursales",
                        "routePath": "/core/branches",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000003-0000-0000-0000-000000000003",
                        "name": "Unidades de Negocio",
                        "routePath": "/core/business-units",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000003-0000-0000-0000-000000000004",
                        "name": "Departamentos",
                        "routePath": "/hr/departments",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000003-0000-0000-0000-000000000005",
                        "name": "Cargos / Puestos",
                        "routePath": "/hr/jobs",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000004",
                "name": "Seguridad y Maestros",
                "icon": "admin_panel_settings",
                "sequence": 4,
                "items": [
                    {
                        "id": "20000004-0000-0000-0000-000000000001",
                        "name": "Usuarios y Acceso",
                        "routePath": "/core/users",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000002",
                        "name": "Roles y Perfiles",
                        "routePath": "/core/roles",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000003",
                        "name": "Directorio de Terceros",
                        "routePath": "/core/partners",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000004",
                        "name": "Geografía Global",
                        "routePath": "/core/geography",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000005",
                        "name": "Catálogo de Impuestos",
                        "routePath": "/core/taxes",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000006",
                        "name": "Estructura de Menús",
                        "routePath": "/core/menu-config",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000004-0000-0000-0000-000000000007",
                        "name": "Permisos por Rol",
                        "routePath": "/core/permissions",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000005",
                "name": "Gestión Comercial",
                "icon": "handshake",
                "sequence": 5,
                "items": [
                    {
                        "id": "20000005-0000-0000-0000-000000000001",
                        "name": "Campañas de Marketing",
                        "routePath": "/crm/campaigns",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000002",
                        "name": "Equipos y Cuotas",
                        "routePath": "/crm/teams",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000003",
                        "name": "Leads / Prospectos",
                        "routePath": "/crm/leads",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000004",
                        "name": "Oportunidades / Pipeline",
                        "routePath": "/crm/opportunities",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000005",
                        "name": "Análisis de Competidores",
                        "routePath": "/crm/competitors",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000006",
                        "name": "Listas de Marketing",
                        "routePath": "/crm/marketing-lists",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000007",
                        "name": "Reglas de Asignación",
                        "routePath": "/crm/assignment-rules",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000008",
                        "name": "Casos de Soporte / Tickets",
                        "routePath": "/crm/tickets",
                        "sequence": 8,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000009",
                        "name": "Políticas de SLA",
                        "routePath": "/crm/sla-policies",
                        "sequence": 9,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000010",
                        "name": "Salud del Cliente",
                        "routePath": "/crm/customer-health",
                        "sequence": 10,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000005-0000-0000-0000-000000000011",
                        "name": "Programa de Lealtad",
                        "routePath": "/crm/loyalty",
                        "sequence": 11,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000006",
                "name": "Operaciones de Venta",
                "icon": "shopping_cart",
                "sequence": 6,
                "items": [
                    {
                        "id": "20000006-0000-0000-0000-000000000001",
                        "name": "Cotizaciones / Presupuestos",
                        "routePath": "/sale/quotations",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000002",
                        "name": "Pedidos de Venta",
                        "routePath": "/sale/orders",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000003",
                        "name": "Facturación Electrónica",
                        "routePath": "/sale/invoices",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000004",
                        "name": "Devoluciones y Notas Crédito",
                        "routePath": "/sale/returns",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000005",
                        "name": "Despachos y Logística",
                        "routePath": "/sale/deliveries",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000006",
                        "name": "Listas de Precios",
                        "routePath": "/sale/pricelists",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000006-0000-0000-0000-000000000007",
                        "name": "Comisiones de Venta",
                        "routePath": "/sale/commissions",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000007",
                "name": "Abastecimiento y Compras",
                "icon": "shopping_bag",
                "sequence": 7,
                "items": [
                    {
                        "id": "20000007-0000-0000-0000-000000000001",
                        "name": "Requisiciones de Compra",
                        "routePath": "/purch/requisitions",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000002",
                        "name": "Licitaciones y Cuadros",
                        "routePath": "/purch/bids",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000003",
                        "name": "Órdenes de Compra",
                        "routePath": "/purch/orders",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000004",
                        "name": "Recepciones de Almacén",
                        "routePath": "/purch/receipts",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000005",
                        "name": "Facturas de Proveedor",
                        "routePath": "/purch/invoices",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000006",
                        "name": "Prorrateo Landed Cost",
                        "routePath": "/purch/landed-costs",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000007",
                        "name": "Contratos de Compra",
                        "routePath": "/purch/contracts",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000008",
                        "name": "Calificación de Proveedores",
                        "routePath": "/purch/vendor-rating",
                        "sequence": 8,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000009",
                        "name": "Cumplimiento y Certificaciones",
                        "routePath": "/purch/vendor-compliance",
                        "sequence": 9,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000007-0000-0000-0000-000000000010",
                        "name": "Reglas de Pronto Pago",
                        "routePath": "/purch/early-payment",
                        "sequence": 10,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000008",
                "name": "Gestión de Inventarios",
                "icon": "inventory_2",
                "sequence": 8,
                "items": [
                    {
                        "id": "20000008-0000-0000-0000-000000000001",
                        "name": "Maestro de Productos",
                        "routePath": "/inv/products",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000002",
                        "name": "Saldos y Existencias",
                        "routePath": "/inv/quants",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000003",
                        "name": "Kárdex de Movimientos",
                        "routePath": "/inv/movements",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000004",
                        "name": "Lotes y Series",
                        "routePath": "/inv/lots-series",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000005",
                        "name": "Bodegas y Ubicaciones",
                        "routePath": "/inv/locations",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000006",
                        "name": "Unidades y Categorías",
                        "routePath": "/inv/uom-categories",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000007",
                        "name": "Ajustes e Inventario Físico",
                        "routePath": "/inv/adjustments",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000008",
                        "name": "Gestión de Mermas",
                        "routePath": "/inv/scraps",
                        "sequence": 8,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000008-0000-0000-0000-000000000009",
                        "name": "Traslados Internos",
                        "routePath": "/inv/transfers",
                        "sequence": 9,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000009",
                "name": "Finanzas y Cumplimiento",
                "icon": "account_balance",
                "sequence": 9,
                "items": [
                    {
                        "id": "20000009-0000-0000-0000-000000000001",
                        "name": "Libro Mayor / Asientos",
                        "routePath": "/acc/entries",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000002",
                        "name": "Diferencia en Cambio",
                        "routePath": "/acc/revaluation",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000003",
                        "name": "Diferidos y Amortizaciones",
                        "routePath": "/acc/deferred",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000004",
                        "name": "Plan de Cuentas PUC",
                        "routePath": "/acc/chart-of-accounts",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000005",
                        "name": "Centros de Costo",
                        "routePath": "/acc/analytic-accounts",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000006",
                        "name": "Diarios Contables",
                        "routePath": "/acc/journals",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000007",
                        "name": "Años y Periodos Fiscales",
                        "routePath": "/acc/fiscal-years",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000008",
                        "name": "Ejecución Presupuestal",
                        "routePath": "/acc/budgets",
                        "sequence": 8,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000009",
                        "name": "Tasas de Cambio TRM",
                        "routePath": "/acc/exchange-rates",
                        "sequence": 9,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000010",
                        "name": "Reportes Financieros",
                        "routePath": "/acc/reports",
                        "sequence": 10,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000011",
                        "name": "Reglas Intercompany",
                        "routePath": "/acc/intercompany",
                        "sequence": 11,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000012",
                        "name": "Mapeo Fiscal Exógena",
                        "routePath": "/acc/fiscal-map",
                        "sequence": 12,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000013",
                        "name": "Dashboard Indicadores",
                        "routePath": "/acc/dashboard",
                        "sequence": 13,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000014",
                        "name": "Configuración Fiscal DIAN",
                        "routePath": "/acc/fiscal-config",
                        "sequence": 14,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000009-0000-0000-0000-000000000015",
                        "name": "Monitor de Cumplimiento",
                        "routePath": "/acc/compliance",
                        "sequence": 15,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000010",
                "name": "Tesorería y Bancos",
                "icon": "payments",
                "sequence": 10,
                "items": [
                    {
                        "id": "20000010-0000-0000-0000-000000000001",
                        "name": "Cuentas Bancarias",
                        "routePath": "/bank/accounts",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000002",
                        "name": "Pagos y Recaudos",
                        "routePath": "/bank/payments",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000003",
                        "name": "Extractos Bancarios",
                        "routePath": "/bank/statements",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000004",
                        "name": "Transferencias Internas",
                        "routePath": "/bank/internal-transfers",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000005",
                        "name": "Motor de Conciliación",
                        "routePath": "/bank/reconcile",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000006",
                        "name": "Gestión de Caja Menor",
                        "routePath": "/bank/cash-control",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000010-0000-0000-0000-000000000007",
                        "name": "Flujo de Caja Proyectado",
                        "routePath": "/bank/cash-flow",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000011",
                "name": "Talento Humano",
                "icon": "groups",
                "sequence": 11,
                "items": [
                    {
                        "id": "20000011-0000-0000-0000-000000000001",
                        "name": "Maestro de Empleados",
                        "routePath": "/hr/employees",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000002",
                        "name": "Control de Asistencia",
                        "routePath": "/hr/attendance",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000003",
                        "name": "Ausencias y Vacaciones",
                        "routePath": "/hr/leaves",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000004",
                        "name": "Liquidación de Nómina",
                        "routePath": "/hr/payroll",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000005",
                        "name": "Gastos y Viáticos",
                        "routePath": "/hr/expenses",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000006",
                        "name": "Evaluaciones y Desempeño",
                        "routePath": "/hr/performance",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000007",
                        "name": "Reglas Salariales",
                        "routePath": "/hr/payroll-rules",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000008",
                        "name": "Calendarios y Festivos",
                        "routePath": "/hr/calendars",
                        "sequence": 8,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000011-0000-0000-0000-000000000009",
                        "name": "Liquidación de Contrato",
                        "routePath": "/hr/settlement",
                        "sequence": 9,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000012",
                "name": "Manufactura y MRP",
                "icon": "precision_manufacturing",
                "sequence": 12,
                "items": [
                    {
                        "id": "20000012-0000-0000-0000-000000000001",
                        "name": "Órdenes de Trabajo OT",
                        "routePath": "/mfg/orders",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000002",
                        "name": "Estructuras y Rutas",
                        "routePath": "/mfg/bom-routing",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000003",
                        "name": "Centros de Trabajo",
                        "routePath": "/mfg/work-centers",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000004",
                        "name": "Control de Calidad",
                        "routePath": "/mfg/quality",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000005",
                        "name": "Mantenimiento Industrial",
                        "routePath": "/mfg/maintenance",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000006",
                        "name": "Dashboard OEE e IoT",
                        "routePath": "/mfg/oee",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000012-0000-0000-0000-000000000007",
                        "name": "Planeador MRP",
                        "routePath": "/mfg/mrp",
                        "sequence": 7,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000013",
                "name": "Servicios y Proyectos",
                "icon": "assignment",
                "sequence": 13,
                "items": [
                    {
                        "id": "20000013-0000-0000-0000-000000000001",
                        "name": "Proyectos y Baselines",
                        "routePath": "/proj/projects",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000013-0000-0000-0000-000000000002",
                        "name": "Registro de Tiempos",
                        "routePath": "/proj/timesheets",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000013-0000-0000-0000-000000000003",
                        "name": "Incidencias y Riesgos",
                        "routePath": "/proj/issues-risks",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000013-0000-0000-0000-000000000004",
                        "name": "Cronograma Facturación",
                        "routePath": "/proj/billing",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000013-0000-0000-0000-000000000005",
                        "name": "Gastos de Proyecto",
                        "routePath": "/proj/expenses",
                        "sequence": 5,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000013-0000-0000-0000-000000000006",
                        "name": "Proyección Capacidad",
                        "routePath": "/proj/capacity",
                        "sequence": 6,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000014",
                "name": "Gestión de Activos (EAM)",
                "icon": "construction",
                "sequence": 14,
                "items": [
                    {
                        "id": "20000014-0000-0000-0000-000000000001",
                        "name": "Maestro de Activos Fijos",
                        "routePath": "/asset/assets",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000014-0000-0000-0000-000000000002",
                        "name": "Asignación y Traslados",
                        "routePath": "/asset/transfers",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000014-0000-0000-0000-000000000003",
                        "name": "Órdenes de Mantenimiento",
                        "routePath": "/asset/maintenance",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000014-0000-0000-0000-000000000004",
                        "name": "Auditoría Física",
                        "routePath": "/asset/audit",
                        "sequence": 4,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            },
            {
                "id": "10000000-0000-0000-0000-000000000015",
                "name": "Administración Técnica",
                "icon": "settings",
                "sequence": 15,
                "items": [
                    {
                        "id": "20000015-0000-0000-0000-000000000001",
                        "name": "Flujos de Aprobación",
                        "routePath": "/sys/approval-rules",
                        "sequence": 1,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000015-0000-0000-0000-000000000002",
                        "name": "Repositorio de Adjuntos",
                        "routePath": "/sys/attachments",
                        "sequence": 2,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    },
                    {
                        "id": "20000015-0000-0000-0000-000000000003",
                        "name": "Auditoría de Aprobaciones",
                        "routePath": "/sys/approval-log",
                        "sequence": 3,
                        "actions": [
                            "READ",
                            "CREATE",
                            "UPDATE",
                            "DELETE"
                        ]
                    }
                ]
            }
        ]
    }
    