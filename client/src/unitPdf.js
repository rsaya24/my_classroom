import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const pageWidth = 595.28;
const pageHeight = 841.89;
const margin = 48;
const usableWidth = pageWidth - 2 * margin;
const ink = rgb(.14, .12, .19);
const accent = rgb(.30, .19, .47);

export async function diagramPng(svg) {
  if (!svg) return null;
  const copy = svg.cloneNode(true);
  const { width, height } = svg.viewBox.baseVal;
  copy.removeAttribute("style");
  copy.setAttribute("width", width);
  copy.setAttribute("height", height);
  const blob = new Blob([new XMLSerializer().serializeToString(copy)], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    const canvas = document.createElement("canvas");
    canvas.width = width * 2;
    canvas.height = height * 2;
    canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function unitPdf(title, sections, diagram) {
  const pdf = await PDFDocument.create();
  pdf.setTitle(title);
  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);
  let page;
  let y;
  function ensureSpace(height) {
    if (page && y - height >= margin) return;
    page = pdf.addPage([pageWidth, pageHeight]);
    y = pageHeight - margin;
  }

  async function paragraph(value, size, heading = false) {
    const font = heading ? bold : regular;
    const color = heading ? accent : ink;
    const leading = size * 1.45;
    let canvas;
    let ctx;
    try {
      font.encodeText(value);
    } catch {
      // Let browser fonts render symbols and scripts outside the PDF standard font.
      canvas = document.createElement("canvas");
      ctx = canvas.getContext("2d");
      ctx.font = (heading ? "bold " : "") + size + "px sans-serif";
    }
    const measure = str => ctx ? ctx.measureText(str).width : font.widthOfTextAtSize(str, size);
    const lines = [];
    let line = "";
    for (const word of value.trim().split(/\s+/)) {
      const next = line ? line + " " + word : word;
      if (measure(next) <= usableWidth) { line = next; continue; }
      if (line) lines.push(line);
      line = "";
      for (const char of word) {
        if (line && measure(line + char) > usableWidth) { lines.push(line); line = ""; }
        line += char;
      }
    }
    if (line) lines.push(line);
    if (heading) ensureSpace(leading * lines.length + 24);
    for (const text of lines) {
      ensureSpace(leading);
      if (ctx) {
        const scale = 3;
        canvas.width = Math.ceil(usableWidth * scale);
        canvas.height = Math.ceil(leading * scale);
        ctx.scale(scale, scale);
        ctx.font = (heading ? "bold " : "") + size + "px sans-serif";
        ctx.fillStyle = heading ? "#4d3078" : "#242030";
        ctx.fillText(text, 0, size);
        const image = await pdf.embedPng(canvas.toDataURL("image/png"));
        page.drawImage(image, { x: margin, y: y - leading, width: usableWidth, height: leading });
        // Canvas dimensions reset its context before the next line.
      } else {
        page.drawText(text, { x: margin, y: y - size, font, size, color });
      }
      y -= leading;
    }
    y -= heading ? 6 : 7;
  }

  await paragraph(title, 21, true);
  for (const section of sections) {
    for (const line of section.split(/\r?\n/)) {
      if (!line.trim()) continue;
      const heading = line.match(/^#{1,6}\s+(.+)$/);
      await paragraph(heading ? heading[1] : line, heading ? 14 : 10.5, Boolean(heading));
    }
  }
  if (diagram) {
    const image = await pdf.embedPng(diagram);
    const size = image.scaleToFit(usableWidth, pageHeight - 2 * margin - 40);
    ensureSpace(size.height + 40);
    await paragraph("Study diagram", 14, true);
    page.drawImage(image, { x: margin, y: y - size.height, ...size });
  }
  const pages = pdf.getPages();
  pages.forEach((p, i) => p.drawText("My Classroom   |   " + (i + 1) + " / " + pages.length,
    { x: margin, y: 23, size: 9, font: regular, color: accent }));
  return pdf.save();
}
