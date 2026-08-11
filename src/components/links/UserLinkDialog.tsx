import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { LINK_CATEGORIES } from "@/data/useful-links";
import { isValidUrl, type UserLink, type UserLinkInput } from "@/lib/useful-links";

/** Formulaire de création / modification d'un lien personnel. */
export function UserLinkDialog({
  open,
  onOpenChange,
  link,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  link: UserLink | null;
  onSubmit: (input: UserLinkInput) => void;
  saving: boolean;
}) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [category, setCategory] = useState<string>("Autre");
  const [note, setNote] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setTitle(link?.title ?? "");
    setUrl(link?.url ?? "");
    setCategory(link?.category ?? "Autre");
    setNote(link?.note ?? "");
  }, [open, link]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return setError("Le titre est requis.");
    if (!isValidUrl(url)) return setError("Indiquez une adresse web valide (http ou https).");
    setError(null);
    onSubmit({
      ...(link ? { id: link.id } : {}),
      title: title.trim(),
      url: url.trim(),
      category,
      note: note.trim() ? note.trim() : null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-sans">
            {link ? "Modifier le lien" : "Ajouter un lien"}
          </DialogTitle>
          <DialogDescription>
            Vos liens personnels restent privés : vous seul pouvez les consulter.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="link-title">Titre</Label>
            <Input
              id="link-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Guide d'audit interne"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-url">Adresse (URL)</Label>
            <Input
              id="link-url"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://exemple.org/ressource"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-category">Catégorie</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="link-category">
                <SelectValue placeholder="Choisir une catégorie" />
              </SelectTrigger>
              <SelectContent>
                {LINK_CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="link-note">Note (facultatif)</Label>
            <Textarea
              id="link-note"
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Pourquoi ce lien est utile pour votre préparation"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : link ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
