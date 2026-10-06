"use client";

import { useState, useEffect } from "react";
import { Palette, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PALETTES, type PaletteName } from "@/lib/audits";

export function ThemeToggle() {
  const [current, setCurrent] = useState<PaletteName>(() => {
    if (typeof window === "undefined") return "azul";
    const saved = localStorage.getItem("cybercheck-palette") as PaletteName | null;
    return saved === "azul" || saved === "verde" ? saved : "azul";
  });

  const applyPalette = (p: PaletteName) => {
    if (typeof document === "undefined") return;
    const body = document.body;
    body.classList.remove("palette-azul", "palette-verde");
    body.classList.add(`palette-${p}`);
    localStorage.setItem("cybercheck-palette", p);
  };

  useEffect(() => {
    applyPalette(current);
  }, [current]);

  const switchTo = (p: PaletteName) => {
    setCurrent(p);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 bg-card/70 backdrop-blur-sm border-border hover:bg-accent"
        >
          <Palette className="h-4 w-4 text-primary" />
          <span className="hidden sm:inline">Paleta</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel className="text-xs uppercase tracking-wider text-muted-foreground">
          Diseño visual
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {(Object.keys(PALETTES) as PaletteName[]).map((key) => {
          const p = PALETTES[key];
          const isActive = current === key;
          return (
            <DropdownMenuItem
              key={key}
              onClick={() => switchTo(key)}
              className="flex flex-col items-start gap-1 cursor-pointer py-3"
            >
              <div className="flex items-center gap-2 w-full">
                <div className="flex gap-1">
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ background: p.primary }}
                    aria-hidden
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ background: p.accent }}
                    aria-hidden
                  />
                  <div
                    className="h-4 w-4 rounded-full border border-border"
                    style={{ background: p.gradientTo }}
                    aria-hidden
                  />
                </div>
                <span className="font-medium text-sm flex-1">{p.name}</span>
                {isActive && <Check className="h-4 w-4 text-primary" />}
              </div>
              <span className="text-xs text-muted-foreground">{p.description}</span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
