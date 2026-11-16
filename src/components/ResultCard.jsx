import { useState } from "react";
import { Copy, Check, FileDown } from "lucide-react";
import PlatformIcon from "./PlatformIcon.jsx";

// result: { label, icon (optional platform name), text, editable, downloadable }
// onTextChange: pass it to let the user edit an editable result before copying or downloading.
export default function ResultCard({ result, onTextChange }) {
  const [copied, setCopied] = useState(false);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfError, setPdfError] = useState("");

  async function copy() {
    await navigator.clipboard.writeText(result.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function downloadPdf() {
    setPdfBusy(true);
    setPdfError("");
    try {
      // Loaded only when needed, so the PDF library does not slow down other pages.
      const { default: textToPdf } = await import("../utils/textToPdf.js");
      await textToPdf(result.text);
    } catch {
      setPdfError("Could not create the PDF. Please try again.");
    } finally {
      setPdfBusy(false);
    }
  }

  const editable = result.editable && onTextChange;

  return (
    <div className="rounded-xl border border-white/10 bg-card p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-sm text-white/60">
          {result.icon && <PlatformIcon platform={result.icon} />}
          {result.label}
        </span>
        <div className="flex items-center gap-4">
          {result.downloadable && (
            <button
              onClick={downloadPdf}
              disabled={pdfBusy}
              className="flex items-center gap-1 rounded-lg bg-violet px-3 py-1 text-xs font-semibold hover:opacity-90 disabled:opacity-60"
            >
              <FileDown className="h-4 w-4" /> {pdfBusy ? "Creating..." : "Download PDF"}
            </button>
          )}
          <button onClick={copy} className="flex items-center gap-1 text-xs text-white/60 hover:text-white">
            {copied ? <Check className="h-4 w-4 text-teal" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {editable ? (
        <>
          <textarea
            value={result.text}
            onChange={(e) => onTextChange(e.target.value)}
            rows={20}
            className="mt-3 w-full rounded-lg border border-white/10 bg-bg p-3 text-sm leading-relaxed outline-none focus:border-teal"
          />
          <p className="mt-2 text-xs text-white/40">
            You can edit this text. Fix anything that is not true before you download.
          </p>
        </>
      ) : (
        <p className="mt-3 whitespace-pre-line text-sm leading-relaxed">{result.text}</p>
      )}

      {pdfError && <p className="mt-2 text-xs text-red-300">{pdfError}</p>}
    </div>
  );
}