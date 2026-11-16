import { Link } from "react-router-dom";
import { tools } from "../data/tools.js";

function ToolCard({ tool }) {
  const Icon = tool.icon;
  const body = (
    <>
      <Icon className="h-6 w-6 text-teal" />
      <h3 className="mt-4 text-sm font-semibold">{tool.title}</h3>
      <p className="mt-2 text-sm text-white/55">{tool.description}</p>
      {!tool.live && (
        <span className="mt-4 inline-block rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/50">
          Coming soon
        </span>
      )}
    </>
  );

  const base = "block h-full rounded-xl border border-white/10 bg-card p-5";

  return tool.live ? (
    <Link to={`/tools/${tool.slug}`} className={`${base} transition-colors hover:border-teal/50`}>
      {body}
    </Link>
  ) : (
    <div className={`${base} opacity-80`}>{body}</div>
  );
}

export default function ToolsGrid() {
  return (
    <section id="tools" className="mx-auto max-w-7xl px-4 pb-24 sm:px-6">
      <h2 className="text-center text-2xl font-bold sm:text-3xl">Browse 10 Tools on Board</h2>
      <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {tools.map((t) => (
          <ToolCard key={t.slug} tool={t} />
        ))}
      </div>
    </section>
  );
}
