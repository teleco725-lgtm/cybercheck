"use client";

import jsPDF from "jspdf";
import type { AuditResult } from "@/components/results-dashboard";
import { SEVERITY_META, type Severity } from "@/lib/audits";

type Lang = "es" | "en" | "pt";

const TRANSLATIONS: Record<Lang, {
  title: string;
  subtitle: string;
  generated: string;
  framework: string;
  overallScore: string;
  complianceLevel: string;
  summary: string;
  criticalActions: string;
  quickWins: string;
  controlsDetail: string;
  severity: string;
  status: string;
  findings: string;
  recommendation: string;
  evidence: string;
  page: string;
  of: string;
  poweredBy: string;
  statusLabels: Record<string, string>;
  severityLabels: Record<Severity, string>;
  levelLabels: Record<string, string>;
}> = {
  es: {
    title: "Informe de Auditoría de IA",
    subtitle: "CyberCheck · Plataforma de Auditoría de Inteligencia Artificial",
    generated: "Generado el",
    framework: "Marco de referencia",
    overallScore: "Puntuación global",
    complianceLevel: "Nivel de cumplimiento",
    summary: "Resumen ejecutivo",
    criticalActions: "Acciones críticas (7 días)",
    quickWins: "Quick wins (30 días)",
    controlsDetail: "Detalle de controles auditados",
    severity: "Severidad",
    status: "Estado",
    findings: "Hallazgos",
    recommendation: "Recomendación",
    evidence: "Evidencia",
    page: "Página",
    of: "de",
    poweredBy: "Generado con CyberCheck · ciberseguridad con libertad y eficiencia",
    statusLabels: {
      compliant: "Cumple",
      partial: "Parcial",
      non_compliant: "No cumple",
      not_applicable: "No aplica",
    },
    severityLabels: {
      critico: "Crítico",
      alto: "Alto",
      medio: "Medio",
      bajo: "Bajo",
      informativo: "Informativo",
    },
    levelLabels: {
      Robusto: "Robusto",
      Adecuado: "Adecuado",
      Insuficiente: "Insuficiente",
      Crítico: "Crítico",
    },
  },
  en: {
    title: "AI Audit Report",
    subtitle: "CyberCheck · AI Auditing Platform",
    generated: "Generated on",
    framework: "Framework",
    overallScore: "Overall score",
    complianceLevel: "Compliance level",
    summary: "Executive summary",
    criticalActions: "Critical actions (7 days)",
    quickWins: "Quick wins (30 days)",
    controlsDetail: "Audited controls detail",
    severity: "Severity",
    status: "Status",
    findings: "Findings",
    recommendation: "Recommendation",
    evidence: "Evidence",
    page: "Page",
    of: "of",
    poweredBy: "Generated with CyberCheck · cybersecurity with freedom and efficiency",
    statusLabels: {
      compliant: "Compliant",
      partial: "Partial",
      non_compliant: "Non-compliant",
      not_applicable: "Not applicable",
    },
    severityLabels: {
      critico: "Critical",
      alto: "High",
      medio: "Medium",
      bajo: "Low",
      informativo: "Informational",
    },
    levelLabels: {
      Robusto: "Robust",
      Adecuado: "Adequate",
      Insuficiente: "Insufficient",
      Crítico: "Critical",
    },
  },
  pt: {
    title: "Relatório de Auditoria de IA",
    subtitle: "CyberCheck · Plataforma de Auditoria de Inteligência Artificial",
    generated: "Gerado em",
    framework: "Framework",
    overallScore: "Pontuação global",
    complianceLevel: "Nível de conformidade",
    summary: "Resumo executivo",
    criticalActions: "Ações críticas (7 dias)",
    quickWins: "Quick wins (30 dias)",
    controlsDetail: "Detalhe dos controles auditados",
    severity: "Severidade",
    status: "Status",
    findings: "Constatações",
    recommendation: "Recomendação",
    evidence: "Evidência",
    page: "Página",
    of: "de",
    poweredBy: "Gerado com CyberCheck · cibersegurança com liberdade e eficiência",
    statusLabels: {
      compliant: "Conforme",
      partial: "Parcial",
      non_compliant: "Não conforme",
      not_applicable: "Não aplicável",
    },
    severityLabels: {
      critico: "Crítico",
      alto: "Alto",
      medio: "Médio",
      bajo: "Baixo",
      informativo: "Informativo",
    },
    levelLabels: {
      Robusto: "Robusto",
      Adecuado: "Adequado",
      Insuficiente: "Insuficiente",
      Crítico: "Crítico",
    },
  },
};

const SEVERITY_COLORS: Record<Severity, [number, number, number]> = {
  critico: [220, 38, 38],
  alto: [234, 88, 12],
  medio: [217, 119, 6],
  bajo: [37, 99, 235],
  informativo: [100, 116, 139],
};

const STATUS_COLORS: Record<string, [number, number, number]> = {
  compliant: [22, 163, 74],
  partial: [217, 119, 6],
  non_compliant: [220, 38, 38],
  not_applicable: [100, 116, 139],
};

export async function exportAuditPDF(result: AuditResult, lang: Lang = "es") {
  const t = TRANSLATIONS[lang] || TRANSLATIONS.es;
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "pt",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 40;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Helper: ensure y doesn't overflow, add page if needed
  const ensureSpace = (needed: number) => {
    if (y + needed > pageHeight - margin - 30) {
      addFooter();
      doc.addPage();
      y = margin;
      addHeaderBar();
    }
  };

  const addHeaderBar = () => {
    doc.setFillColor(22, 78, 138);
    doc.rect(0, 0, pageWidth, 6, "F");
    doc.setFontSize(8);
    doc.setTextColor(120, 130, 145);
    doc.setFont("helvetica", "normal");
    doc.text(t.subtitle, margin, margin - 10);
    y = margin + 10;
  };

  const addFooter = () => {
    const pageNum = doc.getCurrentPageInfo().pageNumber;
    const totalPages = doc.getNumberOfPages();
    doc.setFontSize(8);
    doc.setTextColor(140, 150, 165);
    doc.setFont("helvetica", "normal");
    doc.text(
      `${t.page} ${pageNum} ${t.of} ${totalPages}`,
      pageWidth / 2,
      pageHeight - 15,
      { align: "center" }
    );
    doc.text(t.poweredBy, margin, pageHeight - 15);
  };

  // Header — gradient-like band
  doc.setFillColor(15, 76, 129);
  doc.rect(0, 0, pageWidth, 80, "F");
  doc.setFillColor(28, 100, 175);
  doc.rect(0, 0, pageWidth * 0.6, 80, "F");

  // Title
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text(t.title, margin, 38);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(t.subtitle, margin, 56);

  // Metadata top right
  doc.setFontSize(8);
  const dateStr = new Date(result.timestamp).toLocaleString(
    lang === "es" ? "es-CL" : lang === "pt" ? "pt-BR" : "en-US"
  );
  doc.text(`${t.generated}: ${dateStr}`, pageWidth - margin, 38, { align: "right" });
  doc.text(`${t.framework}: ${result.framework}`, pageWidth - margin, 50, { align: "right" });

  y = 100;

  // Audit name
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  const auditNameLines = doc.splitTextToSize(result.auditName, contentWidth);
  doc.text(auditNameLines, margin, y);
  y += auditNameLines.length * 18 + 8;

  // Score block — colored band based on level
  const levelColors: Record<string, [number, number, number]> = {
    Robusto: [22, 163, 74],
    Adecuado: [37, 99, 235],
    Insuficiente: [217, 119, 6],
    Crítico: [220, 38, 38],
  };
  const levelColor = levelColors[result.complianceLevel] || levelColors["Insuficiente"];

  doc.setFillColor(levelColor[0], levelColor[1], levelColor[2]);
  doc.roundedRect(margin, y, contentWidth, 50, 6, 6, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(28);
  doc.text(`${result.overallScore}`, margin + 20, y + 32);
  doc.setFontSize(14);
  doc.text("/100", margin + 20 + doc.getTextWidth(`${result.overallScore}`) + 4, y + 32);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.text(t.overallScore, margin + 100, y + 22);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(t.levelLabels[result.complianceLevel] || result.complianceLevel, margin + 100, y + 40);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.text(t.complianceLevel, margin + 100, y + 52);

  // Right side stats
  const compliant = result.items.filter((it) => it.status === "compliant").length;
  const nonCompliant = result.items.filter((it) => it.status === "non_compliant").length;
  const partial = result.items.filter((it) => it.status === "partial").length;

  doc.setFontSize(9);
  doc.text(`${t.statusLabels.compliant}: ${compliant}`, pageWidth - margin - 200, y + 18);
  doc.text(`${t.statusLabels.partial}: ${partial}`, pageWidth - margin - 200, y + 32);
  doc.text(`${t.statusLabels.non_compliant}: ${nonCompliant}`, pageWidth - margin - 200, y + 46);

  doc.setFontSize(8);
  doc.text(`${result.items.length} ${t.controlsDetail.toLowerCase()}`, pageWidth - margin - 90, y + 18);
  const criticalBreaches = result.items.filter(
    (it) => it.severity === "critico" && it.status !== "compliant"
  ).length;
  doc.setTextColor(255, 200, 200);
  doc.text(`Críticos: ${criticalBreaches}`, pageWidth - margin - 90, y + 32);

  y += 70;

  // Summary
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(t.summary, margin, y);
  y += 16;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(60, 70, 85);
  const summaryLines = doc.splitTextToSize(result.summary, contentWidth);
  summaryLines.forEach((line: string) => {
    ensureSpace(14);
    doc.text(line, margin, y);
    y += 13;
  });
  y += 12;

  // Critical actions
  if (result.criticalActions.length > 0) {
    ensureSpace(40);
    doc.setTextColor(220, 38, 38);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(t.criticalActions, margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 70, 85);
    result.criticalActions.forEach((action, i) => {
      ensureSpace(20);
      const lines = doc.splitTextToSize(`${i + 1}. ${action}`, contentWidth - 14);
      doc.setFillColor(254, 226, 226);
      doc.rect(margin, y - 9, 4, lines.length * 12 + 2, "F");
      lines.forEach((line: string, idx: number) => {
        if (idx > 0) ensureSpace(12);
        doc.text(line, margin + 10, y);
        y += 12;
      });
      y += 4;
    });
    y += 8;
  }

  // Quick wins
  if (result.quickWins.length > 0) {
    ensureSpace(40);
    doc.setTextColor(217, 119, 6);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.text(t.quickWins, margin, y);
    y += 14;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 70, 85);
    result.quickWins.forEach((action, i) => {
      ensureSpace(20);
      const lines = doc.splitTextToSize(`${i + 1}. ${action}`, contentWidth - 14);
      doc.setFillColor(254, 243, 199);
      doc.rect(margin, y - 9, 4, lines.length * 12 + 2, "F");
      lines.forEach((line: string, idx: number) => {
        if (idx > 0) ensureSpace(12);
        doc.text(line, margin + 10, y);
        y += 12;
      });
      y += 4;
    });
    y += 8;
  }

  // Controls detail
  ensureSpace(40);
  doc.setTextColor(15, 23, 42);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  doc.text(t.controlsDetail, margin, y);
  y += 14;

  // Table header
  const headerY = y;
  doc.setFillColor(241, 245, 249);
  doc.rect(margin, headerY - 10, contentWidth, 18, "F");

  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.setTextColor(60, 70, 85);
  doc.text("ID", margin + 6, headerY + 2);
  doc.text(t.severity, margin + 50, headerY + 2);
  doc.text(t.status, margin + 110, headerY + 2);
  doc.text(t.findings + " / " + t.recommendation, margin + 200, headerY + 2);

  y = headerY + 16;

  // Sort items by severity then status
  const sortedItems = result.items.slice().sort((a, b) => {
    const order: Severity[] = ["critico", "alto", "medio", "bajo", "informativo"];
    const statusOrder = ["non_compliant", "partial", "compliant", "not_applicable"];
    const sevDiff = order.indexOf(a.severity) - order.indexOf(b.severity);
    if (sevDiff !== 0) return sevDiff;
    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
  });

  sortedItems.forEach((item) => {
    ensureSpace(60);

    const sevColor = SEVERITY_COLORS[item.severity];
    const statusColor = STATUS_COLORS[item.status];

    // Severity indicator
    doc.setFillColor(sevColor[0], sevColor[1], sevColor[2]);
    doc.rect(margin, y - 9, 3, 40, "F");

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    doc.setTextColor(80, 90, 105);
    doc.text(item.id.toUpperCase(), margin + 8, y);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(sevColor[0], sevColor[1], sevColor[2]);
    doc.text(t.severityLabels[item.severity], margin + 50, y);

    doc.setTextColor(statusColor[0], statusColor[1], statusColor[2]);
    doc.text(t.statusLabels[item.status], margin + 110, y);

    // Label
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(15, 23, 42);
    const labelLines = doc.splitTextToSize(item.label, contentWidth - 200);
    labelLines.forEach((line: string, idx: number) => {
      if (idx > 0) ensureSpace(11);
      doc.text(line, margin + 200, y);
      y += 11;
    });

    // Findings
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(80, 90, 105);
    const findingsLines = doc.splitTextToSize(`${t.findings}: ${item.findings}`, contentWidth - 200);
    findingsLines.forEach((line: string) => {
      ensureSpace(11);
      doc.text(line, margin + 200, y);
      y += 11;
    });

    // Recommendation
    const recLines = doc.splitTextToSize(`${t.recommendation}: ${item.recommendation}`, contentWidth - 200);
    recLines.forEach((line: string) => {
      ensureSpace(11);
      doc.text(line, margin + 200, y);
      y += 11;
    });

    y += 8;

    // Separator
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y - 4, margin + contentWidth, y - 4);
    y += 4;
  });

  // Footer on last page
  addFooter();

  // Save
  const fileName = `cybercheck-${result.auditId}-${new Date().toISOString().split("T")[0]}-${lang}.pdf`;
  doc.save(fileName);
}
