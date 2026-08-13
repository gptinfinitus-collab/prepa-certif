import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Utilisateur courant lu depuis la session locale (aucun aller-retour réseau).
 *
 * `supabase.auth.getUser()` appelle `/auth/v1/user` à chaque invocation : appelé
 * par chaque requête de données, il ajoutait un aller-retour réseau avant la
 * moindre lecture, ce qui ralentissait l'ouverture de chaque page. La session
 * locale est déjà validée et rafraîchie par le client Supabase.
 *
 * Signature identique à `getUser()` pour rester interchangeable.
 */
export async function getAuthUser(): Promise<{ data: { user: User | null } }> {
  const { data } = await supabase.auth.getSession();
  return { data: { user: data.session?.user ?? null } };
}
