import { NextRequest, NextResponse } from "next/server";
import ZAI from "z-ai-web-dev-sdk";
import { ALL_AUDITS, SEVERITY_META, type Severity } from "@/lib/audits";

export const runtime = "nodejs";
export const maxDuration = 60;

interface AuditRequest {
  auditId: string;
  answers: Record<string, string | string[]>;
  language?: "es" | "en" | "pt";
}

interface AuditItemResult {
  id: string;
  label: string;
  severity: Severity;
  status: "compliant" | "partial" | "non_compliant" | "not_applicable";
  score: number;
  findings: string;
  evidence: string;
  recommendation: string;
}

interface AuditResult {
  auditId: string;
  auditName: string;
  framework: string;
  timestamp: string;
  overallScore: number;
  complianceLevel: string;
  summary: string;
  items: AuditItemResult[];
  distribution: { severity: Severity; status: string; count: number; count_status: number }[];
  quickWins: string[];
  criticalActions: string[];
}

const STATUS_SCORES: Record<AuditItemResult["status"], number> = {
  compliant: 100,
  partial: 50,
  non_compliant: 0,
  not_applicable: 100,
};

const LANGUAGE_PROMPTS: Record<string, string> = {
  es: "Responde en español de Chile, formal y técnico, orientado a PyMEs.",
  en: "Respond in English, formal and technical, oriented to SMEs.",
  pt: "Responda em português do Brasil, formal e técnico, orientado a PMEs.",
};

export async function POST(req: NextRequest) {
  try {
    const body: AuditRequest = await req.json();
    const { auditId, answers, language = "es" } = body;

    const audit = ALL_AUDITS.find((a) => a.id === auditId);
    if (!audit) {
      return NextResponse.json(
        { error: "Auditoría no encontrada", auditId },
        { status: 404 }
      );
    }

    const itemsPrompt = audit.checklist
      .map(
        (c, i) =>
          `${i + 1}. [${c.severity.toUpperCase()}] ${c.label}\n   Descripción: ${c.description}\n   Recomendación base: ${c.recommendation}`
      )
      .join("\n\n");

    const answersText = Object.entries(answers)
      .map(([k, v]) => `- ${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
      .join("\n");

    const langInstruction = LANGUAGE_PROMPTS[language] || LANGUAGE_PROMPTS.es;

    const prompt = `Eres un auditor senior de IA y ciberseguridad. ${langInstruction}

CONTEXTO DE LA ORGANIZACIÓN:
${answersText}

AUDITORÍA A REALIZAR:
- Nombre: ${audit.name}
- Marco: ${audit.framework}
- Resumen: ${audit.summary}

CHECKLIST DE EVALUACIÓN (${audit.checklist.length} ítems):
${itemsPrompt}

INSTRUCCIONES:
Para CADA ítem del checklist, evalúa el estado basándote en las respuestas del contexto. Devuelve EXCLUSIVAMENTE un JSON válido con esta estructura exacta:

{
  "items": [
    {
      "id": "<id del ítem, ej gov-1>",
      "status": "compliant" | "partial" | "non_compliant" | "not_applicable",
      "findings": "<2-3 frases con el análisis específico de la organización>",
      "evidence": "<qué evidencia se necesita o ya existe>",
      "recommendation": "<recomendación adaptada al contexto>"
    }
  ],
  "summary": "<párrafo de 4-6 frases resumiendo el estado general>",
  "quickWins": ["<3 acciones rápidas de implementar en 30 días>"],
  "criticalActions": ["<3 acciones críticas de implementar en 7 días>"]
}

REGLAS:
- Status "compliant": el contexto demuestra que el control está implementado y es efectivo.
- Status "partial": el control existe pero falta madurez, documentación o cobertura.
- Status "non_compliant": el control no existe o es inefectivo.
- Status "not_applicable": el control no aplica a esta organización (raro, solo cuando sea evidente).
- Considera el tamaño de la organización: las PyMEs no requieren la madurez de una banca.
- NO inventes detalles que no estén en las respuestas; sé específico y accionable.
- Devuelve SOLO el JSON, sin markdown, sin explicaciones adicionales.`;

    let parsed: {
      items: Array<Omit<AuditItemResult, "label" | "severity" | "score">>;
      summary: string;
      quickWins: string[];
      criticalActions: string[];
    };

    try {
      const zai = await ZAI.create();
      const response = await zai.chat.completions.create({
        messages: [
          {
            role: "system",
            content:
              "Eres un auditor experto en IA y ciberseguridad. Respondes SIEMPRE en JSON válido, sin markdown, sin texto adicional.",
          },
          { role: "user", content: prompt },
        ],
        stream: false,
        thinking: { type: "disabled" },
      });

      const raw = response.choices?.[0]?.message?.content || "";
      const cleaned = raw
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/```\s*$/i, "")
        .trim();

      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("LLM call failed, falling back to deterministic assessment:", err);
      parsed = generateFallback(audit, answers);
    }

    const items: AuditItemResult[] = audit.checklist.map((checkItem) => {
      const llmItem = parsed.items?.find((i) => i.id === checkItem.id);
      const status = llmItem?.status || "non_compliant";
      return {
        id: checkItem.id,
        label: checkItem.label,
        severity: checkItem.severity,
        status,
        score: STATUS_SCORES[status],
        findings: llmItem?.findings || `No se pudo evaluar el control "${checkItem.label}" con la información proporcionada.`,
        evidence: llmItem?.evidence || "Solicitar evidencia documental al responsable del área.",
        recommendation: llmItem?.recommendation || checkItem.recommendation,
      };
    });

    const totalWeight = items.reduce(
      (sum, it) => sum + SEVERITY_META[it.severity].score,
      0
    );
    const weightedScore = items.reduce(
      (sum, it) => sum + (it.score * SEVERITY_META[it.severity].score) / 100,
      0
    );
    const overallScore = Math.round((weightedScore / totalWeight) * 100);

    let complianceLevel: string;
    if (overallScore >= 85) complianceLevel = "Robusto";
    else if (overallScore >= 65) complianceLevel = "Adecuado";
    else if (overallScore >= 40) complianceLevel = "Insuficiente";
    else complianceLevel = "Crítico";

    const severities: Severity[] = ["critico", "alto", "medio", "bajo", "informativo"];
    const distribution = severities
      .map((sev) => {
        const sevItems = items.filter((it) => it.severity === sev);
        const statuses = ["compliant", "partial", "non_compliant", "not_applicable"];
        return statuses.map((status) => ({
          severity: sev,
          status,
          count: sevItems.length,
          count_status: sevItems.filter((it) => it.status === status).length,
        }));
      })
      .flat();

    const result: AuditResult = {
      auditId: audit.id,
      auditName: audit.name,
      framework: audit.framework,
      timestamp: new Date().toISOString(),
      overallScore,
      complianceLevel,
      summary: parsed.summary || `Auditoría completada. Score general: ${overallScore}%.`,
      items,
      distribution,
      quickWins: parsed.quickWins || [],
      criticalActions: parsed.criticalActions || [],
    };

    return NextResponse.json(result);
  } catch (err: any) {
    console.error("Audit API error:", err);
    return NextResponse.json(
      { error: err?.message || "Error interno del servidor" },
      { status: 500 }
    );
  }
}

function generateFallback(
  audit: (typeof ALL_AUDITS)[number],
  answers: Record<string, string | string[]>
): {
  items: Array<{ id: string; status: "compliant" | "partial" | "non_compliant" | "not_applicable"; findings: string; evidence: string; recommendation: string }>;
  summary: string;
  quickWins: string[];
  criticalActions: string[];
} {
  const hasPolicy = Object.values(answers).some((v) =>
    typeof v === "string" && v.toLowerCase().includes("sí")
  );

  return {
    items: audit.checklist.map((c) => ({
      id: c.id,
      status: hasPolicy ? "partial" : "non_compliant",
      findings: `Evaluación heurística del control "${c.label}". Se requiere revisión manual para confirmar el estado real.`,
      evidence: `Solicitar evidencia documental del control "${c.label}" al responsable.`,
      recommendation: c.recommendation,
    })),
    summary: `La auditoría se ejecutó en modo fallback (sin IA). Los resultados son indicativos y deben verificarse manualmente. La organización debe revisar cada ítem y mejorar la documentación de los controles.`,
    quickWins: [
      "Documentar formalmente la política de IA",
      "Crear un inventario básico de sistemas de IA en uso",
      "Designar un responsable de IA",
    ],
    criticalActions: [
      "Identificar y suspender sistemas de IA no autorizados",
      "Revisar acceso a datos personales por sistemas de IA",
      "Establecer un canal de reporte de incidentes de IA",
    ],
  };
}
