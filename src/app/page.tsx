"use client";

import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  Sparkles,
  Building2,
  Scale,
  AlertTriangle,
  HeartHandshake,
  Award,
  Eye,
  FileText,
  Gavel,
  Flag,
  ChevronRight,
  ArrowRight,
  Globe,
  Lock,
  TrendingUp,
  CheckCircle2,
  Loader2,
  PlayCircle,
  Menu,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ThemeToggle } from "@/components/theme-toggle";
import { AuditWizard } from "@/components/audit-wizard";
import { ResultsDashboard, type AuditResult } from "@/components/results-dashboard";
import { exportAuditPDF } from "@/lib/pdf-export";
import { AUDITS, ALL_AUDITS, type AuditType, type AuditRegion } from "@/lib/audits";
import { useToast } from "@/hooks/use-toast";

const ICONS = {
  Building2,
  Scale,
  AlertTriangle,
  HeartHandshake,
  Award,
  Eye,
  FileText,
  Gavel,
  Flag,
} as const;

type View = "home" | "menu";

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [selectedAudit, setSelectedAudit] = useState<AuditType | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<AuditResult | null>(null);
  const [language, setLanguage] = useState<"es" | "en" | "pt">("es");
  const [isExporting, setIsExporting] = useState(false);
  const [activeRegion, setActiveRegion] = useState<AuditRegion | "all">("all");
  const { toast } = useToast();

  // Apply default palette on mount
  useEffect(() => {
    if (typeof document !== "undefined") {
      const saved = localStorage.getItem("cybercheck-palette") as "azul" | "verde" | null;
      document.body.classList.add(`palette-${saved || "azul"}`);
    }
  }, []);

  const handleSelectAudit = (audit: AuditType) => {
    setSelectedAudit(audit);
    setResult(null);
  };

  const handleExecute = async (answers: Record<string, string | string[]>) => {
    if (!selectedAudit) return;
    setIsExecuting(true);
    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          auditId: selectedAudit.id,
          answers,
          language,
        }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Error ${res.status}`);
      }
      const data: AuditResult = await res.json();
      setResult(data);
      setSelectedAudit(null);
      toast({
        title: "Auditoría completada",
        description: `${selectedAudit.name} — Score: ${data.overallScore}/100 (${data.complianceLevel})`,
      });
    } catch (err: any) {
      toast({
        title: "Error en la auditoría",
        description: err?.message || "No se pudo completar la auditoría",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  const handleExportPDF = async (lang: "es" | "en" | "pt") => {
    if (!result) return;
    setIsExporting(true);
    try {
      await exportAuditPDF(result, lang);
      toast({
        title: "PDF exportado",
        description: `Informe en ${lang === "es" ? "español" : lang === "en" ? "inglés" : "portugués"}`,
      });
    } catch (err: any) {
      toast({
        title: "Error al exportar PDF",
        description: err?.message || "No se pudo generar el PDF",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };

  const filteredGroups = useMemo(() => {
    if (activeRegion === "all") return AUDITS;
    return AUDITS.filter((g) => g.id === activeRegion);
  }, [activeRegion]);

  const totalAudits = ALL_AUDITS.length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* NAV */}
      <header className="sticky top-0 z-40 glass border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-premium">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-500 ring-2 ring-background" />
            </div>
            <div className="leading-tight">
              <div className="font-bold text-base sm:text-lg tracking-tight">
                Cyber<span className="gradient-text">Check</span>
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider">
                Auditoría de IA
              </div>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-1">
            <Button
              variant={view === "home" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("home")}
            >
              Inicio
            </Button>
            <Button
              variant={view === "menu" ? "default" : "ghost"}
              size="sm"
              onClick={() => setView("menu")}
            >
              Auditorías
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                document.getElementById("filosofia")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Filosofía
            </Button>
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            {view !== "menu" && (
              <Button
                onClick={() => setView("menu")}
                size="sm"
                className="gap-1.5 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-premium-hover"
              >
                <span className="hidden sm:inline">Auditar ahora</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* HERO */}
        {view === "home" && (
          <section className="relative overflow-hidden">
            <div className="absolute inset-0 grid-pattern opacity-40" aria-hidden />
            <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl animate-float-slow" aria-hidden />
            <div className="absolute top-40 -left-32 h-72 w-72 rounded-full bg-accent/30 blur-3xl" aria-hidden />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-24">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Badge variant="secondary" className="gap-1.5 py-1.5 px-3 bg-accent/40 border-accent">
                      <Sparkles className="h-3.5 w-3.5 text-primary" />
                      <span className="text-xs font-medium">{totalAudits} auditorías · Internacional + Chile</span>
                    </Badge>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.05]"
                  >
                    Audita tu uso de <span className="gradient-text">Inteligencia Artificial</span> con la confianza de un experto.
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-base sm:text-lg text-muted-foreground leading-relaxed max-w-xl"
                  >
                    Plataforma para PyMEs chilenas que audita el uso responsable, seguro y legal
                    de IA. Marcos internacionales (NIST AI RMF, ISO 42001, AI Act UE) y marco legal
                    chileno (Ley 19.628, Ley 21.459). Sin jerga innecesaria, con checklists accionables.
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="flex flex-wrap gap-3"
                  >
                    <Button
                      onClick={() => setView("menu")}
                      size="lg"
                      className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-premium-hover text-base h-12 px-6"
                    >
                      <PlayCircle className="h-5 w-5" />
                      Comenzar auditoría
                    </Button>
                    <Button
                      onClick={() => {
                        document.getElementById("filosofia")?.scrollIntoView({ behavior: "smooth" });
                      }}
                      variant="outline"
                      size="lg"
                      className="gap-2 text-base h-12 px-6"
                    >
                      Ver filosofía
                    </Button>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-muted-foreground pt-4"
                  >
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Multilenguaje (ES/EN/PT)</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Exporta PDF profesional</span>
                    <span className="flex items-center gap-1.5"><CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" /> Diseñado para PyMEs</span>
                  </motion.div>
                </div>

                {/* Preview dashboard mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/30 rounded-3xl blur-2xl" aria-hidden />
                  <Card className="relative shadow-premium border-border overflow-hidden">
                    <CardHeader className="bg-gradient-to-r from-primary to-primary/70 text-primary-foreground pb-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-base">Dashboard de resultados</CardTitle>
                          <CardDescription className="text-primary-foreground/80 text-xs">
                            ISO 42001 · Sistema de Gestión de IA
                          </CardDescription>
                        </div>
                        <Badge className="bg-white/20 text-white border-0">Adecuado</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-5 space-y-4">
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="text-xs text-muted-foreground uppercase tracking-wider">Score global</div>
                          <div className="text-4xl font-bold text-primary">72<span className="text-lg text-muted-foreground">/100</span></div>
                        </div>
                        <div className="text-right space-y-1">
                          <div className="text-xs text-emerald-700 font-medium flex items-center gap-1"><CheckCircle2 className="h-3 w-3" /> 5 cumplen</div>
                          <div className="text-xs text-amber-700 font-medium flex items-center gap-1"><AlertTriangle className="h-3 w-3" /> 2 parciales</div>
                          <div className="text-xs text-red-700 font-medium flex items-center gap-1"><X className="h-3 w-3" /> 1 no cumple</div>
                        </div>
                      </div>

                      {/* Mini bar chart */}
                      <div className="space-y-2">
                        {[
                          { label: "Crítico", value: 60, color: "bg-red-500" },
                          { label: "Alto", value: 75, color: "bg-orange-500" },
                          { label: "Medio", value: 80, color: "bg-amber-500" },
                          { label: "Bajo", value: 90, color: "bg-blue-500" },
                        ].map((row) => (
                          <div key={row.label} className="flex items-center gap-3">
                            <div className="text-xs w-12 text-muted-foreground">{row.label}</div>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${row.value}%` }}
                                transition={{ duration: 0.8, delay: 0.6 }}
                                className={`h-full ${row.color}`}
                              />
                            </div>
                            <div className="text-xs font-mono w-8 text-right">{row.value}%</div>
                          </div>
                        ))}
                      </div>

                      <div className="bg-muted/50 rounded-lg p-3 text-xs">
                        <div className="font-semibold text-primary mb-1 flex items-center gap-1.5">
                          <Zap className="h-3 w-3" /> Quick wins sugeridos
                        </div>
                        <ul className="space-y-1 text-muted-foreground">
                          <li>· Documentar política formal de IA</li>
                          <li>· Crear inventario de sistemas</li>
                          <li>· Designar AI Governance Lead</li>
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>
        )}

        {/* MENÚ PRINCIPAL DE AUDITORÍAS */}
        {view === "menu" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="text-center max-w-3xl mx-auto mb-10"
            >
              <Badge variant="secondary" className="gap-1.5 mb-4">
                <Globe className="h-3.5 w-3.5" />
                Catálogo completo
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3">
                ¿Qué quieres <span className="gradient-text">auditar</span>?
              </h2>
              <p className="text-muted-foreground">
                Selecciona un ámbito para ver las auditorías disponibles. Cada una se ejecuta con IA,
                genera un dashboard con score y recomendaciones, y se puede exportar en PDF multilenguaje.
              </p>
            </motion.div>

            {/* Region filter */}
            <div className="flex items-center justify-center gap-2 mb-8">
              <Button
                variant={activeRegion === "all" ? "default" : "outline"}
                size="sm"
                onClick={() => setActiveRegion("all")}
                className="gap-1.5"
              >
                <Globe className="h-4 w-4" />
                Todas
              </Button>
              {AUDITS.map((group) => (
                <Button
                  key={group.id}
                  variant={activeRegion === group.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveRegion(group.id)}
                  className="gap-1.5"
                >
                  <span>{group.flag}</span>
                  {group.label}
                </Button>
              ))}
            </div>

            {/* Audit cards by group */}
            <div className="space-y-10">
              {filteredGroups.map((group, gIdx) => (
                <motion.div
                  key={group.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: gIdx * 0.1 }}
                >
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-2xl">{group.flag}</span>
                    <div>
                      <h3 className="text-xl font-bold tracking-tight">{group.label}</h3>
                      <p className="text-sm text-muted-foreground max-w-2xl">{group.description}</p>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {group.audits.map((audit, idx) => {
                      const Icon = ICONS[audit.icon as keyof typeof ICONS] || FileText;
                      return (
                        <motion.div
                          key={audit.id}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: idx * 0.05 }}
                          whileHover={{ y: -3 }}
                        >
                          <Card
                            className="h-full cursor-pointer shadow-premium-hover border-border group"
                            onClick={() => handleSelectAudit(audit)}
                          >
                            <CardHeader className="pb-3">
                              <div className="flex items-start justify-between gap-2 mb-2">
                                <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-primary/10 to-accent/30 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/50 transition-colors">
                                  <Icon className="h-5 w-5 text-primary" />
                                </div>
                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
                                  {audit.checklist.length} controles
                                </Badge>
                              </div>
                              <CardTitle className="text-base leading-tight">{audit.name}</CardTitle>
                              <CardDescription className="text-xs font-medium text-primary">
                                {audit.shortName}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-0">
                              <p className="text-xs text-muted-foreground line-clamp-3 mb-3">
                                {audit.summary}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                                  {audit.framework}
                                </span>
                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* STATS / FEATURES (always visible on home) */}
        {view === "home" && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                { icon: Globe, label: "Marcos internacionales", value: "6", desc: "NIST AI RMF, ISO 42001, AI Act UE, OECD, UNESCO" },
                { icon: Flag, label: "Leyes chilenas", value: "4", desc: "Ley 19.628, Ley 19.223, Ley 21.459, marco en discusión" },
                { icon: TrendingUp, label: "Controles evaluados", value: "70+", desc: "Checklists accionables por auditoría" },
                { icon: Lock, label: "Idiomas de export", value: "3", desc: "Español, English, Português" },
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.1 }}
                  >
                    <Card className="h-full shadow-premium border-border">
                      <CardContent className="pt-6">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-3">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div className="text-3xl font-bold tracking-tight">{stat.value}</div>
                        <div className="text-sm font-medium">{stat.label}</div>
                        <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        {/* FILOSOFÍA — frase final */}
        <section id="filosofia" className="relative overflow-hidden mt-8">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/20 to-primary/5" aria-hidden />
          <div className="absolute inset-0 grid-pattern opacity-30" aria-hidden />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex h-14 w-14 rounded-2xl bg-gradient-to-br from-primary to-primary/60 items-center justify-center shadow-premium mx-auto">
                <ShieldCheck className="h-7 w-7 text-primary-foreground" />
              </div>

              <blockquote className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight tracking-tight max-w-4xl mx-auto">
                <span className="text-muted-foreground">"</span>
                La ciberseguridad no es tener limitaciones restringidas,
                <br className="hidden sm:block" />
                <span className="gradient-text"> sino que da libertad y mayor eficiencia de gobernanza de los datos.</span>
                <span className="text-muted-foreground">"</span>
              </blockquote>

              <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
                CyberCheck · Plataforma de auditoría de IA para PyMEs chilenas
              </p>

              <div className="pt-6 flex flex-wrap justify-center gap-3">
                <Button
                  onClick={() => setView("menu")}
                  size="lg"
                  className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-premium-hover"
                >
                  <Sparkles className="h-4 w-4" />
                  Iniciar auditoría con IA
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border bg-card/50 backdrop-blur-sm mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <ShieldCheck className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">CyberCheck</span>
              </div>
              <p className="text-xs text-muted-foreground">
                Plataforma de auditoría de IA para PyMEs chilenas. Marcos internacionales y marco legal nacional.
              </p>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Internacional</h4>
              <ul className="space-y-1.5 text-xs">
                {AUDITS[0].audits.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => { setView("menu"); handleSelectAudit(a); }}
                      className="text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {a.shortName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Chile</h4>
              <ul className="space-y-1.5 text-xs">
                {AUDITS[1].audits.map((a) => (
                  <li key={a.id}>
                    <button
                      onClick={() => { setView("menu"); handleSelectAudit(a); }}
                      className="text-muted-foreground hover:text-primary transition-colors text-left"
                    >
                      {a.shortName}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-xs uppercase tracking-wider text-muted-foreground mb-3">Recursos</h4>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li>NIST AI RMF 1.0</li>
                <li>ISO/IEC 42001:2023</li>
                <li>AI Act UE (Reglamento 2024/1689)</li>
                <li>Ley 19.628 · Ley 21.459</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-border text-xs text-muted-foreground text-center">
            © {new Date().getFullYear()} CyberCheck · La ciberseguridad da libertad y mayor eficiencia de gobernanza de los datos.
          </div>
        </div>
      </footer>

      {/* Wizard modal */}
      <AnimatePresence>
        {selectedAudit && (
          <AuditWizard
            audit={selectedAudit}
            language={language}
            onExecute={handleExecute}
            isExecuting={isExecuting}
            onClose={() => setSelectedAudit(null)}
          />
        )}
      </AnimatePresence>

      {/* Results dashboard modal */}
      {result && (
        <ResultsDashboard
          result={result}
          language={language}
          onLanguageChange={setLanguage}
          onClose={() => setResult(null)}
          onExportPDF={handleExportPDF}
          isExporting={isExporting}
        />
      )}
    </div>
  );
}
