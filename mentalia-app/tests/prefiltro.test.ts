import { describe, it, expect } from "vitest";
import { detectaSenalAlerta } from "@/lib/preFiltroRiesgo";

describe("preFiltroRiesgo (pre-filtro barato del diario)", () => {
  it("detecta señales de alerta", () => {
    const señales = [
      "no quiero vivir",
      "quiero matarme",
      "pienso en suicidarme",
      "ya no aguanto mas",
      "quiero desaparecer",
      "me quiero hacer daño",
      "nada tiene sentido",
      "estarían mejor sin mí",
    ];
    for (const s of señales) expect(detectaSenalAlerta(s), s).toBe(true);
  });

  it("normaliza tildes y mayúsculas (sesgo a la seguridad)", () => {
    expect(detectaSenalAlerta("No Quiero VIVIR más")).toBe(true);
    expect(detectaSenalAlerta("me quiero hacer DAÑO")).toBe(true);
  });

  it("NO dispara con entradas normales", () => {
    const normales = [
      "Hoy fue un buen día, agradecido por mi familia",
      "estoy un poco cansado pero bien",
      "aprendí algo nuevo en el trabajo",
      "",
      null,
    ];
    for (const s of normales) expect(detectaSenalAlerta(s as any), String(s)).toBe(false);
  });
});
