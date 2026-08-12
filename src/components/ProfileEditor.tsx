import { translateAppError } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AvatarCropper } from "@/components/AvatarCropper";
import { useProfile, useUpdateProfile, useUploadAvatar } from "@/lib/queries";
import { useT } from "@/i18n";
import { Camera } from "lucide-react";

export function initialsOf(first?: string | null, last?: string | null, email?: string | null) {
  const a = (first ?? "").trim().charAt(0);
  const b = (last ?? "").trim().charAt(0);
  const initials = `${a}${b}`.toUpperCase();
  if (initials) return initials;
  return (email ?? "?").charAt(0).toUpperCase();
}

export function ProfileEditor() {
  const t = useT();
  const { data: profile } = useProfile();
  const updateProfile = useUpdateProfile();
  const uploadAvatar = useUploadAvatar();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [cropOpen, setCropOpen] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setFirstName(profile.first_name ?? "");
    setLastName(profile.last_name ?? "");
  }, [profile?.first_name, profile?.last_name]);

  async function handleSave() {
    try {
      await updateProfile.mutateAsync({ first_name: firstName.trim(), last_name: lastName.trim() });
      toast.success(t("common.profileUpdated"));
    } catch (error) {
      toast.error(translateAppError(t, error, "common.saveImpossible"));
    }
  }

  async function handleCropped(blob: Blob) {
    try {
      await uploadAvatar.mutateAsync(blob);
      setCropOpen(false);
      setFile(null);
      toast.success(t("common.photoUpdated"));
    } catch (error) {
      toast.error(translateAppError(t, error, "common.sendImpossible"));
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center gap-4">
        <div className="relative">
          <Avatar className="size-20 border border-border">
            <AvatarImage src={profile?.avatarSignedUrl ?? undefined} alt={t("common.profilePicture")} />
            <AvatarFallback className="text-lg">
              {initialsOf(profile?.first_name, profile?.last_name, profile?.email)}
            </AvatarFallback>
          </Avatar>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="absolute -bottom-1 -right-1 grid size-8 place-items-center rounded-full border border-border bg-primary text-primary-foreground shadow-sm transition-opacity hover:opacity-90"
            aria-label={t("common.changePhoto")}
          >
            <Camera className="size-4" aria-hidden />
          </button>
        </div>
        <div className="min-w-0">
          <p className="font-sans text-lg font-semibold">
            {[profile?.first_name, profile?.last_name].filter(Boolean).join(" ") || t("common.yourName")}
          </p>
          <p className="truncate text-sm text-muted-foreground">{profile?.email}</p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) {
              setFile(f);
              setCropOpen(true);
            }
            e.target.value = "";
          }}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">{t("common.firstName")}</Label>
          <Input id="firstName" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">{t("common.lastName")}</Label>
          <Input id="lastName" value={lastName} onChange={(e) => setLastName(e.target.value)} />
        </div>
      </div>

      <Button onClick={handleSave} disabled={updateProfile.isPending}>
        {updateProfile.isPending ? t("common.saving") : t("common.save")}
      </Button>

      <AvatarCropper
        open={cropOpen}
        file={file}
        onOpenChange={(o) => {
          setCropOpen(o);
          if (!o) setFile(null);
        }}
        onCropped={handleCropped}
        saving={uploadAvatar.isPending}
      />
    </div>
  );
}
