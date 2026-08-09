import type { AdminUserRow } from "@/lib/admin.functions";

export type AdminSortKey = "createdAt" | "lastSignInAt" | "name" | "activity";

export interface AdminStats {
  total: number;
  signupsLast7: number;
  signupsLast30: number;
  activeLast7: number;
  disabled: number;
}

const DAY = 24 * 3600 * 1000;

/** Synthèse des comptes affichée en haut de l'espace d'administration. */
export function computeAdminStats(users: AdminUserRow[], now = Date.now()): AdminStats {
  const since = (days: number) => now - days * DAY;
  return {
    total: users.length,
    signupsLast7: users.filter((u) => Date.parse(u.createdAt) >= since(7)).length,
    signupsLast30: users.filter((u) => Date.parse(u.createdAt) >= since(30)).length,
    activeLast7: users.filter(
      (u) => !!u.lastSignInAt && Date.parse(u.lastSignInAt) >= since(7),
    ).length,
    disabled: users.filter((u) => u.disabled).length,
  };
}

/** Recherche par nom ou e-mail, insensible à la casse et aux espaces. */
export function filterAdminUsers(users: AdminUserRow[], search: string): AdminUserRow[] {
  const q = search.trim().toLowerCase();
  if (!q) return users;
  return users.filter(
    (u) => u.email.toLowerCase().includes(q) || (u.displayName ?? "").toLowerCase().includes(q),
  );
}

function activityOf(u: AdminUserRow) {
  return u.modulesCompleted + u.quizSessions + u.documentsCount;
}

/** Tri du tableau des comptes. */
export function sortAdminUsers(
  users: AdminUserRow[],
  key: AdminSortKey,
  direction: "asc" | "desc" = "desc",
): AdminUserRow[] {
  const sign = direction === "asc" ? 1 : -1;
  return [...users].sort((a, b) => {
    let diff = 0;
    if (key === "name") {
      diff = (a.displayName ?? a.email).localeCompare(b.displayName ?? b.email, "fr");
    } else if (key === "activity") {
      diff = activityOf(a) - activityOf(b);
    } else {
      diff = (Date.parse(a[key] ?? "") || 0) - (Date.parse(b[key] ?? "") || 0);
    }
    return diff * sign;
  });
}
