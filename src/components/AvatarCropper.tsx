import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useT } from "@/i18n";

const BOX = 256;
const OUTPUT = 512;

interface Props {
  open: boolean;
  file: File | null;
  onOpenChange: (open: boolean) => void;
  onCropped: (blob: Blob) => void;
  saving?: boolean;
}

export function AvatarCropper({ open, file, onOpenChange, onCropped, saving }: Props) {
  const t = useT();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const stateRef = useRef({ zoom: 1, x: 0, y: 0, baseScale: 1 });
  const dragRef = useRef<{ active: boolean; sx: number; sy: number; ox: number; oy: number }>({
    active: false,
    sx: 0,
    sy: 0,
    ox: 0,
    oy: 0,
  });
  const [zoom, setZoom] = useState(1);
  const [ready, setReady] = useState(false);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    const img = imageRef.current;
    if (!canvas || !img) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const scale = s.baseScale * s.zoom;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.clearRect(0, 0, BOX, BOX);
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, BOX, BOX);
    ctx.drawImage(img, BOX / 2 - w / 2 + s.x, BOX / 2 - h / 2 + s.y, w, h);
  }, []);

  useEffect(() => {
    if (!file || !open) return;
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      imageRef.current = img;
      stateRef.current = {
        zoom: 1,
        x: 0,
        y: 0,
        baseScale: Math.max(BOX / img.naturalWidth, BOX / img.naturalHeight),
      };
      setZoom(1);
      setReady(true);
      draw();
    };
    img.src = url;
    return () => URL.revokeObjectURL(url);
  }, [file, open, draw]);

  useEffect(() => {
    if (ready) draw();
  }, [ready, draw]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      const next = Math.min(4, Math.max(1, stateRef.current.zoom * Math.exp(-dy * 0.0015)));
      stateRef.current.zoom = next;
      setZoom(next);
      draw();
    };
    canvas.addEventListener("wheel", onWheel, { passive: false });
    return () => canvas.removeEventListener("wheel", onWheel);
  }, [draw, ready]);

  function onPointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    dragRef.current = {
      active: true,
      sx: e.clientX,
      sy: e.clientY,
      ox: stateRef.current.x,
      oy: stateRef.current.y,
    };
  }

  function onPointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!dragRef.current.active) return;
    stateRef.current.x = dragRef.current.ox + (e.clientX - dragRef.current.sx);
    stateRef.current.y = dragRef.current.oy + (e.clientY - dragRef.current.sy);
    draw();
  }

  function onPointerUp() {
    dragRef.current.active = false;
  }

  function handleZoom(value: number) {
    stateRef.current.zoom = value;
    setZoom(value);
    draw();
  }

  function handleValidate() {
    const img = imageRef.current;
    if (!img) return;
    const out = document.createElement("canvas");
    out.width = OUTPUT;
    out.height = OUTPUT;
    const ctx = out.getContext("2d");
    if (!ctx) return;
    const s = stateRef.current;
    const k = OUTPUT / BOX;
    const scale = s.baseScale * s.zoom * k;
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, OUTPUT, OUTPUT);
    ctx.drawImage(img, OUTPUT / 2 - w / 2 + s.x * k, OUTPUT / 2 - h / 2 + s.y * k, w, h);
    out.toBlob((blob) => blob && onCropped(blob), "image/jpeg", 0.9);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="font-sans">{t("common.recadrerPhoto")}</DialogTitle>
          <DialogDescription>{t("common.cropPhotoDesc")}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center gap-4">
          <div className="relative size-64 overflow-hidden rounded-full border border-border">
            <canvas
              ref={canvasRef}
              width={BOX}
              height={BOX}
              className="size-64 cursor-grab touch-none active:cursor-grabbing"
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
            />
          </div>
          <Slider
            value={[zoom]}
            min={1}
            max={4}
            step={0.01}
            onValueChange={(v) => handleZoom(v[0] ?? 1)}
            className="w-56"
            aria-label={t("common.zoom")}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("common.cancel")}
          </Button>
          <Button onClick={handleValidate} disabled={!ready || saving}>
            {saving ? t("common.saving") : t("common.save")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
