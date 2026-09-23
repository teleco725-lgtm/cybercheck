"use client";

import { motion } from "framer-motion";
import {
  X,
  Download,
  FileText,
  Shield,
  ShieldAlert,
  ShieldCheck,
  ShieldX,
  AlertTriangle,
  Lightbulb,
  Loader2,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  RadialBarChart,
  RadialBar,
  PolarGrid,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SEVERITY_META, type Severity, LANGUAGES } from "@/lib/audits";

export interface AuditResult {
  auditId: string;
  auditName: string;
  framework: string;
  timestamp: string;
  overallScore: number;
  complianceLevel: string;
  summary: string;
  items: {
    id: string;
    label: string;
    severity: Severity;
    status: "compliant" | "partial" | "non_compliant" | "not_applicable";
    score: number;
    findings: string;
    evidence: string;
    recommendation: string;
  }[];
  distribution: { severity: Severity; status: string; count: number; count_status: number }[];
  quickWins: string[];
  criticalActions: string[];
}

const STATUS_META: Record<string, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  compliant: { label: "Cumple", color: "oklch(0.65 0.15 155)", icon: CheckCircle2 },
  partial: { label: "Parcial", color: "oklch(0.75 0.15 75)", icon: AlertCircle },
  non_compliant: { label: "No cumple", color: "oklch(0.60 0.22 25)", icon: XCircle },
  not_applicable: { label: "No aplica", color: "oklch(0.65 0.02 230)", icon: Shield },
};

const COMPLIANCE_LEVELS: Record<string, { color: string; bg: string; icon: typeof Shield }> = {
  Robusto: { color: "text-emerald-700", bg: "from-emerald-500 to-emerald-600", icon: ShieldCheck },
  Adecuado: { color: "text-blue-700", bg: "from-blue-500 to-blue-600", icon: Shield },
  Insuficiente: { color: "text-amber-700", bg: "from-amber-500 to-orange-500", icon: ShieldAlert },
  Crítico: { color: "text-red-700", bg: "from-red-500 to-rose-600", icon: ShieldX },
};

interface ResultsDashboardProps {
  result: AuditResult;
  language: "es" | "en" | "pt";
  onLanguageChange: (l: "es" | "en" | "pt") => void;
  onClose: () => void;
  onExportPDF: (lang: "es" | "en" | "pt") => Promise<void>;
  isExporting: boolean;
}

export function ResultsDashboard({
  result,
  language,
  onLanguageChange,
  onClose,
  onExportPDF,
  isExporting,
}: ResultsDashboardProps) {
  const level = COMPLIANCE_LEVELS[result.complianceLevel] || COMPLIANCE_LEVELS["Insuficiente"];
  const LevelIcon = level.icon;

  // Datos para el gauge de score
  const scoreData = [{ name: "Score", value: result.overallScore, fill: "var(--primary)" }];

  // Datos para el pie de distribución por status
  const statusCounts = Object.keys(STATUS_META).map((status) => ({
    name: STATUS_META[status].label,
    value: result.items.filter((it) => it.status === status).length,
    color: STATUS_META[status].color,
    status,
  })).filter((d) => d.value > 0);

  // Datos para el bar de severidad
  const sevCounts: Severity[] = ["critico", "alto", "medio", "bajo", "informativo"];
  const severityData = sevCounts.map((sev) => {
    const items = result.items.filter((it) => it.severity === sev);
    return {
      name: SEVERITY_META[sev].label,
      total: items.length,
      cumplen: items.filter((it) => it.status === "compliant").length,
      noCumplen: items.filter((it) => it.status === "non_compliant").length,
      parciales: items.filter((it) => it.status === "partial").length,
    };
  }).filter((d) => d.total > 0);

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${level.bg} text-white p-5 shadow-premium`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="h-11 w-11 rounded-xl bg-white/15 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
              <LevelIcon className="h-6 w-6" />
            </div>
            <div className="min-w-0">
              <h2 className="text-lg sm:text-xl font-bold truncate">{result.auditName}</h2>
              <p className="text-sm opacity-90 truncate">{result.framework} · {new Date(result.timestamp).toLocaleString("es-CL")}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Select value={language} onValueChange={(v) => onLanguageChange(v as "es" | "en" | "pt")}>
              <SelectTrigger className="w-32 sm:w-40 bg-white/15 border-white/30 text-white h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {LANGUAGES.map((l) => (
                  <SelectItem key={l.code} value={l.code}>
                    {l.flag} {l.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => onExportPDF(language)}
              disabled={isExporting}
              className="bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-sm gap-2"
              size="sm"
            >
              {isExporting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              <span className="hidden sm:inline">Exportar PDF</span>
            </Button>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="bg-white/15 hover:bg-white/30 text-white h-9 w-9"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Body */}
      <ScrollArea className="flex-1">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6">
          {/* KPIs row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="shadow-premium border-border">
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Score global</div>
                <div className={`text-3xl font-bold ${level.color}`}>{result.overallScore}<span className="text-base text-muted-foreground">/100</span></div>
                <div className={`text-sm font-medium ${level.color}`}>{result.complianceLevel}</div>
              </CardContent>
            </Card>
            <Card className="shadow-premium border-border">
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Cumplen</div>
                <div className="text-3xl font-bold text-emerald-700">
                  {result.items.filter((it) => it.status === "compliant").length}
                </div>
                <div className="text-sm text-muted-foreground">de {result.items.length} controles</div>
              </CardContent>
            </Card>
            <Card className="shadow-premium border-border">
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">No cumplen</div>
                <div className="text-3xl font-bold text-red-700">
                  {result.items.filter((it) => it.status === "non_compliant").length}
                </div>
                <div className="text-sm text-muted-foreground">requieren acción</div>
              </CardContent>
            </Card>
            <Card className="shadow-premium border-border">
              <CardContent className="pt-6">
                <div className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Críticos</div>
                <div className="text-3xl font-bold text-red-700">
                  {result.items.filter((it) => it.severity === "critico" && it.status !== "compliant").length}
                </div>
                <div className="text-sm text-muted-foreground">brechas críticas</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {/* Gauge score */}
            <Card className="shadow-premium border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Puntuación global</CardTitle>
                <CardDescription className="text-xs">Ponderada por severidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-44">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      innerRadius="65%"
                      outerRadius="100%"
                      data={scoreData}
                      startAngle={90}
                      endAngle={90 - (result.overallScore / 100) * 360}
                    >
                      <PolarGrid type="number" domain={[0, 100]} tick={false} />
                      <RadialBar background dataKey="value" cornerRadius={10} />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center -mt-24 relative">
                  <div className={`text-4xl font-bold ${level.color}`}>{result.overallScore}</div>
                  <div className="text-xs text-muted-foreground">/100</div>
                </div>
                <div className="h-12" />
              </CardContent>
            </Card>

            {/* Pie de status */}
            <Card className="shadow-premium border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Distribución de controles</CardTitle>
                <CardDescription className="text-xs">Por estado de cumplimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusCounts}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={70}
                        innerRadius={40}
                        paddingAngle={2}
                        label={({ name, value }) => value > 0 ? `${name}: ${value}` : ""}
                        labelLine={false}
                        style={{ fontSize: "11px" }}
                      >
                        {statusCounts.map((entry) => (
                          <Cell key={entry.status} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Bar de severidad */}
            <Card className="shadow-premium border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Por severidad</CardTitle>
                <CardDescription className="text-xs">Controles por nivel de riesgo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={severityData} layout="horizontal" margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.92 0.01 230)" vertical={false} />
                      <XAxis dataKey="name" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} allowDecimals={false} />
                      <Tooltip
                        contentStyle={{
                          background: "var(--card)",
                          border: "1px solid var(--border)",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend wrapperStyle={{ fontSize: "10px" }} />
                      <Bar dataKey="cumplen" stackId="a" name="Cumplen" fill="oklch(0.65 0.15 155)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="parciales" stackId="a" name="Parcial" fill="oklch(0.75 0.15 75)" radius={[0, 0, 0, 0]} />
                      <Bar dataKey="noCumplen" stackId="a" name="No cumplen" fill="oklch(0.60 0.22 25)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen + acciones */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="shadow-premium border-border">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Resumen ejecutivo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card className="shadow-premium border-l-4 border-l-red-500 border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-red-700">
                    <AlertTriangle className="h-4 w-4" />
                    Acciones críticas
                  </CardTitle>
                  <CardDescription className="text-xs">Implementar en 7 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm">
                    {result.criticalActions.length === 0 && (
                      <li className="text-muted-foreground italic">Sin acciones críticas identificadas</li>
                    )}
                    {result.criticalActions.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-red-700 font-bold flex-shrink-0">{i + 1}.</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>

              <Card className="shadow-premium border-l-4 border-l-amber-500 border-border">
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2 text-amber-700">
                    <Lightbulb className="h-4 w-4" />
                    Quick wins
                  </CardTitle>
                  <CardDescription className="text-xs">Implementar en 30 días</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="space-y-2 text-sm">
                    {result.quickWins.length === 0 && (
                      <li className="text-muted-foreground italic">Sin quick wins identificados</li>
                    )}
                    {result.quickWins.map((a, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="text-amber-700 font-bold flex-shrink-0">{i + 1}.</span>
                        <span>{a}</span>
                      </li>
                    ))}
                  </ol>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Detalle de controles */}
          <Card className="shadow-premium border-border">
            <CardHeader>
              <CardTitle className="text-base">Detalle de controles auditados</CardTitle>
              <CardDescription className="text-xs">
                {result.items.length} controles evaluados · ordenados por severidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {result.items
                  .slice()
                  .sort((a, b) => {
                    const order: Severity[] = ["critico", "alto", "medio", "bajo", "informativo"];
                    const statusOrder = ["non_compliant", "partial", "compliant", "not_applicable"];
                    const sevDiff = order.indexOf(a.severity) - order.indexOf(b.severity);
                    if (sevDiff !== 0) return sevDiff;
                    return statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status);
                  })
                  .map((item, i) => {
                    const sev = SEVERITY_META[item.severity];
                    const StatusIcon = STATUS_META[item.status].icon;
                    return (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: Math.min(i * 0.03, 0.6) }}
                        className="border border-border rounded-xl p-4 bg-card hover:shadow-premium-hover transition-shadow"
                      >
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="flex items-center gap-2 flex-wrap min-w-0">
                            <Badge
                              variant="outline"
                              className={`${sev.bg} ${sev.color} ${sev.border} border`}
                            >
                              {sev.label}
                            </Badge>
                            <Badge
                              variant="outline"
                              className="bg-card"
                            >
                              <StatusIcon className={`h-3 w-3 mr-1 ${
                                item.status === "compliant" ? "text-emerald-700" :
                                item.status === "partial" ? "text-amber-700" :
                                item.status === "non_compliant" ? "text-red-700" :
                                "text-muted-foreground"
                              }`} />
                              {STATUS_META[item.status].label}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{item.id}</span>
                        </div>
                        <h4 className="font-semibold text-sm mb-1">{item.label}</h4>
                        <p className="text-xs text-foreground/80 mb-2">{item.findings}</p>
                        <div className="bg-muted/50 rounded-lg p-2.5 text-xs">
                          <span className="font-semibold text-primary">Recomendación: </span>
                          <span className="text-foreground/80">{item.recommendation}</span>
                        </div>
                      </motion.div>
                    );
                  })}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}
