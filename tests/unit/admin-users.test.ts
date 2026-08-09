import { describe, expect, it } from "vitest";
import type { AdminUserRow } from "@/lib/admin.functions";
import { computeAdminStats, filterAdminUsers, sortAdminUsers } from "@/lib/admin-users";

const NOW = Date.parse("2026-08-09T12:00:00Z");
const daysAgo = (d: number) => new Date(NOW - d * 24 * 3600 * 1000).toISOString();

function user(overrides: Partial<AdminUserRow>): AdminUserRow {
  return {
    id: crypto.randomUUID(),
    email: "test@example.com",
    displayName: null,
    createdAt: daysAgo(100),
    lastSignInAt: null,
    provider: "email",
    disabled: false,
    isSuperAdmin: false,
    activeCertification: null,
    activeTrack: null,
    modulesCompleted: 0,
    quizSessions: 0,
    documentsCount: 0,
    ...overrides,
  };
}

const users: AdminUserRow[] = [
  user({ email: "alice@example.com", displayName: "Alice Martin", createdAt: daysAgo(2), lastSignInAt: daysAgo(1), modulesCompleted: 5, quizSessions: 3, documentsCount: 2 }),
  user({ email: "bob@example.com", displayName: "Bob Durand", createdAt: daysAgo(20), lastSignInAt: daysAgo(15), modulesCompleted: 1 }),
  user({ email: "carla@example.com", displayName: "Carla Nguyen", createdAt: daysAgo(200), disabled: true }),
];

describe("computeAdminStats", () => {
  it("compte les inscriptions récentes, les connexions et les comptes désactivés", () => {
    const stats = computeAdminStats(users, NOW);
    expect(stats).toEqual({
      total: 3,
      signupsLast7: 1,
      signupsLast30: 2,
      activeLast7: 1,
      disabled: 1,
    });
  });

  it("renvoie des compteurs nuls sans utilisateur", () => {
    expect(computeAdminStats([], NOW).total).toBe(0);
  });
});

describe("filterAdminUsers", () => {
  it("cherche par e-mail et par nom, sans tenir compte de la casse", () => {
    expect(filterAdminUsers(users, " ALICE ").map((u) => u.email)).toEqual(["alice@example.com"]);
    expect(filterAdminUsers(users, "durand").map((u) => u.email)).toEqual(["bob@example.com"]);
  });

  it("renvoie tout le monde sans recherche", () => {
    expect(filterAdminUsers(users, "")).toHaveLength(3);
  });
});

describe("sortAdminUsers", () => {
  it("trie par date d'inscription décroissante par défaut", () => {
    expect(sortAdminUsers(users, "createdAt").map((u) => u.email)[0]).toBe("alice@example.com");
  });

  it("inverse l'ordre en ascendant", () => {
    expect(sortAdminUsers(users, "createdAt", "asc").map((u) => u.email)[0]).toBe(
      "carla@example.com",
    );
  });

  it("trie par activité cumulée", () => {
    expect(sortAdminUsers(users, "activity").map((u) => u.email)).toEqual([
      "alice@example.com",
      "bob@example.com",
      "carla@example.com",
    ]);
  });

  it("trie par nom et ne modifie pas le tableau source", () => {
    const source = [...users];
    expect(sortAdminUsers(users, "name", "asc").map((u) => u.displayName)).toEqual([
      "Alice Martin",
      "Bob Durand",
      "Carla Nguyen",
    ]);
    expect(users).toEqual(source);
  });

  it("place les comptes sans connexion en dernier en tri décroissant", () => {
    expect(sortAdminUsers(users, "lastSignInAt").map((u) => u.email).at(-1)).toBe(
      "carla@example.com",
    );
  });
});
