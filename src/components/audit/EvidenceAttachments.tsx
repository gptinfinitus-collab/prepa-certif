import { useRef, useState } from "react";
import { Loader2, Paperclip, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useT } from "@/i18n";
import {
  ACCEPT_ATTRIBUTE,
  attachmentUrl,
  formatBytes,
  useDeleteAttachment,
  useUploadAttachment,
  type AuditAttachment,
} from "@/lib/audit-attachments";

interface Props {
  checklistId: string;
  itemId: string;
  attachments: AuditAttachment[];
}

/** Pièces jointes de preuve d'une ligne de check-list. */
export function EvidenceAttachments({ checklistId, itemId, attachments }: Props) {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const upload = useUploadAttachment(checklistId);
  const remove = useDeleteAttachment(checklistId);
  const [busyId, setBusyId] = useState<string | null>(null);

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      try {
        await upload.mutateAsync({ itemId, file });
      } catch (error) {
        const code = error instanceof Error ? error.message : "";
        toast.error(
          code === "tooLarge"
            ? t("audit.attachments.tooLarge")
            : code === "badType"
              ? t("audit.attachments.badType")
              : t("audit.attachments.uploadError"),
        );
      }
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function open(attachment: AuditAttachment) {
    setBusyId(attachment.id);
    const url = await attachmentUrl(attachment.storage_path);
    setBusyId(null);
    if (!url) {
      toast.error(t("audit.attachments.openError"));
      return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-muted-foreground">
          {t("audit.attachments.title")}
        </span>
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="h-8 shrink-0 px-2 text-xs print:hidden"
          disabled={upload.isPending}
          onClick={() => inputRef.current?.click()}
        >
          {upload.isPending ? (
            <Loader2 className="mr-1 h-4 w-4 animate-spin" />
          ) : (
            <Paperclip className="mr-1 h-4 w-4" />
          )}
          {t("audit.attachments.add")}
        </Button>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        accept={ACCEPT_ATTRIBUTE}
        onChange={(event) => void onFiles(event.target.files)}
      />

      {attachments.length === 0 ? (
        <p className="text-xs text-muted-foreground">{t("audit.attachments.empty")}</p>
      ) : (
        <ul className="space-y-1">
          {attachments.map((attachment) => (
            <li
              key={attachment.id}
              className="flex items-center gap-2 rounded-md border border-border/70 bg-background px-2 py-1.5"
            >
              <Paperclip className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left text-xs hover:underline"
                onClick={() => void open(attachment)}
              >
                {attachment.file_name}
              </button>
              <span className="shrink-0 text-[11px] text-muted-foreground tabular-nums">
                {formatBytes(attachment.size_bytes)}
              </span>
              {busyId === attachment.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 w-7 shrink-0 p-0 print:hidden"
                aria-label={t("audit.attachments.delete")}
                disabled={remove.isPending}
                onClick={() => {
                  if (!window.confirm(t("audit.attachments.deleteConfirm"))) return;
                  remove.mutate(attachment, {
                    onError: () => toast.error(t("audit.attachments.deleteError")),
                  });
                }}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <p className="text-[11px] text-muted-foreground print:hidden">{t("audit.attachments.hint")}</p>
    </div>
  );
}
