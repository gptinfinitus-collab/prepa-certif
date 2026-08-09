import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  deleteUserAccount,
  getMyAdminStatus,
  listAdminUsers,
  setUserDisabled,
} from "@/lib/admin.functions";
import { useSession } from "@/lib/queries";

/** Statut super administrateur de l'utilisateur connecté. */
export function useIsSuperAdmin() {
  const { data: user } = useSession();
  const fn = useServerFn(getMyAdminStatus);
  const query = useQuery({
    queryKey: ["admin", "status", user?.id],
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => (await fn()).isSuperAdmin,
  });
  return query.data === true;
}

/** Liste des comptes pour le tableau de bord d'administration. */
export function useAdminUsers(enabled: boolean) {
  const fn = useServerFn(listAdminUsers);
  return useQuery({
    queryKey: ["admin", "users"],
    enabled,
    queryFn: () => fn(),
  });
}

/** Active / désactive un compte. */
export function useToggleUserDisabled() {
  const fn = useServerFn(setUserDisabled);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { userId: string; disabled: boolean }) => fn({ data: vars }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}

/** Supprime définitivement un compte. */
export function useDeleteUser() {
  const fn = useServerFn(deleteUserAccount);
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (userId: string) => fn({ data: { userId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin", "users"] }),
  });
}
