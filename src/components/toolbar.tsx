import type { EraId, LayoutId, ScopeId } from "@/data/types";
import { ERAS } from "@/data/eras";

export function Toolbar({
  scope,
  layout,
  era,
  onScope,
  onLayout,
  onEra,
}: {
  scope: ScopeId;
  layout: LayoutId;
  era: EraId | "all";
  onScope: (scope: ScopeId) => void;
  onLayout: (layout: LayoutId) => void;
  onEra: (era: EraId | "all") => void;
}) {
  return (
    <div className="toolbar">
      <div className="view-toggle" role="group" aria-label="Contenuto">
        <button
          type="button"
          className="view-btn"
          aria-pressed={scope === "libri"}
          onClick={() => onScope("libri")}
        >
          Volumi
        </button>
        <button
          type="button"
          className="view-btn"
          aria-pressed={scope === "audio"}
          onClick={() => onScope("audio")}
        >
          Audio
        </button>
        <button
          type="button"
          className="view-btn"
          aria-pressed={scope === "tutto"}
          onClick={() => onScope("tutto")}
        >
          Tutto
        </button>
      </div>

      <div className="view-toggle" role="group" aria-label="Vista">
        <button
          type="button"
          className="view-btn"
          aria-pressed={layout === "timeline"}
          onClick={() => onLayout("timeline")}
        >
          Cronologia
        </button>
        <button
          type="button"
          className="view-btn"
          aria-pressed={layout === "shelf"}
          onClick={() => onLayout("shelf")}
        >
          Scaffale
        </button>
      </div>

      <div className="path-filter" aria-label="Secondo Fabrizio">
        <div className="path-label">
          <span className="path-kicker">Secondo Fabrizio</span>
          <span className="path-note">un modo di sfogliare · non ufficiale</span>
        </div>
        <div className="path-chips" role="group">
          <button
            type="button"
            className="path-chip"
            aria-pressed={era === "all"}
            onClick={() => onEra("all")}
          >
            <span className="path-chip-label">Tutto il filo</span>
          </button>
          {ERAS.map((item) => (
            <button
              key={item.id}
              type="button"
              className="path-chip"
              aria-pressed={era === item.id}
              onClick={() => onEra(item.id)}
              title={item.hint}
            >
              <span className="path-chip-label">{item.label}</span>
              <span className="path-chip-years">{item.years}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
