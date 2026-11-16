// Reads a PDF, Word (.docx), or text file in the browser and returns plain text.
// The file itself is never uploaded to our server. Only the text you generate from is sent.

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

async function readPdf(file) {
  // Loaded only when needed, so the homepage stays light.
  const pdfjs = await import("pdfjs-dist");
  const workerUrl = (await import("pdfjs-dist/build/pdf.worker.min.mjs?url")).default;
  pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

  const pdf = await pdfjs.getDocument({ data: await file.arrayBuffer() }).promise;
  let text = "";
  for (let n = 1; n <= pdf.numPages; n++) {
    const page = await pdf.getPage(n);
    const content = await page.getTextContent();
    text += content.items.map((it) => it.str + (it.hasEOL ? "\n" : " ")).join("") + "\n";
  }
  return text;
}

async function readDocx(file) {
  const mod = await import("mammoth/mammoth.browser");
  const mammoth = mod.default || mod;
  const result = await mammoth.extractRawText({ arrayBuffer: await file.arrayBuffer() });
  return result.value;
}

export default async function extractText(file) {
  if (file.size > MAX_BYTES) {
    throw new Error("That file is too large. Keep it under 5 MB.");
  }

  const name = file.name.toLowerCase();
  let text;
  if (name.endsWith(".pdf")) text = await readPdf(file);
  else if (name.endsWith(".docx")) text = await readDocx(file);
  else if (name.endsWith(".txt")) text = await file.text();
  else throw new Error("Upload a PDF, a Word .docx file, or a .txt file. Older .doc files are not supported.");

  // Tidy up spacing so the text is easy to read and edit.
  text = text
    .replace(/\r/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  if (text.length < 30) {
    throw new Error("We could not read any text in this file. It may be a scanned image. Please paste the text instead.");
  }
  return text;
}