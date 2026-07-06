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
| `RESEND_API_KEY` | API key de Resend para enviar leads a `info@spritascore.com` |
| `LEAD_EMAIL_TO` | Destino de leads (default: `info@spritascore.com`) |
| `LEAD_EMAIL_FROM` | Remitente verificado en Resend (default: `notifications@spritascore.com`) |
| `CRM_WEBHOOK_URL` | Opcional: webhook adicional (HubSpot, Zapier, Salesforce) |

## Despliegue en Vercel

1. Conecte el repositorio en [vercel.com](https://vercel.com)
2. Instale Resend: `vercel integration add resend/resend-email`
3. Verifique el dominio `spritascore.com` en Resend y configure `LEAD_EMAIL_FROM`
4. Opcional: configure `CRM_WEBHOOK_URL` para duplicar leads en un CRM
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

## Disclaimer

Los resultados son estimaciones orientativas. No constituyen auditoría formal, certificación ni opinión legal.