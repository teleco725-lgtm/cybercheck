// Catálogo de auditorías de IA para CyberCheck
// Estructura: categorías → tipos de auditoría → checklist (ítems con severidad y recomendación)

export type Severity = "critico" | "alto" | "medio" | "bajo" | "informativo";
export type AuditRegion = "internacional" | "chile";
export type AuditCategory = "gobernanza" | "cumplimiento" | "riesgos" | "responsable" | "iso" | "shadow" | "legal";

export interface ChecklistItem {
  id: string;
  label: string;
  description: string;
  severity: Severity;
  recommendation: string;
}

export interface AuditType {
  id: string;
  name: string;
  shortName: string;
  region: AuditRegion;
  category: AuditCategory;
  icon: string;
  summary: string;
  framework: string;
  checklist: ChecklistItem[];
  // Preguntas que el wizard debe hacer antes de ejecutar la auditoría
  wizardQuestions: {
    id: string;
    label: string;
    type: "text" | "select" | "multiselect" | "textarea";
    placeholder?: string;
    options?: string[];
    required?: boolean;
  }[];
}

export interface AuditRegionGroup {
  id: AuditRegion;
  label: string;
  flag: string;
  description: string;
  audits: AuditType[];
}

export const AUDITS: AuditRegionGroup[] = [
  {
    id: "internacional",
    label: "Internacional",
    flag: "🌐",
    description: "Marcos globales: NIST AI RMF, ISO 42001, AI Act UE, buenas prácticas internacionales de IA responsable.",
    audits: [
      {
        id: "ai-governance",
        name: "Auditoría de Gobernanza de IA",
        shortName: "AI Governance Audit",
        region: "internacional",
        category: "gobernanza",
        icon: "Building2",
        summary: "Evalúa políticas, roles, responsabilidades y controles organizacionales sobre el ciclo de vida de sistemas de IA.",
        framework: "NIST AI RMF — Gobernar",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "orgSize", label: "Tamaño de la organización", type: "select", options: ["1-10 personas", "11-50 personas", "51-200 personas", "200+ personas"], required: true },
          { id: "aiUsage", label: "¿Qué usos de IA tiene actualmente?", type: "multiselect", options: ["Chatbots de atención", "Análisis de datos", "Automatización de procesos", "Generación de contenido", "Modelos predictivos", "Visión por computador", "Ninguno todavía"] },
          { id: "aiPolicy", label: "¿Cuenta con una política formal de IA?", type: "select", options: ["Sí, documentada y comunicada", "Sí, pero informal", "No, en planes", "No"], required: true },
        ],
        checklist: [
          { id: "gov-1", label: "Política de IA documentada", description: "Existe una política formal que define principios, alcance y prohibiciones del uso de IA en la organización.", severity: "critico", recommendation: "Redactar y aprobar formalmente una política de IA que cubra uso permitido, prohibido, supervisión y consecuencias. Comunicar a todo el personal." },
          { id: "gov-2", label: "Comité o responsable de IA designado", description: "Hay un rol formal (AI Officer, Comité de IA) con autoridad para decidir sobre adopción, riesgos y suspensiones de sistemas de IA.", severity: "alto", recommendation: "Designar formalmente un AI Governance Lead o comité multidisciplinario (TI, legal,合规, negocio) con autoridad ejecutiva." },
          { id: "gov-3", label: "Inventario de sistemas de IA", description: "Existe un registro actualizado de todos los sistemas de IA en uso: proveedor, propósito, datos que procesa, criticidad.", severity: "critico", recommendation: "Mantener un inventario vivo con campos: nombre, proveedor, propósito, datos procesados, dueño, criticidad, fecha de revisión." },
          { id: "gov-4", label: "Proceso de aprobación de nuevos sistemas", description: "Antes de adoptar una nueva herramienta de IA, existe un proceso formal de evaluación y aprobación.", severity: "alto", recommendation: "Implementar un flujo de solicitud → evaluación de riesgo → aprobación/rechazo con plazos definidos (máx 10 días hábiles)." },
          { id: "gov-5", label: "Capacitación obligatoria en IA", description: "El personal recibe formación periódica sobre uso responsable de IA, riesgos y obligaciones.", severity: "medio", recommendation: "Programar capacitación anual obligatoria con evaluación. Mantener registro de completado por empleado." },
          { id: "gov-6", label: "Mecanismo de reporte de incidentes de IA", description: "Los empleados pueden reportar comportamientos anómalos, sesgos o incidentes relacionados con IA.", severity: "alto", recommendation: "Habilitar canal de reporte (formulario + email) con SLA de respuesta de 24h para incidentes críticos." },
          { id: "gov-7", label: "Revisión periódica del programa", description: "El programa de gobernanza de IA se revisa al menos anualmente con métricas de efectividad.", severity: "medio", recommendation: "Definir KPIs (incidents/mes, % adopción política, # capacitaciones) y revisar trimestralmente con reporte al directorio." },
          { id: "gov-8", label: "Alineación con marco internacional", description: "El programa se alinea con un marco reconocido (NIST AI RMF, ISO 42001, AI Act UE).", severity: "alto", recommendation: "Adoptar NIST AI RMF como base mínima y mapear controles a ISO 42001 para certificación futura." },
        ],
      },
      {
        id: "ai-compliance",
        name: "Auditoría de Cumplimiento de IA",
        shortName: "AI Compliance Audit",
        region: "internacional",
        category: "cumplimiento",
        icon: "Scale",
        summary: "Verifica cumplimiento con AI Act UE, NIST AI RMF y otros marcos regulatorios internacionales aplicables.",
        framework: "AI Act UE + NIST AI RMF",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "euInteractions", label: "¿La organización tiene operaciones o clientes en la Unión Europea?", type: "select", options: ["Sí", "No", "No, pero planeamos expandirnos"], required: true },
          { id: "aiRiskLevel", label: "¿Cuál es el nivel de riesgo de los sistemas de IA según AI Act?", type: "select", options: ["Inaceptable (prohibido)", "Alto riesgo", "Limitado", "Mínimo riesgo", "No clasificado aún"], required: true },
          { id: "thirdCountries", label: "¿Operan en otros países fuera de Chile?", type: "multiselect", options: ["Unión Europea", "Estados Unidos", "Brasil", "Argentina", "Perú", "México", "Otros"] },
        ],
        checklist: [
          { id: "comp-1", label: "Clasificación de sistemas por nivel de riesgo", description: "Cada sistema de IA está clasificado según la taxonomía del AI Act (inaceptable, alto, limitado, mínimo).", severity: "critico", recommendation: "Mapear cada sistema del inventario a su nivel de riesgo AI Act. Suspender inmediatamente cualquier sistema clasificado como 'inaceptable'." },
          { id: "comp-2", label: "Evaluación de impacto para sistemas de alto riesgo", description: "Sistemas clasificados como alto riesgo cuentan con evaluación de impacto documentada (FRIA).", severity: "critico", recommendation: "Realizar Fundamental Rights Impact Assessment para cada sistema de alto riesgo antes de su despliegue." },
          { id: "comp-3", label: "Conformidad técnica documentada", description: "Sistemas de alto riesgo tienen documentación técnica: descripción, datos de entrenamiento, métricas de rendimiento, registro de logs.", severity: "alto", recommendation: "Solicitar al proveedor la documentación técnica exigida por Anexo IV del AI Act. Conservar por 10 años." },
          { id: "comp-4", label: "Supervisión humana efectiva", description: "Sistemas de alto riesgo cuentan con mecanismos de supervisión humana con autoridad para intervenir.", severity: "alto", recommendation: "Designar supervisores humanos entrenados, definir protocolos de override y umbrales de intervención automática." },
          { id: "comp-5", label: "Registro de eventos (logging)", description: "Los sistemas de IA registran eventos relevantes: inputs, decisiones, modificaciones, incidentes.", severity: "alto", recommendation: "Habilitar logging automático con retención mínima de 6 meses. Logs deben ser auditables y trazables al usuario." },
          { id: "comp-6", label: "Transparencia al usuario final", description: "Cuando un usuario interactúa con IA, se le notifica de manera clara.", severity: "alto", recommendation: "Mostrar aviso visible: 'Estás interactuando con un sistema de IA'. Incluir opción de contacto humano para decisiones relevantes." },
          { id: "comp-7", label: "Marcado de contenido generado por IA", description: "Contenido sintético (imágenes, audio, texto) está marcado como generado por IA.", severity: "medio", recommendation: "Implementar marcas de agua digitales y aviso visual en todo contenido generado por IA distribuido externamente." },
          { id: "comp-8", label: "Notificación de incidentes", description: "Existe un proceso para notificar incidentes graves de IA a la autoridad competente.", severity: "alto", recommendation: "Definir flujo de notificación a autoridad competente dentro de 15 días desde el incidente grave." },
        ],
      },
      {
        id: "ai-risk-assessment",
        name: "Evaluación de Riesgos de IA",
        shortName: "AI Risk Assessment",
        region: "internacional",
        category: "riesgos",
        icon: "AlertTriangle",
        summary: "Identifica y prioriza riesgos éticos, de seguridad, operacionales y reputacionales asociados al uso de IA.",
        framework: "NIST AI RMF — Medir",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "criticalSystems", label: "¿Cuáles sistemas de IA toman decisiones autónomas sin supervisión humana?", type: "textarea", placeholder: "Describe los sistemas que operan sin intervención humana directa..." },
          { id: "dataSensitivity", label: "¿Qué tipo de datos procesan los sistemas de IA?", type: "multiselect", options: ["Datos públicos", "Datos internos no sensibles", "Datos personales de clientes", "Datos financieros", "Datos de salud", "Datos de menores", "Datos biométricos"] },
          { id: "riskAppetite", label: "¿Cuál es la tolerancia al riesgo de la organización?", type: "select", options: ["Baja — evitar riesgos", "Media — mitigar y monitorear", "Alta — aceptar riesgos calculados"], required: true },
        ],
        checklist: [
          { id: "risk-1", label: "Inventario de riesgos de IA", description: "Existe un registro de riesgos identificados, con probabilidad, impacto y priorización.", severity: "critico", recommendation: "Mantener un risk register con campos: descripción, fuente (técnico/operacional/ético/legal), probabilidad, impacto, severidad, mitigación." },
          { id: "risk-2", label: "Análisis de ataques adversariales", description: "Se han evaluado vectores de ataque: prompt injection, data poisoning, model inversion, evasion.", severity: "critico", recommendation: "Realizar pentesting de IA al menos semestralmente. Incluir pruebas de prompt injection y ejemplos adversariales." },
          { id: "risk-3", label: "Evaluación de sesgos", description: "Se mide el sesgo del modelo en grupos demográficos relevantes.", severity: "alto", recommendation: "Ejecutar evaluación de fairness con métricas (demographic parity, equalized odds) en datos representativos de la población." },
          { id: "risk-4", label: "Riesgo de fuga de información por prompts", description: "Se evalúa el riesgo de que empleados filtren datos sensibles vía prompts a LLMs externos.", severity: "critico", recommendation: "Implementar DLP para prompts: bloquear patterns de RUT, tarjetas, datos de salud antes de enviar a LLM externo." },
          { id: "risk-5", label: "Dependencia de proveedor (vendor lock-in)", description: "Se evalúa el riesgo de dependencia excesiva de un proveedor de IA.", severity: "alto", recommendation: "Documentar plan de contingencia: proveedores alternativos, capacidad de migrar modelos/datos, costo de salida." },
          { id: "risk-6", label: "Continuidad del negocio ante fallos de IA", description: "Existe un plan de continuidad si los sistemas de IA fallan o se degradan.", severity: "alto", recommendation: "Definir procesos manuales de respaldo para funciones críticas que dependan de IA. Realizar drill anual." },
          { id: "risk-7", label: "Riesgos reputacionales", description: "Se evalúa el impacto reputacional de errores, sesgos o incidentes públicos de IA.", severity: "medio", recommendation: "Incluir análisis reputacional en evaluación de riesgo. Preparar plan de comunicación para incidentes." },
          { id: "risk-8", label: "Riesgo de propiedad intelectual", description: "Se evalúa el riesgo de que la IA genere contenido que infrinja derechos de terceros.", severity: "medio", recommendation: "Revisar términos de licencia del proveedor sobre ownership de outputs. Implementar filtros de similitud para outputs generados." },
        ],
      },
      {
        id: "responsible-ai",
        name: "Auditoría de Uso Responsable de IA",
        shortName: "Responsible AI Audit",
        region: "internacional",
        category: "responsable",
        icon: "HeartHandshake",
        summary: "Audita sesgos, transparencia, explicabilidad y trazabilidad de decisiones automatizadas.",
        framework: "OECD AI Principles + UNESCO Recommendation",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "affectedGroups", label: "¿Qué grupos de personas se ven afectados por las decisiones de IA?", type: "multiselect", options: ["Clientes", "Empleados", "Proveedores", "Postulantes a empleo", "Pacientes", "Estudiantes", "Público general"] },
          { id: "transparencyLevel", label: "¿Qué tan transparentes son las decisiones de IA para los afectados?", type: "select", options: ["Totalmente explicadas", "Parcialmente explicadas", "Black box — no se explican", "Depende del caso"], required: true },
        ],
        checklist: [
          { id: "res-1", label: "Explicabilidad de decisiones", description: "Las decisiones automatizadas pueden explicarse en términos comprensibles para el afectado.", severity: "critico", recommendation: "Implementar capa de explicación (XAI) con técnicas como SHAP, LIME o counterfactuals. Proveer explicación accesible al usuario." },
          { id: "res-2", label: "Derecho a revisión humana", description: "Los afectados pueden solicitar revisión humana de decisiones automatizadas que les afecten significativamente.", severity: "critico", recommendation: "Habilitar canal de apelación con respuesta en 5 días hábiles. Documentar override de la decisión si corresponde." },
          { id: "res-3", label: "Auditoría de sesgos demográficos", description: "Se analizan tasas de error/aprobación por grupo demográfico (género, edad, etnia si aplica).", severity: "alto", recommendation: "Ejecutar análisis estadístico de fairness al menos semestralmente. Documentar y corregir disparidades > 5%." },
          { id: "res-4", label: "Consentimiento informado", description: "Los usuarios saben cuándo sus datos se usan para entrenar o ejecutar IA y han consentido.", severity: "alto", recommendation: "Incluir cláusula clara en términos de servicio. Permitir opt-out del uso de datos para entrenamiento." },
          { id: "res-5", label: "Trazabilidad de decisiones", description: "Cada decisión automatizada queda registrada con input, modelo versión, output, timestamp.", severity: "alto", recommendation: "Implementar audit log inmutable para decisiones automatizadas. Retener mínimo 2 años para auditoría." },
          { id: "res-6", label: "Mecanismo de feedback", description: "Los usuarios pueden reportar errores, sesgos o problemas con las decisiones de IA.", severity: "medio", recommendation: "Habilitar botón 'Reportar problema con esta decisión' en cada output automatizado." },
          { id: "res-7", label: "Derecho al olvido", description: "Los usuarios pueden solicitar eliminación de sus datos del modelo o sistema.", severity: "medio", recommendation: "Implementar proceso de borrado que cubra: datos de entrenamiento, logs, vector stores, caches." },
        ],
      },
      {
        id: "iso-42001",
        name: "Auditoría ISO 42001",
        shortName: "Sistema de Gestión de IA",
        region: "internacional",
        category: "iso",
        icon: "Award",
        summary: "Evalúa el Sistema de Gestión de IA (AIMS) según ISO/IEC 42001:2023, adaptable a PyMEs.",
        framework: "ISO/IEC 42001:2023",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "aimsScope", label: "¿Cuál es el alcance del sistema de gestión de IA?", type: "textarea", placeholder: "Ej: Todos los sistemas de IA usados en atención al cliente..." },
          { id: "pymeSize", label: "¿La organización califica como PyME?", type: "select", options: ["Sí — microempresa (1-9)", "Sí — pequeña (10-49)", "Sí — mediana (50-200)", "No — grande (200+)"], required: true },
          { id: "certificationGoal", label: "¿Buscan certificación formal ISO 42001?", type: "select", options: ["Sí, en 12 meses", "Sí, en 24 meses", "Aún no decidido", "No, solo alineación"], required: true },
        ],
        checklist: [
          { id: "iso-1", label: "Política de IA (Cláusula 5.2)", description: "Existe una política de IA documentada, aprobada por la dirección y comunicada.", severity: "critico", recommendation: "Documentar política con: compromiso, marco de referencia, roles, controles. Revisar anualmente." },
          { id: "iso-2", label: "Roles, responsabilidades y autoridades (5.3)", description: "Están definidos formalmente los roles del AIMS: AI Officer, comité, dueños de procesos.", severity: "alto", recommendation: "Crear matriz RACI para cada proceso del AIMS. Comunicar formalmente asignaciones." },
          { id: "iso-3", label: "Planificación de objetivos de IA (6.2)", description: "Existen objetivos medibles de IA alineados a la estrategia organizacional.", severity: "alto", recommendation: "Definir 3-5 objetivos SMART anuales: ej 'reducir incidentes de IA 50%', '100% personal capacitado'." },
          { id: "iso-4", label: "Evaluación de riesgos y oportunidades (6.1)", description: "Proceso formal de identificación, análisis y tratamiento de riesgos de IA.", severity: "critico", recommendation: "Adoptar metodología ISO 31000 adaptada a IA. Mantener risk register vivo." },
          { id: "iso-5", label: "Soporte y recursos (Cláusula 7)", description: "Se asignan recursos, competencia y conciencia adecuados al AIMS.", severity: "alto", recommendation: "Presupuestar anualmente capacitación, herramientas, auditorías externas. Mínimo 0.5% del budget TI." },
          { id: "iso-6", label: "Operación (Cláusula 8)", description: "Procesos de diseño, desarrollo, despliegue y monitoreo de IA están definidos.", severity: "alto", recommendation: "Documentar SDLC para IA: requisitos, datos, entrenamiento, validación, despliegue, monitoreo, retiro." },
          { id: "iso-7", label: "Evaluación del desempeño (Cláusula 9)", description: "Se monitorea, mide, analiza y evalúa el desempeño del AIMS.", severity: "alto", recommendation: "Definir KPIs: # incidentes, % cumplimiento, # auditorías, tiempo de respuesta a incidentes. Revisión mensual." },
          { id: "iso-8", label: "Mejora continua (Cláusula 10)", description: "Existen no conformidades, acciones correctivas y lecciones aprendidas documentadas.", severity: "medio", recommendation: "Implementar sistema de no conformidades con CAPA (Corrective and Preventive Action) y revisión trimestral." },
        ],
      },
      {
        id: "shadow-ai",
        name: "Auditoría de Shadow AI",
        shortName: "Shadow AI / AI Usage Audit",
        region: "internacional",
        category: "shadow",
        icon: "Eye",
        summary: "Detecta y gestiona el uso no autorizado de IA por empleados (ChatGPT, Claude, Gemini, Copilot, etc.).",
        framework: "SANS + NIST CSF adaptado a IA",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "employeeCount", label: "Número de empleados", type: "text", placeholder: "25", required: true },
          { id: "knownUsage", label: "¿Qué herramientas de IA sabes que usan los empleados?", type: "multiselect", options: ["ChatGPT (OpenAI)", "Claude (Anthropic)", "Gemini (Google)", "Copilot (Microsoft)", "Perplexity", "Cursor", "GitHub Copilot", "Midjourney", "No sabemos"] },
          { id: "dlpSolution", label: "¿Cuentan con solución DLP (Data Loss Prevention)?", type: "select", options: ["Sí, implementada", "Parcial — algunos controles", "No, pero planeamos", "No"], required: true },
        ],
        checklist: [
          { id: "sh-1", label: "Detección de uso de IA externa", description: "Existen controles técnicos para detectar accesos a servicios de IA externos (ChatGPT, Claude, Gemini, etc.).", severity: "critico", recommendation: "Implementar monitoreo de DNS/proxy para dominios de IA: openai.com, anthropic.com, gemini.google.com. Analizar logs semanalmente." },
          { id: "sh-2", label: "Política de uso aceptable de IA", description: "Hay una política clara sobre qué herramientas de IA están aprobadas y cuáles prohibidas.", severity: "critico", recommendation: "Publicar lista blanca/negra de herramientas. Definir qué datos pueden y no pueden enviarse a IA externa." },
          { id: "sh-3", label: "Bloqueo de IA no autorizada", description: "Firewall/proxy bloquea acceso a servicios de IA no aprobados.", severity: "alto", recommendation: "Configurar reglas de firewall/proxy para bloquear dominios no aprobados. Proveer alternativa corporativa aprobada." },
          { id: "sh-4", label: "Solución de IA corporativa aprobada", description: "Se ofrece una herramienta de IA oficial con controles (logging, DLP, autenticación).", severity: "alto", recommendation: "Implementar Microsoft Copilot for M365, ChatGPT Enterprise o Claude for Work. Configurar SSO, logging y DLP." },
          { id: "sh-5", label: "Capacitación sobre riesgos de Shadow AI", description: "Los empleados reciben capacitación sobre riesgos: fugas de datos, IP, cumplimiento.", severity: "alto", recommendation: "Capacitación obligatoria al onboarding + refresh anual. Casos reales: Samsung, Amazon que filtraron datos por ChatGPT." },
          { id: "sh-6", label: "Monitoreo de prompts sensibles", description: "Se monitorea/detecta cuando se envían datos sensibles (RUT, datos financieros, salud) a LLMs.", severity: "critico", recommendation: "Implementar DLP con patterns chilenos: RUT, tarjeta Chile, datos de salud. Bloquear antes de enviar." },
          { id: "sh-7", label: "Análisis de logs de navegación", description: "Se analizan logs web/proxy para identificar patrones de uso no autorizado.", severity: "alto", recommendation: "Revisar mensualmente logs de proxy. Alertar sobre accesos a IA no aprobada desde cuentas corporativas." },
          { id: "sh-8", label: "Proceso de sanción y excepciones", description: "Existen consecuencias por uso no autorizado y proceso para solicitar excepciones.", severity: "medio", recommendation: "Definir escala de sanciones (verbal → escrito → despido). Proceso de excepción con aprobación de TI+Compliance." },
        ],
      },
    ],
  },
  {
    id: "chile",
    label: "Nacional — Chile",
    flag: "🇨🇱",
    description: "Marco legal chileno aplicado a IA: Ley 19.628 (datos personales), Ley 21.459 (delitos informáticos actualizada), Ley 19.223.",
    audits: [
      {
        id: "ley-19628-ia",
        name: "Auditoría Ley 19.628 aplicada a IA",
        shortName: "Ley 19.628 + IA",
        region: "chile",
        category: "legal",
        icon: "FileText",
        summary: "Verifica cumplimiento de la Ley 19.628 (Protección de Datos Personales) cuando IA procesa datos personales.",
        framework: "Ley 19.628 + Reglamento Ley 19.628",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización (tratante de datos)", type: "text", placeholder: "Acme SpA", required: true },
          { id: "dataTypes", label: "¿Qué tipo de datos personales procesan los sistemas de IA?", type: "multiselect", options: ["Identificadores (RUT, nombre)", "Datos de contacto", "Datos financieros", "Datos de salud", "Datos sensibles (Art. 2 N°9)", "Datos de menores", "No procesan datos personales"] },
          { id: "consentMechanism", label: "¿Cómo obtienen el consentimiento para procesar datos con IA?", type: "select", options: ["Consentimiento expreso escrito", "Consentimiento expreso digital", "Consentimiento tácito", "No solicitan consentimiento", "No aplica"], required: true },
          { id: "cad", label: "¿Están registrados en el Registro de Bases de Datos del SAG?", type: "select", options: ["Sí, al día", "Registrados pero desactualizados", "No registrados", "No estamos obligados"], required: true },
        ],
        checklist: [
          { id: "l19628-1", label: "Base legal para procesamiento con IA", description: "Cada uso de IA que procesa datos personales tiene una base legal válida (consentimiento, contrato, obligación legal).", severity: "critico", recommendation: "Documentar base legal para cada sistema de IA. Para datos sensibles, consentimiento expreso es obligatorio (Art. 4)." },
          { id: "l19628-2", label: "Consentimiento informado para IA", description: "El consentimiento menciona explícitamente el uso de IA y sus implicancias.", severity: "critico", recommendation: "Actualizar consentimientos: 'Sus datos serán procesados mediante sistemas de inteligencia artificial para [finalidad]'. Permitir revocación fácil." },
          { id: "l19628-3", label: "Finalidad específica y determinada", description: "Los datos usados por IA tienen una finalidad específica, no se reutilizan para otros fines.", severity: "alto", recommendation: "Mapear cada sistema de IA a una finalidad documentada. Bloquear reutilización para fines nuevos sin nuevo consentimiento." },
          { id: "l19628-4", label: "Información al titular (Art. 12)", description: "Los titulares pueden saber si sus datos son procesados por sistemas automatizados de IA.", severity: "alto", recommendation: "Habilitar canal de consulta (web/email). Responder en 5 días hábiles indicando: finalidad, base legal, destinatarios." },
          { id: "l19628-5", label: "Derechos ARCO ante IA", description: "El titular puede ejercer acceso, rectificación, cancelación y oposición sobre datos procesados por IA.", severity: "alto", recommendation: "Habilitar formulario de ejercicio de derechos. Responder en 5 días hábiles. Incluir derecho a no ser objeto de decisiones automatizadas." },
          { id: "l19628-6", label: "Decisiones automatizadas con impacto significativo", description: "Decisiones automatizadas que afectan al titular significativamente requieren consentimiento expreso o base legal específica.", severity: "critico", recommendation: "Identificar decisiones automatizadas con impacto (crédito, empleo, salud). Implementar revisión humana y derecho a explicación." },
          { id: "l19628-7", label: "Medidas de seguridad técnicas (Art. 15)", description: "Se aplican medidas técnicas apropiadas al riesgo: cifrado, control acceso, logs, backups.", severity: "alto", recommendation: "Cifrar datos en tránsito y reposo. Control de acceso por rol. Logs de acceso a datos personales. Backups cifrados." },
          { id: "l19628-8", label: "Notificación de brechas de seguridad", description: "Existe proceso para notificar brechas que afecten datos personales al titular y al SAG.", severity: "critico", recommendation: "Notificar al SAG dentro de 72h. Comunicar a titulares descripción, consecuencias, medidas tomadas." },
          { id: "l19628-9", label: "Encargado de tratamiento designado", description: "Hay una persona responsable del cumplimiento de la Ley 19.628 en la organización.", severity: "medio", recommendation: "Designar formalmente un Encargado de Protección de Datos (DPO). Reportar directamente a dirección." },
          { id: "l19628-10", label: "Contratos con encargados externos", description: "Contratos con proveedores de IA que procesan datos incluyen cláusulas de protección de datos.", severity: "alto", recommendation: "Incluir cláusulas: finalidad, medidas de seguridad, confidencialidad, subcontratación, devolución/destrucción." },
        ],
      },
      {
        id: "ley-19223-ia",
        name: "Auditoría Ley 19.223 aplicada a IA",
        shortName: "Ley 19.223 + IA",
        region: "chile",
        category: "legal",
        icon: "Gavel",
        summary: "Audita delitos informáticos tipificados en Ley 19.223 en el contexto de sistemas de IA vulnerados o abusados.",
        framework: "Ley 19.223 (Delitos Informáticos)",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "incidents", label: "¿Han sufrido incidentes de seguridad relacionados con sistemas de IA?", type: "select", options: ["Sí, múltiples", "Sí, al menos uno", "No, pero preocupados", "No"], required: true },
          { id: "incidentResponse", label: "¿Cuentan con plan de respuesta a incidentes?", type: "select", options: ["Sí, documentado y probado", "Sí, documentado", "No, pero en planes", "No"], required: true },
        ],
        checklist: [
          { id: "l19223-1", label: "Protección contra sabotaje de IA (Art. 1)", description: "Existen controles para prevenir la alteración, daño o destrucción maliciosa de sistemas de IA.", severity: "alto", recommendation: "Implementar controles: control de acceso, integrity checks, backups, monitoreo de cambios en modelos." },
          { id: "l19223-2", label: "Prevención de acceso ilícito (Art. 2)", description: "Controles para prevenir acceso no autorizado a sistemas de IA y sus datos de entrenamiento.", severity: "critico", recommendation: "Segmentar red, MFA para acceso a modelos/datasets, logs de acceso, alertas de intentos fallidos." },
          { id: "l19223-3", label: "Detección de intrusión en pipelines de IA", description: "Se monitorea el pipeline de entrenamiento y despliegue de IA para detectar accesos ilícitos.", severity: "alto", recommendation: "Implementar SIEM con reglas para pipelines de ML. Monitorear commits, deployments, accesos a datasets." },
          { id: "l19223-4", label: "Capacitación sobre delitos informáticos", description: "El personal conoce qué constituye un delito informático según Ley 19.223 y cómo reportar.", severity: "medio", recommendation: "Incluir Ley 19.223 en capacitación de ciberseguridad. Definir qué hacer ante sospecha de delito." },
          { id: "l19223-5", label: "Proceso de denuncia a Fiscalía", description: "Existe proceso para denunciar incidentes que constituyan delito a la Fiscalía correspondiente.", severity: "alto", recommendation: "Documentar flujo: contención, evidencia, denuncia a Fiscalía dentro de 24h. Coordinar con asesor legal." },
          { id: "l19223-6", label: "Preservación de evidencia digital", description: "Existen procedimientos para preservar evidencia ante incidentes que puedan constituir delito.", severity: "alto", recommendation: "Capacitar a equipo IR en chain of custody. Usar herramientas de forense digital. Documentar cada paso." },
          { id: "l19223-7", label: "Casos específicos de IA: data poisoning", description: "Se reconoce el data poisoning como potencial delito y se previene.", severity: "medio", recommendation: "Implementar validación de datos de entrenamiento: fuentes, integridad, datos sintéticos detectados." },
        ],
      },
      {
        id: "ley-21459-ia",
        name: "Auditoría Ley 21.459 aplicada a IA",
        shortName: "Ley 21.459 + IA",
        region: "chile",
        category: "legal",
        icon: "Shield",
        summary: "Audita delitos informáticos según marco actualizado Ley 21.459 (moderniza Ley 19.223) en contexto de IA.",
        framework: "Ley 21.459 (moderniza delitos informáticos)",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "criticalSystems", label: "¿Cuáles son sus sistemas de IA más críticos?", type: "textarea", placeholder: "Ej: Chatbot de atención al cliente, sistema de scoring crediticio..." },
          { id: "pdiCoordination", label: "¿Tienen coordinación con Brigada del Cibercrimen de la PDI?", type: "select", options: ["Sí, contacto formal", "Sí, pero informal", "No, pero queremos", "No"], required: true },
        ],
        checklist: [
          { id: "l21459-1", label: "Protección de ataques a la disponibilidad (Art. 1)", description: "Controles contra DoS/DDoS específicos a APIs de IA y endpoints de inferencia.", severity: "alto", recommendation: "Implementar rate limiting, WAF, DDoS protection. Definir umbrales y respuestas automáticas." },
          { id: "l21459-2", label: "Prevención de suplantación de identidad mediante IA", description: "Controles contra deepfakes y suplantación mediante IA generativa.", severity: "critico", recommendation: "Implementar verificación biométrica robusta. Capacitar personal en detección de deepfakes. Tener protocolo de respuesta a deepfakes que suplanten a directivos." },
          { id: "l21459-3", label: "Protección contra fraude asistido por IA", description: "Controles para detectar fraude que use IA (phishing generado por LLM, vishing con deepfake).", severity: "critico", recommendation: "Implementar detección de phishing con LLM (análisis lingüístico, similitud con patrones). Capacitar en ejemplos modernos." },
          { id: "l21459-4", label: "Detección de intrusión en sistemas de IA", description: "Sistemas de detección de intrusos (IDS/IPS) cubren infraestructura de IA.", severity: "alto", recommendation: "Extender cobertura IDS/IPS a servidores de inferencia, pipelines, datasets. Reglas específicas para OWASP ML Top 10." },
          { id: "l21459-5", label: "Coordinación con Brigada del Cibercrimen PDI", description: "Existe contacto formal con la Brigada del Cibercrimen de la PDI para denuncia y colaboración.", severity: "alto", recommendation: "Establecer contacto formal con Brigada del Cibercrimen. Conocer canales de denuncia y requisitos de evidencia." },
          { id: "l21459-6", label: "Plan de respuesta a deepfakes", description: "Existe protocolo específico de respuesta ante deepfakes que afecten a la organización o directivos.", severity: "alto", recommendation: "Documentar protocolo: detección, contención (redes sociales, prensa), comunicación, denuncia." },
          { id: "l21459-7", label: "Evidencia para proceso penal moderno", description: "Procedimientos de preservación de evidencia cumplen requisitos de Ley 21.459.", severity: "alto", recommendation: "Actualizar procedimientos de forense según estándares modernos. Capacitar equipo en evidencia de sistemas de IA." },
        ],
      },
      {
        id: "marco-ia-chile",
        name: "Auditoría Marco Regulatorio IA Chile",
        shortName: "Marco IA Chile (placeholder)",
        region: "chile",
        category: "legal",
        icon: "Flag",
        summary: "Evaluación preparatoria ante eventual regulación específica de IA en Chile (en discusión legislativa).",
        framework: "Proyectos en tramitación + soft law",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "monitoring", label: "¿Monitorean avances legislativos en IA en Chile?", type: "select", options: ["Sí, activamente", "Ocasionalmente", "No, pero queremos", "No"], required: true },
          { id: "readiness", label: "¿Qué tan preparados están para una regulación tipo AI Act?", type: "select", options: ["Muy preparados", "Parcialmente preparados", "Poco preparados", "Para nada preparados"], required: true },
        ],
        checklist: [
          { id: "marco-1", label: "Monitoreo legislativo activo", description: "Existe seguimiento sistemático de proyectos de ley sobre IA en Chile.", severity: "medio", recommendation: "Suscribir a alertas del Congreso (Boletín de Tramitación). Revisar mensualmente estado de proyectos sobre IA." },
          { id: "marco-2", label: "Adopción anticipada de principios internacionales", description: "Aunque no haya ley chilena, se adoptan principios NIST AI RMF, OECD, UNESCO.", severity: "alto", recommendation: "Mapear controles actuales a NIST AI RMF. Documentar gaps. Implementar de forma gradual." },
          { id: "marco-3", label: "Autoevaluación según borradores en discusión", description: "Se evalúa cumplimiento con proyectos de ley en tramitación (boletines sobre IA).", severity: "medio", recommendation: "Realizar gap analysis anual contra proyectos en discusión. Priorizar controles de alto riesgo." },
          { id: "marco-4", label: "Participación en consultas públicas", description: "La organización participa en consultas públicas sobre IA.", severity: "bajo", recommendation: "Designar representante para consultas del Ministerio de Ciencia, SAG, Congreso." },
          { id: "marco-5", label: "Preparación para registro nacional de IA", description: "Si se crea registro nacional de sistemas de IA, la organización podría inscribirse.", severity: "medio", recommendation: "Mantener inventario actualizado de sistemas de IA. Documentar evidencias de cumplimiento para eventual registro." },
          { id: "marco-6", label: "Coordinación con gremios y asociaciones", description: "La organización participa en gremios que discuten regulación de IA.", severity: "informativo", recommendation: "Asociarse a ASACh, ACTI, ANINF. Participar en comités de IA." },
        ],
      },
      {
        id: "ley-redes-sociales",
        name: "Auditoría de Cumplimiento Ley de Redes Sociales",
        shortName: "Ley Redes Sociales + IA",
        region: "chile",
        category: "legal",
        icon: "Share2",
        summary: "Audita el cumplimiento de la organización con la eventual Ley de Redes Sociales en Chile: protección de menores, contenido dañino, transparencia algorítmica, publicidad dirigida y gestión de cuentas corporativas en plataformas sociales.",
        framework: "Proyectos en tramitación + DSA UE + Ley 27.675 Argentina (referentes)",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "socialPlatforms", label: "¿En qué plataformas sociales tiene presencia corporativa?", type: "multiselect", options: ["Facebook", "Instagram", "TikTok", "X (Twitter)", "LinkedIn", "YouTube", "WhatsApp Business", "Telegram corporativo", "No tenemos presencia"] },
          { id: "socialPurpose", label: "¿Para qué usan las redes sociales?", type: "multiselect", options: ["Marketing / marca", "Atención al cliente", "Venta directa", "Soporte post-venta", "Comunicación interna", "Reclutamiento", "No las usamos activamente"] },
          { id: "audienceMinors", label: "¿Su audiencia incluye menores de 14 años?", type: "select", options: ["Sí, principalmente", "Sí, parcialmente", "No, pero podría pasar", "No, audiencia 100% adulta"], required: true },
          { id: "socialAds", label: "¿Realizan publicidad pagada en redes sociales?", type: "select", options: ["Sí, frecuentemente", "Sí, ocasionalmente", "No, pero planeamos", "No"], required: true },
          { id: "socialManager", label: "¿Quién gestiona las redes sociales?", type: "select", options: ["Equipo interno dedicado", "Una persona internamente", "Agencia externa", "Freelance / community manager", "Mixto", "No hay gestor formal"], required: true },
        ],
        checklist: [
          { id: "rs-1", label: "Política formal de uso de redes sociales", description: "Existe una política documentada que regula cómo la organización usa redes sociales: cuentas oficiales, vocería, contenido permitido/prohibido, aprobaciones.", severity: "critico", recommendation: "Documentar y aprobar formalmente una política de redes sociales. Inventario de cuentas oficiales por plataforma con responsables. Prohibir cuentas no autorizadas que usen la marca." },
          { id: "rs-2", label: "Protección de menores en redes sociales", description: "Existen controles para evitar que contenido inapropiado llegue a menores de 14 años: verificación de edad, filtrado de audiencia, contenido restringido.", severity: "critico", recommendation: "Configurar segmentación de anuncios excluyendo menores. No publicar contenido +14 sin restricción. Implementar verificación de edad cuando se soliciten datos." },
          { id: "rs-3", label: "Gestión de contenido dañino y discurso de odio", description: "Existen protocolos para evitar, detectar y eliminar contenido dañino publicado por la organización o en sus comunidades.", severity: "critico", recommendation: "Definir lineamientos de contenido. Moderación activa de comentarios. Capacidad de eliminar contenido en <24h. Capacitar a community managers en detección de discurso de odio." },
          { id: "rs-4", label: "Transparencia algorítmica y contenido recomendado", description: "Cuando se usa IA para personalizar contenido o anuncios en redes, se documenta qué datos se usan y cómo.", severity: "alto", recommendation: "Documentar lógica de segmentación: datos demográficos, comportamiento, intereses. No usar datos sensibles (salud, orientación, religión) para segmentación. Mostrar aviso de personalización." },
          { id: "rs-5", label: "Publicidad dirigida a menores", description: "No se realizan anuncios dirigidos a menores de 14 años con datos personales sin consentimiento parental.", severity: "critico", recommendation: "Configurar exclusiones de edad en Meta Ads, TikTok Ads, Google Ads. Revisar segmentaciones mensualmente. Documentar exclusiones." },
          { id: "rs-6", label: "Verificación de edad de seguidores/clientes", description: "Cuando la organización ofrece productos/servicios restringidos por edad, verifica la edad en redes y canales digitales.", severity: "alto", recommendation: "Implementar verificación de edad (cédula, servicio tercerizado). Bloquear acceso a contenido restringido. Registrar verificaciones por 2 años." },
          { id: "rs-7", label: "Consentimiento para datos personales en redes", description: "Cuando se recogen datos personales vía redes sociales (formularios, concursos, mensajería), se obtiene consentimiento informado.", severity: "alto", recommendation: "Incluir cláusula de privacidad en cada formulario/landing. Mencionar finalidad, datos recogidos, destinatarios. Permitir opt-out fácil. Aplicable también a Ley 19.628." },
          { id: "rs-8", label: "Publicidad encubierta y patrocinios", description: "Cuando se publica contenido patrocinado o con influencers, se identifica claramente como publicidad (#Publicidad, #Ad, #Sponsor).", severity: "alto", recommendation: "Capacitar a influencers y community managers en uso de hashtags obligatorios. Cláusulas contractuales que exijan identificación. Monitorear cumplimiento mensual." },
          { id: "rs-9", label: "Protocolo de respuesta a incidentes en redes", description: "Existen protocolos para responder a: hackeo de cuentas, contenido viral negativo, suplantación de marca, acoso en comunidades.", severity: "alto", recommendation: "Documentar protocolo por tipo de incidente con SLA (crítico <2h, alto <8h). Contacto con plataformas (Meta Partner Support, TikTok Business). Plan de comunicación de crisis." },
          { id: "rs-10", label: "Derecho al olvido y eliminación de contenido", description: "Los usuarios pueden solicitar eliminación de su contenido o datos personales publicados en las cuentas corporativas.", severity: "medio", recommendation: "Habilitar canal de solicitud (formulario + email). Responder en 5 días hábiles. Eliminar también de caches, backups según retención." },
          { id: "rs-11", label: "Moderación de comentarios y bots", description: "Cuando se usan bots o IA para moderar comentarios, se documenta el criterio y se permite apelación humana.", severity: "medio", recommendation: "Documentar criterios de moderación (palabras bloqueadas, reglas). Permitir apelación a humano dentro de 48h. No usar moderación que discrimine por opinión política, género, etnia." },
          { id: "rs-12", label: "Métricas y reporte de cumplimiento", description: "Se reportan métricas de cumplimiento de redes sociales: incidentes, tiempo de respuesta, quejas de usuarios, contenido eliminado.", severity: "medio", recommendation: "Dashboard mensual con: # incidentes, # contenido eliminado, # quejas de menores, SLA cumplimiento. Reportar a dirección trimestralmente." },
        ],
      },
      {
        id: "ley-21663-ciberseguridad",
        name: "Auditoría Ley 21.663 Marco Nacional de Ciberseguridad",
        shortName: "Ley 21.663 + IA",
        region: "chile",
        category: "legal",
        icon: "ShieldAlert",
        summary: "Audita el cumplimiento del Marco Nacional de Ciberseguridad (Ley 21.663 de 2024): gobernanza, notificación de incidentes, CERT/CSIRT, infraestructura crítica y continuidad operativa, integrando sistemas de IA.",
        framework: "Ley 21.663 (Marco Nacional de Ciberseguridad, 2024) + Política Nacional de Ciberseguridad",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "orgSector", label: "Sector de la organización", type: "select", options: ["Salud", "Banca/Financiero", "Energía/Servicios básicos", "Telecomunicaciones", "Gobierno/Servicio público", "Transporte/Logística", "Retail/Comercio", "Educación", "Otros — no crítico"], required: true },
          { id: "orgCriticality", label: "¿La organización califica como operador de infraestructura crítica?", type: "select", options: ["Sí, declarado formalmente", "Sí, pero no formalizado", "No, pero interactuamos con ellos", "No"], required: true },
          { id: "incidentHistory", label: "¿Han sufrido incidentes de ciberseguridad en los últimos 12 meses?", type: "select", options: ["Sí, múltiples (>3)", "Sí, al menos uno", "Sospechas pero sin confirmación", "No"], required: true },
          { id: "csirtCoordination", label: "¿Conocen o coordinan con el CSIRT nacional (ANID/Gobierno)?", type: "select", options: ["Sí, contacto formal", "Sí, conocemos pero sin contacto", "No, pero queremos", "No"], required: true },
        ],
        checklist: [
          { id: "l21663-1", label: "Estrategia de ciberseguridad documentada", description: "Existe una estrategia formal de ciberseguridad aprobada por la dirección, con objetivos, alcance, responsables y métricas.", severity: "critico", recommendation: "Documentar estrategia con horizonte 3 años. Alinear con Política Nacional de Ciberseguridad. Aprobar en directorio y comunicar a toda la organización." },
          { id: "l21663-2", label: "Designación de CISO (Chief Information Security Officer)", description: "Hay un CISO formalmente designado con autoridad, presupuesto y reporte directo a la dirección.", severity: "critico", recommendation: "Designar formalmente CISO por escrito. Definir reporte a CEO/directorio. Presupuesto mínimo 0.5-1% del budget TI." },
          { id: "l21663-3", label: "Notificación de incidentes graves a autoridad", description: "Existen procesos para notificar incidentes de ciberseguridad graves a la autoridad competente (CSIRT nacional cuando aplique).", severity: "critico", recommendation: "Documentar flujo de notificación. Plazo objetivo: 72h desde la detección. Incluir plantilla con alcance, impacto, medidas. Mantener canal directo con CSIRT nacional." },
          { id: "l21663-4", label: "Plan de respuesta a incidentes (IR Plan)", description: "Existe un plan formal documentado y probado de respuesta a incidentes de ciberseguridad.", severity: "alto", recommendation: "Plan documentado con: clasificación de severidades, equipo IR, contactos, playbooks por tipo (ransomware, fuga datos, DDoS, IA envenenada). Realizar tabletop exercise anual." },
          { id: "l21663-5", label: "Continuidad operativa ante incidentes cibernéticos", description: "Existe BCP/DRP que cubre escenarios de ciberataque (no solo desastres naturales).", severity: "alto", recommendation: "Extender BCP existente a escenarios cibernéticos: ransomware total, fuga de credenciales, compromiso de IA. Drill semestral con métricas de RTO/RPO." },
          { id: "l21663-6", label: "Gestión de vulnerabilidades", description: "Existe un programa formal de gestión de vulnerabilidades: escaneos, pentesting, gestión de parches.", severity: "alto", recommendation: "Escaneo semanal de activos externos/internos. Pentest anual por tercero independiente. SLA parcheado: crítico 7 días, alto 30 días, medio 90 días." },
          { id: "l21663-7", label: "Higiene de ciberseguridad básica (CIS Controls)", description: "Implementación de controles básicos tipo CIS Top 18: inventario de activos, control de acceso, MFA, hardening.", severity: "critico", recommendation: "Implementar CIS Top 18 IG1 (basic) mínimo. MFA en todos los accesos remotos. Inventario de activos + software. Backups 3-2-1 con prueba de restauración." },
          { id: "l21663-8", label: "Coordinación con CSIRT nacional (ANID/Gobierno)", description: "Hay contacto formal con el CSIRT nacional y se participa en ejercicios sectoriales cuando aplique.", severity: "alto", recommendation: "Establecer contacto formal con CSIRT nacional (gov.cl/ciberseguridad). Suscribir a alertas. Participar en ejercicios sectoriales. Reportar incidentes graves." },
          { id: "l21663-9", label: "Protección de infraestructura crítica nacional", description: "Si la organización es operador de infraestructura crítica, aplica controles reforzados y reporta al regulador.", severity: "critico", recommendation: "Identificar formalmente si califica como operador crítico (Ley 21.663 art. 4-5). Aplicar controles CIS IG3. Coordinar con ministerio sectorial." },
          { id: "l21663-10", label: "Auditoría de ciberseguridad periódica", description: "Se realizan auditorías de ciberseguridad al menos anuales, internas o externas.", severity: "medio", recommendation: "Auditoría anual externa (tercero independiente) + trimestral interna. Cerrar no conformidades en 90 días. Mantener evidencia de seguimiento." },
          { id: "l21663-11", label: "Capacitación obligatoria en ciberseguridad", description: "El personal recibe capacitación anual obligatoria en ciberseguridad: phishing, contraseñas, manejo de datos.", severity: "alto", recommendation: "Capacitación anual obligatoria con evaluación. Simulacros de phishing trimestrales con métricas por área. Onboarding incluye módulo ciberseguridad." },
          { id: "l21663-12", label: "Ciberseguridad en sistemas de IA", description: "Los sistemas de IA reciben controles específicos de ciberseguridad: protección del modelo, datos de entrenamiento, APIs.", severity: "alto", recommendation: "Extender IR Plan a incidentes de IA (data poisoning, prompt injection, model theft). MFA y logging en APIs de IA. Backups de modelos y datasets." },
        ],
      },
      {
        id: "ley-21713-delitos-economicos",
        name: "Auditoría Ley 21.713 Delitos Económicos",
        shortName: "Ley 21.713 + IA",
        region: "chile",
        category: "legal",
        icon: "Briefcase",
        summary: "Audita el cumplimiento del modelo de prevención de delitos ampliado por Ley 21.713 (lavado de activos, cohecho, malversación, negociación incompatible) extendido al uso de IA en procesos financieros.",
        framework: "Ley 21.713 + Ley 20.393 (Responsabilidad Penal Empresarial) + UAF Chile",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "orgSector", label: "Sector de la organización", type: "select", options: ["Banca/Financiero", "Criptoactivos", "Inmobiliario", "Retail/Comercio", "Servicios profesionales", "Minería", "Importación/Exportación", "Otros"], required: true },
          { id: "transactionsVolume", label: "Volumen mensual de transacciones (USD equivalente)", type: "select", options: ["< $10K (bajo)", "$10K - $100K", "$100K - $1M", "$1M - $10M", "> $10M (alto)"], required: true },
          { id: "complianceProgram", label: "¿Tienen modelo de prevención de delitos (Ley 20.393) formalizado?", type: "select", options: ["Sí, certificado", "Sí, documentado", "En implementación", "No"], required: true },
          { id: "aiInFinance", label: "¿Usan IA en procesos financieros o decisiones comerciales?", type: "multiselect", options: ["Scoring crediticio", "Detección de fraude", "Automatización contable", "Análisis de transacciones", "Aprobación de proveedores", "No usamos IA en finanzas"] },
        ],
        checklist: [
          { id: "l21713-1", label: "Modelo de prevención de delitos (Ley 20.393 ampliado)", description: "Existe un modelo formal de prevención de delitos que cubre los nuevos delitos de la Ley 21.713.", severity: "critico", recommendation: "Actualizar modelo Ley 20.393 para incluir: lavado de activos ampliado, cohecho internacional, malversación, negociación incompatible, fraude al mercado. Re-certificar formalmente." },
          { id: "l21713-2", label: "Comité de cumplimiento y prevención", description: "Hay un comité formal con representación de dirección, legal, finanzas y compliance.", severity: "critico", recommendation: "Comité con monthly meeting formal. Minutas. Reporte trimestral a directorio. Encargado de prevención designado formalmente." },
          { id: "l21713-3", label: "Evaluación de riesgo de lavado de activos", description: "Se realiza evaluación formal de riesgo de lavado de activos con metodología UAF (Unidad de Análisis Financiero).", severity: "critico", recommendation: "Matriz de riesgo UAF adaptada al sector. Evaluación anual. Identificar productos/servicios de alto riesgo. Documentar mitigaciones." },
          { id: "l21713-4", label: "Debida diligencia de terceros (KYC, KYB)", description: "Existen procesos de due diligence para clientes, proveedores y socios estratégicos.", severity: "alto", recommendation: "Proceso KYC/KYB con niveles de riesgo. Listas restrictivas (OFAC, UE, ONU). Para alto riesgo, due diligence reforzada con UBO y fuente de fondos." },
          { id: "l21713-5", label: "Reporte de operaciones sospechosas (ROS) a UAF", description: "Existen procesos para detectar y reportar operaciones sospechosas a la UAF dentro de plazos legales.", severity: "critico", recommendation: "Proceso formal de detección de ROS. Plazo: 3 días hábiles desde detección. Capacitar a oficiales de cumplimiento. Reportar a UAF vía sistema oficial." },
          { id: "l21713-6", label: "Canal de denuncias (whistleblowing)", description: "Existe canal de denuncia anónima y protegida para empleados y terceros.", severity: "critico", recommendation: "Plataforma externa (Confid Line, etc.) que permita denuncia anónima. SLA de respuesta: 7 días. Protección al denunciante. Reportar a dirección." },
          { id: "l21713-7", label: "Política de regalos, hospitalidad y conflictos de interés", description: "Existen políticas claras sobre regalos, hospitalidad y manejo de conflictos de interés.", severity: "alto", recommendation: "Política documentada con umbrales (ej: regalos <$50 OK, >$50 requieren aprobación). Registro público de conflictos de interés del directorio y ejecutivos." },
          { id: "l21713-8", label: "Capacitación obligatoria en prevención de delitos", description: "El personal recibe capacitación anual sobre los delitos tipificados en Ley 21.713 y Ley 20.393.", severity: "alto", recommendation: "Capacitación anual obligatoria con evaluación. Casos prácticos del sector. Refresh para personal de alto riesgo (finanzas, procurement, ventas)." },
          { id: "l21713-9", label: "Riesgo de IA en lavado de activos", description: "Cuando se usa IA para scoring crediticio, fraude o análisis transaccional, se evalúa el riesgo de uso malicioso.", severity: "alto", recommendation: "Auditar bias y robustez del modelo. Logs inmutables de decisiones de IA. Probar adversarialmente con casos de lavado sintéticos. Aprobación humana en operaciones > $10K." },
          { id: "l21713-10", label: "Auditoría interna y externa del modelo", description: "El modelo de prevención se audita al menos anualmente por tercero independiente.", severity: "alto", recommendation: "Auditoría externa anual (Big4 o firma especializada). Auditoría interna semestral. Cerrar gaps en 90 días. Re-certificar el modelo." },
          { id: "l21713-11", label: "Trazabilidad de decisiones automatizadas", description: "Las decisiones automatizadas relevantes (crédito, proveedores, transacciones) quedan registradas y trazables para auditoría.", severity: "medio", recommendation: "Audit log inmutable con: input, modelo v, output, timestamp, usuario. Retención mínima 5 años. Capacidad de exportar a UAF en formato requerido." },
        ],
      },
      {
        id: "sernac-comercio-electronico",
        name: "Auditoría SERNAC Protección Consumidor Comercio Electrónico",
        shortName: "SERNAC + E-commerce + IA",
        region: "chile",
        category: "legal",
        icon: "ShoppingCart",
        summary: "Audita el cumplimiento de la Ley 19.496 (Derechos del Consumidor) y la Ley 21.398 (SERNAC moderno) en operaciones de comercio electrónico, incluyendo el uso de IA para recomendaciones, precios dinámicos y atención al cliente.",
        framework: "Ley 19.496 + Ley 21.398 (SERNAC moderno) + Reglamento Comercio Electrónico",
        wizardQuestions: [
          { id: "orgName", label: "Nombre de la organización", type: "text", placeholder: "Acme SpA", required: true },
          { id: "ecommerceActivity", label: "¿Qué actividades de comercio electrónico realizan?", type: "multiselect", options: ["Venta directa online (sitio propio)", "Marketplace (terceros)", "App móvil", "Redes sociales (Instagram, WhatsApp)", "Suscripciones recurrentes", "Servicios digitales", "No vendemos online"] },
          { id: "transactionVolume", label: "Volumen mensual de ventas online (USD equivalente)", type: "select", options: ["< $1K", "$1K - $10K", "$10K - $100K", "$100K - $1M", "> $1M"], required: true },
          { id: "paymentMethods", label: "¿Qué medios de pago aceptan?", type: "multiselect", options: ["Tarjeta crédito/débito", "Webpay/Transbank", "Mercado Pago", "Transferencia", "Criptoactivos", "Contra entrega", "Solo gratis"] },
          { id: "aiUsage", label: "¿Usan IA en el proceso comercial?", type: "multiselect", options: ["Recomendaciones de productos", "Precios dinámicos", "Chatbot de atención", "Filtrado de reseñas", "Detección de fraude", "Personalización de contenido", "No usamos IA"] },
        ],
        checklist: [
          { id: "sernac-1", label: "Información clara y veraz al consumidor", description: "La información sobre productos, precios, condiciones de venta y costos adicionales (despacho) es clara, veraz y oportuna.", severity: "critico", recommendation: "Mostrar precio total (producto + despacho + impuestos) antes del checkout. Imágenes representativas. Especificaciones técnicas completas. No usar dark patterns." },
          { id: "sernac-2", label: "Derecho de retracto (10 días)", description: "El consumidor puede ejercer retracto dentro de 10 días desde la recepción del producto, con devolución íntegra.", severity: "critico", recommendation: "Implementar botón 'Solicitar retracto' visible en cuenta de usuario. Plazo de respuesta: 5 días. Devolver 100% (incluido despacho) en máximo 10 días." },
          { id: "sernac-3", label: "Botón de arrepentimiento", description: "Para ventas por canales electrónicos no solicitadas, existe botón de arrepentimiento visible y funcional.", severity: "critico", recommendation: "Botón visible en email de confirmación y en cuenta. Plazo 24h para anulaciones sin costo. Sin obligación de compra posterior." },
          { id: "sernac-4", label: "Política de cambios y devoluciones", description: "Existe política clara y pública de cambios/devoluciones, accesible antes de la compra.", severity: "alto", recommendation: "Página dedicada con política clara: plazos, condiciones, costos de retorno. Enlace visible desde página de producto y checkout. Cumplir con SERNAC mínimo legal." },
          { id: "sernac-5", label: "Medios de pago seguros y certificados", description: "Los medios de pago cumplen estándares PCI-DSS y no almacenan datos sensibles del tarjetahabiente.", severity: "critico", recommendation: "Certificación PCI-DSS nivel 1 (propios) o usar gateway certificado (Transbank, Mercado Pago). No almacenar PAN/CVV. Tokenización obligatoria." },
          { id: "sernac-6", label: "Términos y condiciones claros y no abusivos", description: "Los términos y condiciones son claros, no abusivos, y se aceptan de manera expresa antes de la compra.", severity: "alto", recommendation: "T&C en lenguaje claro (lectura nivel 8vo básico). Sin cláusulas abusivas (renuncia a garantías legales, foro unilateral). Checkbox expreso en checkout." },
          { id: "sernac-7", label: "Publicidad veraz y no engañosa", description: "La publicidad (incluida online y en redes) es veraz, no engañosa, con disponibilidad real de stock y ofertas.", severity: "critico", recommendation: "Validar stock antes de publicar oferta. Cumplir precios publicitados. Honrar ofertas por errores de precio (caso SERNAC). Marcar claramente contenido patrocinado." },
          { id: "sernac-8", label: "Atención al consumidor y libro de reclamaciones", description: "Existen canales de atención al consumidor accesibles y se responde dentro de plazos legales (máximo 5 días).", severity: "alto", recommendation: "Canal de contacto visible (teléfono, email, chatbot). SLA respuesta: 5 días hábiles. Registro de quejas con seguimiento. Reportar a SERNAC cuando sea reincidente." },
          { id: "sernac-9", label: "Garantía legal (3 meses)", description: "Se respeta la garantía legal de 3 meses por productos con fallas, con opción de reparación, cambio o devolución.", severity: "alto", recommendation: "Capacitar a atención al cliente en Ley 19.496. Proceso claro para hacer valer garantía. No exigir factura original de comprador (solo comprobante). Cumplir plazos." },
          { id: "sernac-10", label: "Transparencia en recomendaciones con IA", description: "Cuando se usa IA para recomendaciones o precios dinámicos, se informa al consumidor y no se discrimina abusivamente.", severity: "alto", recommendation: "Mostrar aviso visible: 'Algunas recomendaciones/precios se personalizan con base en su comportamiento'. Permitir opt-out. No discriminar precios por género, etnia, ubicación socioeconómica." },
          { id: "sernac-11", label: "Protección de datos de menores consumidores", description: "Cuando el comercio puede alcanzar menores, se aplican protecciones reforzadas (verificación de edad, consentimiento parental).", severity: "alto", recommendation: "Verificación de edad en checkout. No marketing dirigido a <14 años sin consentimiento parental. Cumplir Ley 21.430 (Garantías Niñez) además de SERNAC." },
          { id: "sernac-12", label: "Datos personales y consentimiento en checkout", description: "Se obtiene consentimiento informado para procesar datos personales durante el checkout y se cumple Ley 19.628.", severity: "alto", recommendation: "Checkbox expreso en checkout (no pre-marcado). Política de privacidad accesible. Permitir opt-out marketing. No compartir datos con terceros sin consentimiento expreso." },
        ],
      },
    ],
  },
];

export const ALL_AUDITS: AuditType[] = AUDITS.flatMap((g) => g.audits);

export const SEVERITY_META: Record<Severity, { label: string; color: string; bg: string; border: string; score: number }> = {
  critico: { label: "Crítico", color: "text-red-700", bg: "bg-red-50", border: "border-red-200", score: 10 },
  alto: { label: "Alto", color: "text-orange-700", bg: "bg-orange-50", border: "border-orange-200", score: 7 },
  medio: { label: "Medio", color: "text-amber-700", bg: "bg-amber-50", border: "border-amber-200", score: 4 },
  bajo: { label: "Bajo", color: "text-blue-700", bg: "bg-blue-50", border: "border-blue-200", score: 2 },
  informativo: { label: "Informativo", color: "text-slate-700", bg: "bg-slate-50", border: "border-slate-200", score: 1 },
};

export const PALETTES = {
  azul: {
    name: "Azul Aqua",
    description: "Azul cielo con blanco — fresco, profesional, confianza",
    primary: "oklch(0.55 0.18 230)",
    primaryLight: "oklch(0.85 0.08 230)",
    accent: "oklch(0.65 0.20 200)",
    gradientFrom: "oklch(0.98 0.02 230)",
    gradientVia: "oklch(0.95 0.04 220)",
    gradientTo: "oklch(0.99 0.01 220)",
    heroGradientFrom: "oklch(0.92 0.08 230)",
    heroGradientTo: "oklch(0.99 0.01 230)",
  },
  verde: {
    name: "Verde Esmeralda",
    description: "Verde esmeralda con blanco — natural, seguro, vital",
    primary: "oklch(0.55 0.15 165)",
    primaryLight: "oklch(0.85 0.06 165)",
    accent: "oklch(0.65 0.18 150)",
    gradientFrom: "oklch(0.98 0.02 165)",
    gradientVia: "oklch(0.95 0.04 155)",
    gradientTo: "oklch(0.99 0.01 155)",
    heroGradientFrom: "oklch(0.92 0.08 165)",
    heroGradientTo: "oklch(0.99 0.01 165)",
  },
} as const;

export type PaletteName = keyof typeof PALETTES;

export const LANGUAGES = [
  { code: "es", label: "Español", flag: "🇨🇱" },
  { code: "en", label: "English", flag: "🇺🇸" },
  { code: "pt", label: "Português", flag: "🇧🇷" },
] as const;
