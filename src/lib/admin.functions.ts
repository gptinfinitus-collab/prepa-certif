import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export interface AdminUserRow {
  id: string;
  email: string;
  displayName: string | null;
  createdAt: string;
  lastSignInAt: string | null;
  provider: string | null;
  disabled: boolean;
  isSuperAdmin: boolean;
  activeCertification: string | null;
  activeTrack: string | null;
  modulesCompleted: number;
  quizSessions: number;
  documentsCount: number;
}

/** Vérifie que l'appelant possède le rôle super administrateur. */
async function assertSuperAdmin(supabase: {
  rpc: (fn: "has_role", args: { _user_id: string; _role: "super_admin" }) => PromiseLike<{
    data: boolean | null;
    error: { message: string } | null;
  }>;
}, userId: string) {
  const { data, error } = await supabase.rpc("has_role", {
    _user_id: userId,
    _role: "super_admin",
  });
  if (error) throw new Error(error.message);
  if (!data) throw new Error("accessDenied");
}

/** Indique si l'utilisateur connecté est super administrateur. */
export const getMyAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "super_admin",
    });
    return { isSuperAdmin: data === true };
  });

/** Liste tous les comptes avec leur activité (super administrateur uniquement). */
export const listAdminUsers = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUserRow[]> => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const authUsers: Array<{
      id: string;
      email?: string | null;
      created_at: string;
      last_sign_in_at?: string | null;
      app_metadata?: { provider?: string } | null;
    }> = [];
    for (let page = 1; page <= 20; page += 1) {
      const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      authUsers.push(...data.users);
      if (data.users.length < 200) break;
    }

    const [profiles, roles, certs, progress, sessions, documents] = await Promise.all([
      supabaseAdmin.from("profiles").select("id, display_name, first_name, last_name, active_track, disabled_at"),
      supabaseAdmin.from("user_roles").select("user_id, role"),
      supabaseAdmin.from("user_certifications").select("user_id, certification_id, is_active"),
      supabaseAdmin.from("module_progress").select("user_id, completed"),
      supabaseAdmin.from("quiz_sessions").select("user_id"),
      supabaseAdmin.from("library_documents").select("user_id"),
    ]);

    const profileById = new Map((profiles.data ?? []).map((p) => [p.id, p]));
    const superAdmins = new Set(
      (roles.data ?? []).filter((r) => r.role === "super_admin").map((r) => r.user_id),
    );
    const activeCert = new Map(
      (certs.data ?? []).filter((c) => c.is_active).map((c) => [c.user_id, c.certification_id]),
    );
    const completed = new Map<string, number>();
    for (const row of progress.data ?? []) {
      if (row.completed) completed.set(row.user_id, (completed.get(row.user_id) ?? 0) + 1);
    }
    const quizzes = new Map<string, number>();
    for (const row of sessions.data ?? []) {
      quizzes.set(row.user_id, (quizzes.get(row.user_id) ?? 0) + 1);
    }
    const docs = new Map<string, number>();
    for (const row of documents.data ?? []) {
      docs.set(row.user_id, (docs.get(row.user_id) ?? 0) + 1);
    }

    return authUsers
      .map((u) => {
        const profile = profileById.get(u.id);
        const name =
          [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
          profile?.display_name ||
          null;
        return {
          id: u.id,
          email: u.email ?? "",
          displayName: name,
          createdAt: u.created_at,
          lastSignInAt: u.last_sign_in_at ?? null,
          provider: u.app_metadata?.provider ?? null,
          disabled: !!profile?.disabled_at,
          isSuperAdmin: superAdmins.has(u.id),
          activeCertification: activeCert.get(u.id) ?? null,
          activeTrack: profile?.active_track ?? null,
          modulesCompleted: completed.get(u.id) ?? 0,
          quizSessions: quizzes.get(u.id) ?? 0,
          documentsCount: docs.get(u.id) ?? 0,
        };
      })
      .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  });

/** Active ou désactive un compte utilisateur. */
export const setUserDisabled = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) =>
    z.object({ userId: z.string().uuid(), disabled: z.boolean() }).parse(data),
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("cannotDisableSelf");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const { error: banError } = await supabaseAdmin.auth.admin.updateUserById(data.userId, {
      ban_duration: data.disabled ? "876000h" : "none",
    });
    if (banError) throw new Error(banError.message);

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({ disabled_at: data.disabled ? new Date().toISOString() : null })
      .eq("id", data.userId);
    if (error) throw new Error(error.message);
    return { ok: true, disabled: data.disabled };
  });

/** Supprime définitivement un compte utilisateur et ses données. */
export const deleteUserAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => z.object({ userId: z.string().uuid() }).parse(data))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("cannotDeleteSelf");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { error } = await supabaseAdmin.auth.admin.deleteUser(data.userId);
    if (error) throw new Error(error.message);
    return { ok: true };
  });
