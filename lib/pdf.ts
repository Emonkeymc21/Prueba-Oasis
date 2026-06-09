import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'node:fs/promises';
import path from 'node:path';

export async function buildPersonalizedPdf(nombre: string) {
  const filePath = path.join(process.cwd(), 'public', 'assets', 'invitacion-base.pdf');
  const original = await fs.readFile(filePath);
  const pdfDoc = await PDFDocument.load(original);
  const page = pdfDoc.getPages()[0];
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

  page.drawRectangle({
    x: 103,
    y: 586,
    width: 118,
    height: 28,
    color: rgb(1, 1, 1)
  });

  page.drawText(`${nombre}:`, {
    x: 107,
    y: 592,
    size: 14,
    font: boldFont,
    color: rgb(0, 0, 0)
  });

  return Buffer.from(await pdfDoc.save());
}
