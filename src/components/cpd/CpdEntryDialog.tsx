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
import { useT } from "@/i18n";

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
  const t = useT();
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
    if (!date) return setError(t("cpd.dateRequired"));
    if (!title.trim()) return setError(t("cpd.titleRequired"));
    if (!Number.isFinite(parsedHours) || parsedHours <= 0) {
      return setError(t("cpd.hoursMustBePositive"));
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
          <DialogTitle>{entry ? t("cpd.editEntryDialogTitle") : t("cpd.newEntryDialogTitle")}</DialogTitle>
          <DialogDescription>{t("cpd.entryDialogDesc")}</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="cpd-date">{t("cpd.date")}</Label>
              <Input
                id="cpd-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="cpd-hours">{t("cpd.hoursLabel")}</Label>
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
            <Label htmlFor="cpd-title">{t("cpd.activityTitleLabel")}</Label>
            <Input
              id="cpd-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("cpd.activityTitlePlaceholder")}
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-type">{t("cpd.activityTypeLabel")}</Label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger id="cpd-type">
                <SelectValue placeholder={t("cpd.chooseType")} />
              </SelectTrigger>
              <SelectContent>
                {CPD_TYPES.map((value) => (
                  <SelectItem key={value} value={value}>
                    {t(`cpd.types.${value}`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-reference">{t("cpd.referenceLabel")}</Label>
            <Input
              id="cpd-reference"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
              placeholder={t("cpd.referencePlaceholder")}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="cpd-notes">{t("cpd.notesLabel")}</Label>
            <Textarea
              id="cpd-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder={t("cpd.notesPlaceholder")}
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t("common.cancel")}
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? t("common.saving") : entry ? t("common.save") : t("common.add")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
