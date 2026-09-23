# CyberCheck

**Plataforma de auditoría de Inteligencia Artificial para PyMEs chilenas.**

Audita el uso responsable, seguro y legal de IA en tu organización con marcos internacionales (NIST AI RMF, ISO 42001, AI Act UE) y marco legal chileno (Ley 19.628, Ley 21.459). Diseñada para PyMEs críticas: salud, servicios básicos, telecomunicaciones.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8?logo=tailwindcss)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-New_York-black)
![License](https://img.shields.io/badge/License-MIT-green)

> *"La ciberseguridad no es tener limitaciones restringidas, sino que da libertad y mayor eficiencia de gobernanza de los datos."*

---

## 🎯 ¿Qué hace CyberCheck?

CyberCheck es un dashboard interactivo que ejecuta auditorías de IA contextualizadas a tu organización. El flujo es:

1. **Seleccionas** una auditoría del catálogo (10 disponibles: 6 internacionales + 4 chilenas)
2. **Respondes** un wizard corto con preguntas sobre tu contexto (tamaño, usos de IA, controles actuales)
3. **Ejecutas** la auditoría con IA — un LLM evalúa cada control del checklist basándose en tus respuestas
4. **Recibes** un dashboard con score global, distribución por severidad, hallazgos específicos y recomendaciones accionables
5. **Exportas** el informe en PDF multilenguaje (ES/EN/PT)

---

## 📋 Catálogo de auditorías

### 🌐 Internacional (6)

| Auditoría | Marco | Controles |
|-----------|-------|-----------|
| AI Governance Audit | NIST AI RMF — Gobernar | 8 |
| AI Compliance Audit | AI Act UE + NIST AI RMF | 8 |
| AI Risk Assessment | NIST AI RMF — Medir | 8 |
| Responsible AI Audit | OECD + UNESCO | 7 |
| ISO 42001 | ISO/IEC 42001:2023 | 8 |
| Shadow AI / AI Usage Audit | SANS + NIST CSF adaptado | 8 |

### 🇨🇱 Nacional — Chile (4)

| Auditoría | Marco | Controles |
|-----------|-------|-----------|
| Ley 19.628 + IA | Ley 19.628 + Reglamento | 10 |
| Ley 19.223 + IA | Ley 19.223 (Delitos Informáticos) | 7 |
| Ley 21.459 + IA | Ley 21.459 (moderniza Ley 19.223) | 7 |
| Marco IA Chile (placeholder) | Proyectos en tramitación | 6 |

**Total: 77 controles auditables** con severidad, descripción, evidencia esperada y recomendación base.

---

## 🎨 Diseño y UX

- **2 paletas intercambiables** en tiempo real (botón "Paleta" en la barra superior):
  - **Azul Aqua** — fresco, profesional, confianza (default)
  - **Verde Esmeralda** — natural, seguro, vital
- Ambas con **75% blanco/gris** y degradados sutiles no intrusivos
- **Glassmorphism** en navbar, **sombras premium** tipo SaaS
- **Animaciones** Framer Motion sutiles en hero, transiciones y micro-interacciones
- **100% responsive** — probado en mobile (390px) y desktop (1280px+)
- **Footer sticky** que se empuja naturalmente con el contenido

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Framework | Next.js 16 (App Router) |
| Lenguaje | TypeScript 5 (estricto) |
| Estilos | Tailwind CSS 4 |
| UI Components | shadcn/ui (estilo New York) |
| Iconos | Lucide React |
| Gráficos | Recharts |
| Animaciones | Framer Motion |
| IA / LLM | z-ai-web-dev-sdk (backend únicamente) |
| PDF Export | jsPDF |
| Base de datos | Prisma + SQLite (configurada, lista para persistir historial) |
| Runtime | Bun |
| Gateway | Caddy |

---

## 🚀 Instalación y desarrollo

### Requisitos

- Node.js 20+ o Bun 1.1+
- Cuenta con acceso al SDK de z-ai-web-dev-sdk (configurado automáticamente en el entorno Z.ai)

### Setup

```bash
# Clonar el repo
git clone https://github.com/teleco725-lgtm/cybercheck.git
cd cybercheck

# Instalar dependencias
bun install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus valores

# Inicializar la base de datos (SQLite local)
bun run db:push

# Iniciar el servidor de desarrollo
bun run dev
```

Abrir `http://localhost:3000` en el navegador.

### Scripts disponibles

```bash
bun run dev        # Servidor de desarrollo (puerto 3000)
bun run build      # Build de producción
bun run start      # Servidor de producción
bun run lint       # ESLint
bun run db:push    # Aplicar schema a SQLite
bun run db:generate # Regenerar Prisma Client
```

---

## 📁 Estructura del proyecto

```
cybercheck/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── audit/route.ts     # POST /api/audit — ejecuta auditoría con LLM
│   │   │   └── route.ts           # Health check
│   │   ├── globals.css            # Paletas, gradientes, animaciones
│   │   ├── layout.tsx             # Layout raíz
│   │   └── page.tsx               # Página principal (hero, menú, wizard, dashboard)
│   ├── components/
│   │   ├── ui/                    # Componentes shadcn/ui
│   │   ├── audit-wizard.tsx       # Wizard multi-paso
│   │   ├── results-dashboard.tsx   # Dashboard de resultados con gráficos
│   │   └── theme-toggle.tsx       # Cambio de paleta azul/verde
│   ├── hooks/                     # use-toast, use-mobile
│   └── lib/
│       ├── audits.ts              # Catálogo de auditorías + checklists
│       ├── pdf-export.ts          # Generación de PDF multilenguaje
│       ├── db.ts                  # Cliente Prisma
│       └── utils.ts               # Utilidades
├── prisma/
│   └── schema.prisma              # Schema de base de datos
├── public/                        # Assets estáticos
├── Caddyfile                      # Configuración del gateway
└── package.json
```

---

## 🔌 API

### `POST /api/audit`

Ejecuta una auditoría con IA.

**Request:**

```json
{
  "auditId": "shadow-ai",
  "answers": {
    "orgName": "PyME Salud SpA",
    "employeeCount": "25",
    "knownUsage": ["ChatGPT (OpenAI)", "Claude (Anthropic)"],
    "dlpSolution": "No, pero planeamos"
  },
  "language": "es"
}
```

**Response:**

```json
{
  "auditId": "shadow-ai",
  "auditName": "Auditoría de Shadow AI",
  "framework": "SANS + NIST CSF adaptado a IA",
  "timestamp": "2026-09-23T19:00:00.000Z",
  "overallScore": 28,
  "complianceLevel": "Crítico",
  "summary": "...",
  "items": [...],
  "distribution": [...],
  "quickWins": [...],
  "criticalActions": [...]
}
```

El LLM evalúa cada ítem del checklist basándose en las respuestas y devuelve un estado (`compliant` / `partial` / `non_compliant` / `not_applicable`) con hallazgos, evidencia y recomendación adaptada al contexto.

**Fallback determinístico**: si el LLM no responde en 60s, se aplica una heurística básica para que la auditoría nunca quede incompleta.

---

## 🎨 Personalización

### Cambiar paleta de colores

Las paletas se definen en `src/app/globals.css` como variables CSS (OKLCH). La paleta activa se guarda en `localStorage` con la clave `cybercheck-palette`.

### Añadir una nueva auditoría

Edita `src/lib/audits.ts` y añade un objeto `AuditType` al grupo correspondiente (internacional o chile):

```typescript
{
  id: "mi-nueva-auditoria",
  name: "Mi Nueva Auditoría",
  shortName: "Mi Auditoría",
  region: "internacional",
  category: "gobernanza",
  icon: "Building2",  // debe existir en ICONS en page.tsx
  summary: "...",
  framework: "Mi Marco v1.0",
  wizardQuestions: [...],
  checklist: [...]
}
```

### Cambiar idioma por defecto

En `src/app/page.tsx`, modifica el `useState` inicial de `language`:

```typescript
const [language, setLanguage] = useState<"es" | "en" | "pt">("en");
```

---

## 🗺️ Roadmap

- [ ] **Persistencia de auditorías**: guardar historial por organización (Prisma ya configurado)
- [ ] **Multi-usuario**: auth con NextAuth.js (ya instalado)
- [ ] **Checklist imprimible**: además del informe, generar checklist en blanco para que el cliente lo complete manualmente antes de la auditoría con IA
- [ ] **Plantillas por industria**: reglas específicas para salud, finanzas, telecom
- [ ] **Integración con SIEM**: leer logs reales para Shadow AI Audit en vez de solo encuesta
- [ ] **Programar auditorías recurrentes**: mensual/trimestral con diff de resultados
- [ ] **API pública** para integraciones (webhooks cuando una auditoría cambia de estado)

---

## 🤝 Contribuir

1. Fork el repo
2. Crea una rama: `git checkout -b feature/mi-feature`
3. Commit: `git commit -m 'Add mi-feature'`
4. Push: `git push origin feature/mi-feature`
5. Abre un Pull Request

Por favor corre `bun run lint` antes de commitear.

---

## 📝 Licencia

MIT — ver [LICENSE](LICENSE).

Puedes usar, modificar y distribuir libremente, incluyendo uso comercial. Si construyes algo útil sobre CyberCheck, no es obligatorio, pero se agradece un mention. 💙

---

## 🛡️ Disclaimer

CyberCheck es una herramienta de **apoyo a la auditoría**, no sustituye auditoría profesional certificada. Los resultados generados por IA deben validarse por un auditor humano antes de tomar decisiones de cumplimiento legal.

Para certificación formal ISO 42001 o cumplimiento regulatorio específico, consulta con un auditor certificado.

---

**Hecho con 💙 para las PyMEs chilenas.**

*La ciberseguridad no es tener limitaciones restringidas, sino que da libertad y mayor eficiencia de gobernanza de los datos.*
