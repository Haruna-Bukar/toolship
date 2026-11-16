// Turns the plain-text resume into a clean, text-based PDF (real selectable text, ATS friendly).
// Layout rules: first line is the name, ALL CAPS lines are section headings,
// lines starting with "- " are bullet points, everything else is normal text.

const PAGE = { w: 595.28, h: 841.89 }; // A4 in points
const M = { x: 54, top: 56, bottom: 56 };

// Standard PDF fonts only cover basic Latin characters, so we simplify the rest.
function clean(text) {
  return text
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/\u2014/g, " - ")
    .replace(/\u2013/g, "-")
    .replace(/\u2026/g, "...")
    .replace(/\u00A0/g, " ")
    .replace(/^[ ]*[\u2022\u25CF\u25AA][ ]*/gm, "- ")
    .replace(/[\u2022\u25CF\u25AA]/g, " | ")
    .replace(/[^\n\x20-\x7E\u00A1-\u00FF]/g, "")
    .replace(/ {2,}/g, " ");
}

function isHeading(line) {
  return line.length <= 40 && /[A-Z]/.test(line) && line === line.toUpperCase() && !/^[-*]/.test(line);
}

export default async function textToPdf(rawText) {
  const { jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const maxW = PAGE.w - M.x * 2;
  let y = M.top;

  const ensure = (needed) => {
    if (y + needed > PAGE.h - M.bottom) {
      doc.addPage();
      y = M.top;
    }
  };

  function write(str, { size = 10, bold = false, indent = 0, lh = 13.5 } = {}) {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    for (const l of doc.splitTextToSize(str, maxW - indent)) {
      ensure(lh);
      doc.text(l, M.x + indent, y);
      y += lh;
    }
  }

  const lines = clean(rawText).split("\n").map((l) => l.trim());
  let name = "";
  let afterName = true;

  for (const line of lines) {
    if (!line) {
      y += 5;
      continue;
    }

    if (!name) {
      name = line;
      write(line, { size: 20, bold: true, lh: 24 });
      continue;
    }

    if (isHeading(line)) {
      y += afterName ? 4 : 8;
      ensure(32);
      write(line, { size: 11, bold: true, lh: 15 });
      doc.setDrawColor(150);
      doc.setLineWidth(0.6);
      doc.line(M.x, y - 10, PAGE.w - M.x, y - 10);
      y += 3;
      afterName = false;
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      ensure(13.5);
      doc.setFillColor(0);
      doc.circle(M.x + 3, y - 3.2, 1.3, "F");
      write(line.replace(/^[-*]\s+/, ""), { indent: 12 });
      afterName = false;
      continue;
    }

    write(line);
    afterName = false;
  }

  const safeName = name.replace(/[^A-Za-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  doc.setProperties({ title: name ? `${name} Resume` : "Resume" });
  doc.save(safeName ? `${safeName}-Resume.pdf` : "Resume.pdf");
}