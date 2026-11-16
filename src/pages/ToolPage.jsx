import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { RefreshCw, Download } from "lucide-react";
import TrialBanner from "../components/TrialBanner.jsx";
import ToolHeader from "../components/ToolHeader.jsx";
import FormField from "../components/FormField.jsx";
import ResultCard from "../components/ResultCard.jsx";
import HistoryTab from "../components/HistoryTab.jsx";
import TemplatesTab from "../components/TemplatesTab.jsx";
import DocsTab from "../components/DocsTab.jsx";
import useHistory from "../hooks/useHistory.js";
import { toolConfigs, toResultItems } from "../data/toolConfigs.js";

// Calls our own backend, which builds the prompt and calls Gemini.
async function requestResults(tool, inputs) {
  const res = await fetch("/api/generate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ tool, inputs }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Something went wrong.");
  return data.results;
}

function defaultInputs(config) {
  const values = {};
  for (const f of config.fields) {
    values[f.name] = f.type === "select" || f.type === "buttons" ? f.options[0] : "";
  }
  return values;
}

function ToolWorkspace({ slug, config }) {
  const [activeTab, setActiveTab] = useState("Generator");
  const [inputs, setInputs] = useState(() => defaultInputs(config));
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { history, addEntry, removeEntry, clearAll } = useHistory(slug);

  async function generate() {
    setLoading(true);
    setError("");
    try {
      const texts = await requestResults(slug, inputs);
      setResults(toResultItems(config, inputs, texts));
      if (config.saveHistory !== false) {
        addEntry({ id: String(Date.now()), createdAt: Date.now(), inputs, results: texts });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Used by Templates and History: fill the form, then go to the Generator tab.
  function applyInputs(newInputs) {
    setInputs({ ...defaultInputs(config), ...newInputs });
    setResults([]);
    setError("");
    setActiveTab("Generator");
  }

  async function exportAll() {
    await navigator.clipboard.writeText(results.map((r) => r.text).join("\n\n"));
  }

  return (
    <div className="min-h-screen">
      <TrialBanner daysLeft={30} />
      <ToolHeader toolName={config.name} activeTab={activeTab} onTabChange={setActiveTab} tabs={config.tabs} />

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        {activeTab === "History" && (
          <HistoryTab config={config} history={history} onReuse={applyInputs} onRemove={removeEntry} onClear={clearAll} />
        )}
        {activeTab === "Templates" && <TemplatesTab config={config} onUse={applyInputs} />}
        {activeTab === "Docs" && <DocsTab docs={config.docs} />}

        {activeTab === "Generator" && (
          <div className="grid gap-6 lg:grid-cols-2">
            <section className="rounded-xl border border-white/10 bg-card p-6">
              <h2 className="text-lg font-semibold">Input</h2>
              <p className="mt-1 text-sm text-white/50">Fill in the details to generate</p>

              <div className="mt-6 space-y-4">
                {config.fields.map((f) => (
                  <FormField
                    key={f.name}
                    field={f}
                    value={inputs[f.name]}
                    onChange={(v) => setInputs((prev) => ({ ...prev, [f.name]: v }))}
                  />
                ))}
              </div>

              <button
                onClick={generate}
                disabled={loading}
                className="mt-6 w-full rounded-lg bg-violet py-3 text-sm font-semibold hover:opacity-90 disabled:opacity-60"
              >
                {loading ? "Generating..." : "Generate on Toolship"}
              </button>
              <p className="mt-3 text-xs text-white/40">Tip: {config.tip}</p>
            </section>

            <section>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold">Generated Results</h2>
                {results.length > 0 && (
                  <div className="flex gap-2">
                    <button onClick={generate} disabled={loading} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5 disabled:opacity-60">
                      <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                    </button>
                    <button onClick={exportAll} className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1.5 text-xs hover:bg-white/5">
                      <Download className="h-3.5 w-3.5" /> Export All
                    </button>
                  </div>
                )}
              </div>

              {error && (
                <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">{error}</p>
              )}

              {results.length === 0 ? (
                <p className="mt-6 rounded-xl border border-dashed border-white/10 p-10 text-center text-sm text-white/40">
                  {config.emptyText}
                </p>
              ) : (
                <>
                  <p className="mt-2 text-xs text-white/40">{results.length} results generated • just now</p>
                  <div className="mt-4 space-y-4">
                    {results.map((r) => (
                      <ResultCard
                        key={r.id}
                        result={r}
                        onTextChange={(text) =>
                          setResults((prev) => prev.map((x) => (x.id === r.id ? { ...x, text } : x)))
                        }
                      />
                    ))}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ToolPage() {
  const { toolName } = useParams();
  const config = Object.hasOwn(toolConfigs, toolName) ? toolConfigs[toolName] : null;

  if (!config) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
        <h1 className="text-2xl font-bold">This tool is not ready yet</h1>
        <p className="text-white/60">It is coming soon to Toolship.</p>
        <Link to="/" className="rounded-lg bg-teal px-5 py-2 text-sm font-semibold text-bg">
          Back to home
        </Link>
      </div>
    );
  }

  // key resets all state when the user moves from one tool to another
  return <ToolWorkspace key={toolName} slug={toolName} config={config} />;
}