"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ForceGraph2D, {
  type ForceGraphMethods,
  type NodeObject,
} from "react-force-graph-2d";
import { forceX, forceY } from "d3-force";
import { buildBookBrainGraph, type BrainNode } from "@/data/book-brain";

type GraphNode = NodeObject<BrainNode>;

const COVER_W = 48;
const COVER_H = 72;
const AUDIO_S = 52;
const COVER_R = 4;
const HUB_R = 34;

function nodeBox(kind: BrainNode["kind"]) {
  if (kind === "listen") return { w: AUDIO_S, h: AUDIO_S };
  return { w: COVER_W, h: COVER_H };
}

function withAlpha(hex: string, alpha: number) {
  const h = hex.replace("#", "");
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = Number.parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const rr = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

function paintHub(
  node: GraphNode,
  ctx: CanvasRenderingContext2D,
  lit: boolean,
) {
  if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
  const nx = node.x as number;
  const ny = node.y as number;

  const r = HUB_R;
  ctx.beginPath();
  ctx.arc(nx, ny, r + (lit ? 8 : 4), 0, Math.PI * 2);
  ctx.fillStyle = lit ? "rgba(250, 219, 20, 0.22)" : "rgba(250, 219, 20, 0.1)";
  ctx.fill();

  ctx.beginPath();
  ctx.arc(nx, ny, r, 0, Math.PI * 2);
  ctx.fillStyle = "#141414";
  ctx.shadowColor = "rgba(250, 219, 20, 0.55)";
  ctx.shadowBlur = lit ? 22 : 14;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.strokeStyle = "rgba(250, 219, 20, 0.85)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = "#fafafa";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "600 11px Geist, system-ui, sans-serif";
  ctx.fillText("Paolo", nx, ny - 7);
  ctx.font = "500 10px Geist, system-ui, sans-serif";
  ctx.fillStyle = "rgba(250, 219, 20, 0.95)";
  ctx.fillText("Borzacchiello", nx, ny + 8);
}

export function BookBrainGraph({
  onOpenBook,
  onOpenAudio,
}: {
  onOpenBook?: (id: string) => void;
  onOpenAudio?: (id: string) => void;
}) {
  const graphRef = useRef<ForceGraphMethods<GraphNode> | undefined>(undefined);
  const wrapRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const [ready, setReady] = useState(false);
  const [imagesReady, setImagesReady] = useState(0);
  const [dims, setDims] = useState({ w: 960, h: 440 });
  const [hoverId, setHoverId] = useState<string | null>(null);

  const graphData = useMemo(() => {
    const raw = buildBookBrainGraph();
    return {
      nodes: raw.nodes.map((n) => ({ ...n })),
      links: raw.links.map((l) => ({ ...l })),
    };
  }, []);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    let cancelled = false;
    const map = imagesRef.current;
    map.clear();
    let loaded = 0;
    const media = graphData.nodes.filter(
      (n) => (n.kind === "book" || n.kind === "listen") && n.cover,
    );

    for (const node of media) {
      const img = new Image();
      img.decoding = "async";
      img.onload = () => {
        if (cancelled) return;
        loaded += 1;
        setImagesReady(loaded);
      };
      img.onerror = () => {
        if (cancelled) return;
        loaded += 1;
        setImagesReady(loaded);
      };
      img.src = node.cover!;
      map.set(node.id, img);
    }

    return () => {
      cancelled = true;
    };
  }, [graphData.nodes]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setDims({
        w: Math.max(320, Math.floor(r.width)),
        h: Math.max(360, Math.floor(r.height)),
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ready]);

  useEffect(() => {
    if (!ready) return;
    const t = window.setTimeout(() => {
      const g = graphRef.current;
      if (!g) return;
      const mobile = dims.w < 800;
      // Desktop: banda orizzontale (Y stretto, X libero).
      // Mobile: colonna verticale (X stretto, Y libero).
      g.d3Force("charge")?.strength(mobile ? -280 : -420);
      g.d3Force("link")?.distance(
        (link: {
          source?: string | { id?: string };
          target?: string | { id?: string };
        }) => {
          const s =
            typeof link.source === "object" ? link.source?.id : link.source;
          const tId =
            typeof link.target === "object" ? link.target?.id : link.target;
          if (s === "paolo" || tId === "paolo") return mobile ? 120 : 160;
          return mobile ? 88 : 110;
        },
      );
      g.d3Force("center")?.strength(0.02);
      g.d3Force("x", forceX(0).strength(mobile ? 0.16 : 0.015));
      g.d3Force("y", forceY(0).strength(mobile ? 0.018 : 0.12));
      g.d3ReheatSimulation();
      window.setTimeout(() => g.zoomToFit(500, mobile ? 28 : 36), 800);
    }, 60);
    return () => window.clearTimeout(t);
  }, [ready, dims.w, dims.h]);

  const paintNode = useCallback(
    (node: GraphNode, ctx: CanvasRenderingContext2D) => {
      if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
      const nx = node.x as number;
      const ny = node.y as number;

      const lit = hoverId === node.id;

      if (node.kind === "hub") {
        paintHub(node, ctx, lit);
        return;
      }

      const { w, h } = nodeBox(node.kind);
      const x = nx - w / 2;
      const y = ny - h / 2;
      const img = imagesRef.current.get(node.id);
      const ok = img && img.complete && img.naturalWidth > 0;
      const glow = node.glow ?? "#fadb14";
      const glowR = node.kind === "listen" ? 48 : 56;

      ctx.save();
      ctx.shadowColor = glow;
      ctx.shadowBlur = lit ? 36 : 26;
      drawRoundedRect(ctx, x - 3, y - 3, w + 6, h + 6, COVER_R + 2);
      ctx.fillStyle = withAlpha(glow, 0.32);
      ctx.fill();
      ctx.restore();

      const grad = ctx.createRadialGradient(nx, ny, 6, nx, ny, glowR);
      grad.addColorStop(0, withAlpha(glow, 0.48));
      grad.addColorStop(0.55, withAlpha(glow, 0.18));
      grad.addColorStop(1, withAlpha(glow, 0));
      ctx.beginPath();
      ctx.arc(nx, ny, glowR, 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.fill();

      drawRoundedRect(ctx, x, y, w, h, COVER_R);
      ctx.fillStyle = "#1a1a1a";
      ctx.fill();

      if (ok) {
        ctx.save();
        drawRoundedRect(ctx, x, y, w, h, COVER_R);
        ctx.clip();
        ctx.drawImage(img, x, y, w, h);
        ctx.restore();
      }

      if (lit) {
        drawRoundedRect(ctx, x - 1, y - 1, w + 2, h + 2, COVER_R + 1);
        ctx.strokeStyle = glow;
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }
    },
    [hoverId, imagesReady],
  );

  return (
    <div className="brain-stage" ref={wrapRef}>
      {ready ? (
        <ForceGraph2D<BrainNode>
          ref={graphRef}
          width={dims.w}
          height={dims.h}
          graphData={graphData}
          nodeId="id"
          nodeCanvasObject={paintNode}
          nodeCanvasObjectMode={() => "replace"}
          nodePointerAreaPaint={(node, color, ctx) => {
            if (!Number.isFinite(node.x) || !Number.isFinite(node.y)) return;
            const nx = node.x as number;
            const ny = node.y as number;
            ctx.fillStyle = color;
            if (node.kind === "hub") {
              ctx.beginPath();
              ctx.arc(nx, ny, HUB_R + 4, 0, Math.PI * 2);
              ctx.fill();
            } else {
              const { w, h } = nodeBox(node.kind);
              ctx.fillRect(nx - w / 2, ny - h / 2, w, h);
            }
          }}
          linkColor={() => "rgba(255, 255, 255, 0.28)"}
          linkWidth={0.75}
          linkDirectionalParticles={2}
          linkDirectionalParticleWidth={1.8}
          linkDirectionalParticleSpeed={0.004}
          linkDirectionalParticleColor={() => "rgba(250, 219, 20, 0.9)"}
          backgroundColor="rgba(0,0,0,0)"
          enableNodeDrag
          onNodeClick={(node) => {
            const n = node as BrainNode;
            if (n.kind === "book") onOpenBook?.(n.id);
            if (n.kind === "listen") onOpenAudio?.(n.id);
          }}
          onNodeHover={(node) => {
            const n = node as BrainNode | null;
            setHoverId(n ? String(n.id) : null);
          }}
          cooldownTicks={160}
          d3AlphaDecay={0.02}
          d3VelocityDecay={0.3}
        />
      ) : null}
    </div>
  );
}
