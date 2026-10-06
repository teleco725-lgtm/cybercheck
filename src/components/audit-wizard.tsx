"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import type { AuditType } from "@/lib/audits";

interface AuditWizardProps {
  audit: AuditType;
  language: "es" | "en" | "pt";
  onExecute: (answers: Record<string, string | string[]>) => Promise<void>;
  isExecuting: boolean;
  onClose: () => void;
}

export function AuditWizard({
  audit,
  language,
  onExecute,
  isExecuting,
  onClose,
}: AuditWizardProps) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [error, setError] = useState<string | null>(null);

  const questions = audit.wizardQuestions;
  const currentQuestion = questions[step];
  const isLastStep = step === questions.length - 1;

  const setAnswer = (id: string, value: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
    setError(null);
  };

  const validateCurrent = () => {
    if (!currentQuestion) return true;
    if (!currentQuestion.required) return true;
    const val = answers[currentQuestion.id];
    if (!val || (Array.isArray(val) && val.length === 0)) {
      setError("Esta pregunta es obligatoria");
      return false;
    }
    return true;
  };

  const next = () => {
    if (!validateCurrent()) return;
    if (step < questions.length - 1) setStep((s) => s + 1);
  };

  const back = () => {
    setError(null);
    if (step === 0) {
      onClose();
      return;
    }
    setStep((s) => s - 1);
  };

  const handleExecute = async () => {
    if (!validateCurrent()) return;
    await onExecute(answers);
  };

  const progress = Math.round(((step + 1) / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="w-full max-w-2xl bg-card rounded-2xl shadow-premium border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-br from-primary to-primary/70 text-primary-foreground p-6 relative overflow-hidden">
          <div className="absolute inset-0 grid-pattern opacity-20" aria-hidden />
          <div className="relative">
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest opacity-90 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              Configurando auditoría
            </div>
            <h2 className="text-xl sm:text-2xl font-bold leading-tight">{audit.name}</h2>
            <p className="text-sm opacity-90 mt-1">{audit.framework}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 bg-muted">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 min-h-[280px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentQuestion && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-xs">
                      Pregunta {step + 1} de {questions.length}
                    </Badge>
                    {currentQuestion.required && (
                      <span className="text-xs text-destructive">* Obligatoria</span>
                    )}
                  </div>
                  <Label htmlFor={currentQuestion.id} className="text-base font-semibold leading-relaxed">
                    {currentQuestion.label}
                  </Label>

                  {currentQuestion.type === "text" && (
                    <Input
                      id={currentQuestion.id}
                      placeholder={currentQuestion.placeholder}
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                      className="text-base"
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === "textarea" && (
                    <Textarea
                      id={currentQuestion.id}
                      placeholder={currentQuestion.placeholder}
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => setAnswer(currentQuestion.id, e.target.value)}
                      rows={4}
                      className="text-base resize-none"
                      autoFocus
                    />
                  )}

                  {currentQuestion.type === "select" && (
                    <Select
                      value={(answers[currentQuestion.id] as string) || ""}
                      onValueChange={(v) => setAnswer(currentQuestion.id, v)}
                    >
                      <SelectTrigger className="text-base h-12">
                        <SelectValue placeholder="Selecciona una opción" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentQuestion.options?.map((opt) => (
                          <SelectItem key={opt} value={opt} className="text-base py-3">
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}

                  {currentQuestion.type === "multiselect" && (
                    <div className="grid gap-2">
                      {currentQuestion.options?.map((opt) => {
                        const selected = ((answers[currentQuestion.id] as string[]) || []).includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              const current = (answers[currentQuestion.id] as string[]) || [];
                              const next = selected
                                ? current.filter((v) => v !== opt)
                                : [...current, opt];
                              setAnswer(currentQuestion.id, next);
                            }}
                            className={`text-left px-4 py-3 rounded-xl border transition-all ${
                              selected
                                ? "bg-primary text-primary-foreground border-primary shadow-premium-hover"
                                : "bg-card border-border hover:bg-accent/50"
                            }`}
                          >
                            <div className="flex items-center justify-between gap-3">
                              <span className="text-sm font-medium">{opt}</span>
                              {selected && (
                                <div className="h-5 w-5 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                                  <ChevronRight className="h-3 w-3" />
                                </div>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 flex items-center gap-2 text-sm text-destructive">
              <AlertCircle className="h-4 w-4" />
              {error}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between gap-3 p-6 border-t border-border bg-muted/30">
          <Button variant="ghost" onClick={back} disabled={isExecuting} className="gap-1">
            <ChevronLeft className="h-4 w-4" />
            {step === 0 ? "Cancelar" : "Atrás"}
          </Button>

          {!isLastStep ? (
            <Button onClick={next} className="gap-1">
              Continuar
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              onClick={handleExecute}
              disabled={isExecuting}
              className="gap-2 bg-gradient-to-r from-primary to-primary/80 hover:opacity-90 shadow-premium-hover"
              size="lg"
            >
              {isExecuting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Ejecutando con IA…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Ejecutar Auditoría con IA
                </>
              )}
            </Button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
