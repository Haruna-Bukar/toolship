import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import PlatformIcon from "./PlatformIcon.jsx";
import extractText from "../utils/extractText.js";

const base = "mt-2 w-full rounded-lg border border-white/10 bg-bg px-3 py-2 text-sm outline-none focus:border-teal";

// Renders one form field from its config: text, textarea, select, or buttons.
// A textarea with upload: true also gets an "Upload" button that fills it from a file.
export default function FormField({ field, value, onChange }) {
  // Hooks must run before any early return.
  const fileRef = useRef(null);
  const [status, setStatus] = useState({ busy: false, message: "", error: false });

  async function handleFile(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // lets the user pick the same file again later
    if (!file) return;

    setStatus({ busy: true, message: "Reading file...", error: false });
    try {
      const text = await extractText(file);
      onChange(text);
      setStatus({
        busy: false,
        message: `Loaded ${file.name}. Check the text and fix anything that looks wrong.`,
        error: false,
      });
    } catch (err) {
      setStatus({ busy: false, message: err.message, error: true });
    }
  }

  if (field.type === "buttons") {
    return (
      <div>
        <span className="text-sm font-medium">{field.label}</span>
        <div className="mt-2 flex gap-2">
          {field.options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(opt)}
              className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-3 py-2 text-sm ${
                value === opt ? "border-teal bg-teal/10 text-teal" : "border-white/10 text-white/60 hover:text-white"
              }`}
            >
              {field.icons && <PlatformIcon platform={opt} />}
              {opt}
            </button>
          ))}
        </div>
      </div>
    );
  }

  const id = `field-${field.name}`;
  const overLimit = field.maxLength && value.length > field.maxLength;

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <label htmlFor={id} className="text-sm font-medium">{field.label}</label>
        {field.upload && (
          <>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={status.busy}
              className="flex items-center gap-1 rounded-lg border border-white/10 px-3 py-1 text-xs hover:bg-white/5 disabled:opacity-60"
            >
              <Upload className="h-3.5 w-3.5" /> {status.busy ? "Reading..." : "Upload PDF or Word"}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFile}
              className="hidden"
            />
          </>
        )}
      </div>

      {field.type === "select" && (
        <select id={id} value={value} onChange={(e) => onChange(e.target.value)} className={base}>
          {field.options.map((o) => <option key={o}>{o}</option>)}
        </select>
      )}
      {field.type === "textarea" && (
        <textarea
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={field.rows || 4}
          placeholder={field.placeholder}
          className={base}
        />
      )}
      {field.type === "text" && (
        <input
          id={id}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={base}
        />
      )}

      {field.maxLength && (
        <p className={`mt-1 text-xs ${overLimit ? "text-red-300" : "text-white/40"}`}>
          {value.length} / {field.maxLength} characters{overLimit ? ". Too long, please shorten it." : ""}
        </p>
      )}
      {status.message && (
        <p className={`mt-1 text-xs ${status.error ? "text-red-300" : "text-teal"}`}>{status.message}</p>
      )}
    </div>
  );
}