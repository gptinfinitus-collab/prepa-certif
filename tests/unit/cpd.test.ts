import { describe, expect, it } from "vitest";
import {
  availableYears,
  hoursByType,
  toCsv,
  totalHours,
  formatHours,
  type CpdEntry,
} from "@/lib/cpd";

const entries: CpdEntry[] = [
  { id: "1", date: "2026-03-04", title: "Audit interne", type: "Audit", hours: 7.5, reference: "RA-12", notes: null },
  { id: "2", date: "2026-01-10", title: 'Lecture "ISO 19011"', type: "Lecture", hours: 2, reference: null, notes: "Chap. 6" },
  { id: "3", date: "2025-11-02", title: "Formation LA", type: "Formation", hours: 40, reference: null, notes: null },
];

describe("cpd", () => {
  it("liste les années des entrées plus l'année en cours, décroissantes", () => {
    expect(availableYears(entries, 2027)).toEqual([2027, 2026, 2025]);
    expect(availableYears([], 2026)).toEqual([2026]);
  });

  it("totalise les heures", () => {
    expect(totalHours(entries)).toBe(49.5);
    expect(totalHours([])).toBe(0);
  });

  it("agrège les heures par type par ordre décroissant", () => {
    expect(hoursByType(entries)).toEqual([
      { type: "Formation", hours: 40 },
      { type: "Audit", hours: 7.5 },
      { type: "Lecture", hours: 2 },
    ]);
  });

  it("génère un CSV avec en-têtes et guillemets échappés", () => {
    const lines = toCsv(entries, {
      date: "Date",
      activity: "Activité",
      type: "Type",
      hours: "Heures",
      reference: "Référence",
      notes: "Notes",
    }).split("\r\n");
    expect(lines[0]).toBe('"Date";"Activité";"Type";"Heures";"Référence";"Notes"');
    expect(lines[1]).toBe('"2026-03-04";"Audit interne";"Audit";"7.5";"RA-12";""');
    expect(lines[2]).toContain('"Lecture ""ISO 19011"""');
  });

  it("formate les heures en français", () => {
    expect(formatHours(2)).toBe("2 h");
    expect(formatHours(7.5)).toBe("7,5 h");
  });
});
