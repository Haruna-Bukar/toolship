import { Trash2, RotateCcw } from "lucide-react";
import ResultCard from "./ResultCard.jsx";
import { toResultItems } from "../data/toolConfigs.js";

function timeAgo(ms) {
  const mins = Math.floor((Date.now() - ms) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} hr ago`;
  return `${Math.floor(hours / 24)} days ago`;
}

export default function HistoryTab({ config, history, onReuse, onRemove, onClear }) {
  if (history.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">
        Nothing here yet. Your generated results will be saved here automatically.
      </p>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">History</h2>
        <button onClick={onClear} className="text-xs text-white/50 hover:text-white">
          Clear all
        </button>
      </div>
      <p className="mt-1 text-xs text-white/40">Saved to your account. Only you can see it.</p>

      <div className="mt-6 space-y-8">
        {history.map((entry) => {
          const title = String(entry.inputs[config.titleField] || "");
          const meta = config.metaFields.map((f) => entry.inputs[f]).filter(Boolean).join(" • ");
          return (
            <section key={entry.id}>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-medium">
                    {title.slice(0, 80)}
                    {title.length > 80 ? "..." : ""}
                  </p>
                  <p className="mt-1 text-xs text-white/40">
                    {meta} • {timeAgo(entry.createdAt)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => onReuse(entry.inputs)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5"
                  >
                    <RotateCcw className="h-3.5 w-3.5" /> Reuse
                  </button>
                  <button
                    onClick={() => onRemove(entry.id)}
                    className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:bg-white/5"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>

              <div className={`mt-3 grid gap-3 ${entry.results.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2"}`}>
                {toResultItems(config, entry.inputs, entry.results).map((r, i) => (
                  <ResultCard key={i} result={r} />
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}