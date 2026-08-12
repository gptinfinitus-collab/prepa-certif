import { describe, expect, it } from "vitest";
import {
  MAX_MODULES_PER_DAY,
  ONBOARDING_STEPS,
  countStudyDaysBetween,
  needsOnboarding,
  paceSummary,
  suggestPlan,
  toggleStudyDay,
} from "@/lib/onboarding";

const monday = new Date(2026, 0, 5); // lundi 5 janvier 2026

describe("needsOnboarding", () => {
  it("affiche l'écran tant qu'il n'a pas été suivi", () => {
    expect(needsOnboarding({ onboardedAt: null, hasCertification: false })).toBe(true);
    expect(needsOnboarding({ onboardedAt: null, hasCertification: true })).toBe(true);
  });

  it("ne réaffiche pas l'écran une fois terminé ou passé", () => {
    expect(
      needsOnboarding({ onboardedAt: "2026-01-01T00:00:00Z", hasCertification: true }),
    ).toBe(false);
  });

  it("réapparaît si l'utilisateur ne suit plus aucune certification", () => {
    expect(
      needsOnboarding({ onboardedAt: "2026-01-01T00:00:00Z", hasCertification: false }),
    ).toBe(true);
  });
});

describe("toggleStudyDay", () => {
  it("ajoute et retire un jour en gardant l'ordre semaine", () => {
    expect(toggleStudyDay([1, 2], 6)).toEqual([1, 2, 6]);
    expect(toggleStudyDay([1, 2, 6], 2)).toEqual([1, 6]);
    expect(toggleStudyDay([1, 0], 1)).toEqual([0]);
  });

  it("refuse de vider la sélection", () => {
    expect(toggleStudyDay([3], 3)).toEqual([3]);
  });
});

describe("countStudyDaysBetween", () => {
  it("compte les jours de révision bornes incluses", () => {
    const sunday = new Date(2026, 0, 11);
    expect(countStudyDaysBetween(monday, sunday, [1, 2, 3, 4, 5])).toBe(5);
    expect(countStudyDaysBetween(monday, sunday, [6, 0])).toBe(2);
  });

  it("retourne 0 si la fin précède le début", () => {
    expect(countStudyDaysBetween(new Date(2026, 0, 10), monday, [1])).toBe(0);
  });
});

describe("suggestPlan", () => {
  it("propose une séance par jour sans date d'examen", () => {
    const plan = suggestPlan({ today: monday, examDate: null, studyDays: [1, 3], moduleCount: 20 });
    expect(plan.modules_per_day).toBe(1);
    expect(plan.exam_date).toBeNull();
    expect(plan.start_date).toBe("2026-01-05");
  });

  it("compresse le rythme pour tenir la date d'examen", () => {
    const plan = suggestPlan({
      today: monday,
      examDate: "2026-01-17",
      studyDays: [1, 2, 3, 4, 5],
      moduleCount: 20,
    });
    // 10 jours de révision jusqu'au 16 janvier -> 2 séances par jour
    expect(plan.modules_per_day).toBe(2);
  });

  it("plafonne le rythme quotidien", () => {
    const plan = suggestPlan({
      today: monday,
      examDate: "2026-01-07",
      studyDays: [1, 2, 3, 4, 5],
      moduleCount: 100,
    });
    expect(plan.modules_per_day).toBe(MAX_MODULES_PER_DAY);
  });

  it("retombe sur les jours par défaut si aucun jour n'est choisi", () => {
    const plan = suggestPlan({ today: monday, examDate: null, studyDays: [], moduleCount: 5 });
    expect(plan.study_days).toEqual([1, 2, 3, 4, 5]);
  });
});

describe("paceSummary", () => {
  it("signale un rythme tenable", () => {
    const plan = suggestPlan({
      today: monday,
      examDate: "2026-01-17",
      studyDays: [1, 2, 3, 4, 5],
      moduleCount: 20,
    });
    expect(paceSummary(plan, 20, monday).key).toBe("paceSpread");
  });

  it("alerte quand le temps disponible est insuffisant", () => {
    const plan = { ...suggestPlan({ today: monday, examDate: "2026-01-07", studyDays: [1], moduleCount: 40 }), modules_per_day: 1 };
    expect(paceSummary(plan, 40, monday).key).toBe("paceTight");
  });
});

describe("ONBOARDING_STEPS", () => {
  it("suit l'ordre certification → niveau → planning", () => {
    expect(ONBOARDING_STEPS.map((s) => s.id)).toEqual(["certification", "track", "planning"]);
  });
});
