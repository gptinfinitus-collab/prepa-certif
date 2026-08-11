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
import { CPD_TYPES, type CpdEntry, type CpdEntryInput } from "@/lib/cpd";

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

/** Formulaire de création / modification d'une entrée CPD. */
export function CpdEntryDialog({
  open,
  onOpenChange,
  entry,
  onSubmit,
  saving,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  entry: CpdEntry | null;
  onSubmit: (input: CpdEntryInput) => void;
  saving: boolean;
}) {
  const [date, setDate] = useState(todayIso());
  const [title, setTitle] = useState("");
  const [type, setType] = useState<string>("Formation");
  const [hours, setHours] = useState("1");
  const [reference, setReference] = useState("");
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setDate(entry?.date ?? todayIso());
    setTitle(entry?.title ?? "");
    setType(entry?.type ?? "Formation");
    setHours(entry ? String(entry.hours) : "1");
    setReference(entry?.reference ?? "");
    setNotes(entry?.notes ?? "");
  }, [open, entry]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsedHours = Number(hours.replace(",", "."));
    if (!date) return setError("La date est requise.");
    if (!title.trim()) return setError("L'intitulé de l'activité est requis.");
    if (!Number.isFinite(parsedHours) || parsedHours <= 0) {
      return setError("Indiquez un nombre d'heures supérieur à 0.");
    }
    setError(null);
    onSubmit({
      ...(entry ? { id: entry.id } : {}),
      date,
      title: title.trim(),
      type,
      hours: parsedHours,
      reference: reference.trim() || null,
      notes: notes.trim() || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-[92vw] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{entry ? "Modifier l'entrée" : "Nouvelle entrée CPD"}</DialogTitle>
          <DialogDescription>
            Consignez une activité de développement professionnel continu.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpd-date">Date</Label>
              <Input
                id="cpd-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpd-hours">Heures</Label>
              <Input
                id="cpd-hours"
                type="number"
                inputMode="decimal"
                step="0.25"
                min="0"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-title">Intitulé de l'activité</Label>
            <Input
              id="cpd-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex. Audit interne ISO 45001 — site de Lyon"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-type">Type d'activité</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="cpd-type">
                <SelectValue placeholder="Choisir un type" />
              </SelectTrigger>
              <SelectContent>
                {CPD_TYPES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {value}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-reference">Référence ou preuve (optionnel)</Label>
            <Input
              id="cpd-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder="Certificat, rapport d'audit, lien…"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-notes">Notes (optionnel)</Label>
            <Textarea
              id="cpd-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Enseignements tirés, compétences développées…"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Enregistrement…" : entry ? "Enregistrer" : "Ajouter"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
