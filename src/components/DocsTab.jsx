export default function DocsTab({ docs }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-lg font-semibold">{docs.title}</h2>

      <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-white/70">
        {docs.steps.map((s) => <li key={s}>{s}</li>)}
      </ol>

      <h3 className="mt-8 font-semibold">Tips for better results</h3>
      <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-white/70">
        {docs.tips.map((t) => <li key={t}>{t}</li>)}
      </ul>

      <h3 className="mt-8 font-semibold">Good to know</h3>
      <p className="mt-3 text-sm text-white/70">
        Results are written by AI, so they can vary. Your history is saved to your account and
        only you can see it.
      </p>
    </div>
  );
}