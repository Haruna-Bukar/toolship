export default function TemplatesTab({ config, onUse }) {
  return (
    <div>
      <h2 className="text-lg font-semibold">Templates</h2>
      <p className="mt-1 text-sm text-white/50">Start from a ready-made setup, then edit the details.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {config.templates.map((t) => (
          <div key={t.name} className="flex flex-col rounded-xl border border-white/10 bg-card p-5">
            <h3 className="font-semibold">{t.name}</h3>
            <p className="mt-1 text-sm text-white/55">{t.description}</p>
            <p className="mt-3 text-xs text-white/40">
              {config.metaFields.map((f) => t.inputs[f]).filter(Boolean).join(" • ")}
            </p>
            <button
              onClick={() => onUse(t.inputs)}
              className="mt-4 rounded-lg bg-violet py-2 text-sm font-semibold hover:opacity-90"
            >
              Use template
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}