# Spritascore — Application Risk & Cost Calculator

Plataforma B2B de calculadoras de riesgo, costo y madurez para aplicaciones de software. Estima el impacto económico de defectos de calidad, vulnerabilidades OWASP y riesgos sectoriales.

**Dominio:** [spritascore.com](https://spritascore.com)

## Calculadoras incluidas

1. **Costo de no calidad en el código** — ISO/IEC 25010 / ISO/IEC 9126
2. **Costo de vulnerabilidad OWASP Top 10** — Aplicaciones web (2021)
3. **Costo de vulnerabilidad OWASP Mobile Top 10** — Apps móviles (2024)
4. **Costo de vulnerabilidad por sector** — 18 sectores industriales

## Stack tecnológico

- Next.js 16 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4
- Recharts (gráficos)
- Zod + React Hook Form (validación)
- Radix UI (componentes base)

## Requisitos

- Node.js 18.17+
- npm 9+

## Instalación local

```bash
cd spritascore
npm install
cp .env.example .env.local
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000)

## Variables de entorno

| Variable | Descripción |
|----------|-------------|
| `RESEND_API_KEY` | API key de Resend para enviar leads a `info@sprita-it.com` |
| `LEAD_EMAIL_TO` | Destino de leads (default: `info@sprita-it.com`) |
| `LEAD_EMAIL_FROM` | Remitente verificado en Resend (default: `info@sprita-it.com`) |
| `HUBSPOT_SERVICE_KEY` | Opcional: credencial privada del servidor para registrar leads en HubSpot |
| `CRM_WEBHOOK_URL` | Opcional: webhook adicional (Zapier, Salesforce) |

## Despliegue en Vercel

1. Conecte el repositorio en [vercel.com](https://vercel.com)
2. Instale Resend: `vercel integration add resend/resend-email`
3. Verifique el dominio `sprita-it.com` en Resend y configure `LEAD_EMAIL_FROM=SpritaScore <info@sprita-it.com>`
4. Opcional: configure `HUBSPOT_SERVICE_KEY` o `CRM_WEBHOOK_URL` para registrar los leads en un CRM
5. Deploy automático en cada push a `main`

```bash
npm run build   # Verificar build local
npx vercel      # Deploy manual (opcional)
```

## Estructura del proyecto

```
src/
├── app/                    # Páginas y API routes
│   ├── calculadora/[slug]  # Wizard de calculadoras
│   ├── resultados/[id]     # Resultados + lead capture
│   ├── reporte/[id]        # Reporte imprimible/PDF
│   └── api/crm/            # Webhook de leads
├── components/             # UI y componentes de negocio
├── data/                   # Configuración (OWASP, ISO, sectores)
├── i18n/                   # Traducciones (es, en, pt)
├── lib/                    # Lógica de cálculo y utilidades
└── types/                  # Tipos TypeScript
```

## Arquitectura

- **Configuración desacoplada:** Fórmulas, multiplicadores y textos en `/data` y `/lib`
- **Motor de recomendaciones:** Reglas basadas en score, sector, controles y tipo de calculadora
- **Lead gating:** Resultado parcial visible; reporte completo tras captura de email
- **Persistencia:** localStorage (preparado para CRM vía webhook)
- **Analítica:** Eventos `calculator_started`, `calculator_completed`, `lead_submitted`, `report_downloaded`, `cta_clicked`

## Medición comercial

La configuración en `scripts/gtm-spritascore-import.json` envía a GA4 `calculator_started`, `calculator_completed` y `generate_lead`. Cada etapa lleva el identificador de la calculadora (`calculator_id`) y el idioma del sitio (`locale`). Una solicitud directa de auditoría se registra como `direct`.

`generate_lead` se emite al confirmar el formulario. `lead_type` distingue el desbloqueo de un informe (`report`), el contacto sobre una evaluación (`assessment`) y la solicitud de alcance de auditoría (`audit_request`). Los datos de contacto siguen su flujo de correo y CRM.

Verifica los eventos con `npm run verify:gtm`. Para validar la instalación, usa la vista previa de GTM en un entorno de prueba y comprueba en GA4 que cada envío exitoso genera un solo evento. Confirma también la recepción en el buzón o CRM de prueba. Registra `calculator_id`, `locale` y `lead_type` como dimensiones de evento en GA4. Usa `audit_request` para medir intención explícita de compra y el estado registrado por ventas para medir oportunidades y cierres.

## Conexión con HubSpot

1. En la cuenta [SpritaScore HubSpot 2204944](https://app.hubspot.com/global-home/2204944), abre **Configuración → Integraciones → Service Keys**. Crea la clave `SpritaScore Leads` con `crm.objects.contacts.read`, `crm.objects.contacts.write` y `crm.objects.notes.write`. [Guía de HubSpot sobre Service Keys](https://developers.hubspot.com/changelog/service-keys).
2. Guarda la clave como `HUBSPOT_SERVICE_KEY` en las variables privadas del entorno de prueba. Para desarrollo local se carga desde `.env.local`. Mantén la clave fuera del repositorio y de los mensajes de chat.
3. Tras reiniciar el entorno, envía un formulario con un correo de prueba que controles. Verifica el contacto y su nota en HubSpot. Envía después otro tipo de formulario con ese correo y comprueba que la segunda nota aparece en la misma ficha.

Se reutilizan los contactos existentes por correo electrónico y se agrega una nota con el tipo de solicitud, idioma, calculadora y código de auditoría cuando corresponda. La sincronización se aplica a los nuevos envíos. El correo actual sigue respaldando la recepción si HubSpot falla. Los fallos se registran como `[HubSpot]` en los logs del servidor y pueden conciliarse con el buzón. La integración de CRM no suscribe a los contactos a secuencias ni cambia su estado de marketing.

## Disclaimer

Los resultados son estimaciones orientativas. No constituyen auditoría formal, certificación ni opinión legal.
