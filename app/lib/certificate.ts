import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import { PDFDocument, StandardFonts, rgb, type PDFImage } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";

const TEMPLATE_PATH = path.join(
  process.cwd(),
  "app/lib/certificate-assets/template.pdf"
);
const LOGOS_DIR = path.join(
  process.cwd(),
  "app/lib/certificate-assets/logos"
);
const SIGNATURE_FONT_PATH = path.join(
  process.cwd(),
  "app/lib/certificate-assets/fonts/AlexBrush-Regular.ttf"
);

const ISSUER_TITLE = "Senior director of Technology, Data";
const ISSUER_SIGNATURE_NAME = "Hardik Bhavsar";

// The template's baked-in title ("Omni BI Certification Program (Copart)")
// and its repeat inside the body paragraph are covered with a whiteout
// rectangle and redrawn as "Omni Analytics Certificate". Coordinates were
// measured directly from the template's content stream (PyMuPDF span
// bboxes/origins), then converted from top-left to pdf-lib's bottom-left
// origin (y_bottom = 540 - y_top).
const CERT_NAME = "Omni Analytics Certificate";

const TITLE_WHITEOUT = { x: 100, y: 358, width: 760, height: 77 };
const TITLE_Y = 383.92;
const TITLE_FONT_SIZE = 33.8;
const TITLE_COLOR = rgb(0.106, 0.165, 0.29);

const BODY_TITLE_WHITEOUT = { x: 375, y: 224.94, width: 156, height: 19.35 };
// Right edge of the original template phrase, so the replacement butts up
// against "at Copart" with normal word-spacing instead of leaving a gap.
const BODY_TITLE_RIGHT_EDGE = 528.87;
const BODY_TITLE_Y = 230.13;
const BODY_TITLE_FONT_SIZE = 12.775;
const BODY_TITLE_COLOR = rgb(0.2, 0.2, 0.2);

// Logos sit in the top-right of the header, in the clear space above
// "CERTIFICATE OF COMPLETION" and to the right of the decorative circles.
const LOGO_ROW_Y = 472;
const LOGO_HEIGHT = 32;
const LOGO_GAP = 16;
const LOGO_RIGHT_EDGE = 900;

async function loadLogoImage(
  pdfDoc: PDFDocument,
  filename: string
): Promise<PDFImage | null> {
  try {
    const bytes = await fs.readFile(path.join(LOGOS_DIR, filename));
    const isPng = bytes[0] === 0x89 && bytes[1] === 0x50;
    return isPng ? await pdfDoc.embedPng(bytes) : await pdfDoc.embedJpg(bytes);
  } catch {
    return null;
  }
}

// Name line sits between "This certifies that" (baseline y=337) and the
// body paragraph (baseline y=230) on the 960x540pt template, centered
// above the underline rule.
const NAME_Y = 295;
const NAME_FONT_SIZE = 26;
const NAME_MIN_FONT_SIZE = 16;
const NAME_MAX_WIDTH = 650;
const NAME_COLOR = rgb(0.106, 0.165, 0.29); // matches template navy

// Coordinates of the "Date Issued" and "Certificate ID" value text baked
// into the template, measured from the template's own content stream.
// Both sit on the same baseline, above their respective underline/label.
const FIELD_VALUE_Y = 141;
const FIELD_VALUE_HEIGHT = 19;
const FIELD_FONT_SIZE = 12;
const FIELD_COLOR = rgb(0.2, 0.2, 0.2);
const DATE_FIELD_CENTER_X = 219.9;
const CERT_ID_FIELD_CENTER_X = 479.3;
const ISSUER_FIELD_CENTER_X = 738.5;
const FIELD_WHITEOUT_WIDTH = 180;
const ISSUER_FIELD_WHITEOUT_WIDTH = 280;

// Signature sits just above the "Issued By" printed title, in the blank
// space below the body paragraph.
const SIGNATURE_Y = 157;
const SIGNATURE_FONT_SIZE = 26;
const SIGNATURE_COLOR = rgb(0.106, 0.165, 0.29);

function formatIssuedDate(date: Date) {
  const month = date.toLocaleString("en-US", { month: "long" });
  return `${month}-${date.getDate()}-${date.getFullYear()}`;
}

export async function generateCertificatePdf({
  fullName,
  certificateId,
  issuedAt,
}: {
  fullName: string;
  certificateId: string;
  issuedAt: Date;
}): Promise<Uint8Array> {
  const templateBytes = await fs.readFile(TEMPLATE_PATH);
  const pdfDoc = await PDFDocument.load(templateBytes);
  pdfDoc.registerFontkit(fontkit);
  const page = pdfDoc.getPages()[0];
  const { width } = page.getSize();

  const nameFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const fieldFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const signatureFontBytes = await fs.readFile(SIGNATURE_FONT_PATH);
  const signatureFont = await pdfDoc.embedFont(signatureFontBytes);

  const titleFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
  const bodyTitleFont = await pdfDoc.embedFont(StandardFonts.Helvetica);

  page.drawRectangle({ ...TITLE_WHITEOUT, color: rgb(1, 1, 1) });
  const titleWidth = titleFont.widthOfTextAtSize(CERT_NAME, TITLE_FONT_SIZE);
  page.drawText(CERT_NAME, {
    x: (width - titleWidth) / 2,
    y: TITLE_Y,
    size: TITLE_FONT_SIZE,
    font: titleFont,
    color: TITLE_COLOR,
  });

  page.drawRectangle({ ...BODY_TITLE_WHITEOUT, color: rgb(1, 1, 1) });
  const bodyTitleWidth = bodyTitleFont.widthOfTextAtSize(
    CERT_NAME,
    BODY_TITLE_FONT_SIZE
  );
  page.drawText(CERT_NAME, {
    x: BODY_TITLE_RIGHT_EDGE - bodyTitleWidth,
    y: BODY_TITLE_Y,
    size: BODY_TITLE_FONT_SIZE,
    font: bodyTitleFont,
    color: BODY_TITLE_COLOR,
  });

  let nameSize = NAME_FONT_SIZE;
  let nameWidth = nameFont.widthOfTextAtSize(fullName, nameSize);
  while (nameWidth > NAME_MAX_WIDTH && nameSize > NAME_MIN_FONT_SIZE) {
    nameSize -= 1;
    nameWidth = nameFont.widthOfTextAtSize(fullName, nameSize);
  }

  page.drawText(fullName, {
    x: (width - nameWidth) / 2,
    y: NAME_Y,
    size: nameSize,
    font: nameFont,
    color: NAME_COLOR,
  });

  const drawField = (
    text: string,
    centerX: number,
    whiteoutWidth: number = FIELD_WHITEOUT_WIDTH,
    fontSize: number = FIELD_FONT_SIZE
  ) => {
    page.drawRectangle({
      x: centerX - whiteoutWidth / 2,
      y: FIELD_VALUE_Y - 5,
      width: whiteoutWidth,
      height: FIELD_VALUE_HEIGHT,
      color: rgb(1, 1, 1),
    });
    const textWidth = fieldFont.widthOfTextAtSize(text, fontSize);
    page.drawText(text, {
      x: centerX - textWidth / 2,
      y: FIELD_VALUE_Y,
      size: fontSize,
      font: fieldFont,
      color: FIELD_COLOR,
    });
  };

  drawField(formatIssuedDate(issuedAt), DATE_FIELD_CENTER_X);
  drawField(certificateId, CERT_ID_FIELD_CENTER_X);
  drawField(ISSUER_TITLE, ISSUER_FIELD_CENTER_X, ISSUER_FIELD_WHITEOUT_WIDTH, 11);

  const signatureWidth = signatureFont.widthOfTextAtSize(
    ISSUER_SIGNATURE_NAME,
    SIGNATURE_FONT_SIZE
  );
  page.drawText(ISSUER_SIGNATURE_NAME, {
    x: ISSUER_FIELD_CENTER_X - signatureWidth / 2,
    y: SIGNATURE_Y,
    size: SIGNATURE_FONT_SIZE,
    font: signatureFont,
    color: SIGNATURE_COLOR,
  });

  // Co-branding: Copart (issuing org) on the left, Omni (platform) on the
  // right, right-aligned as a group to LOGO_RIGHT_EDGE.
  const copartLogo = await loadLogoImage(pdfDoc, "copart-logo.png");
  const omniLogo = await loadLogoImage(pdfDoc, "omni-logo.png");

  let cursorX = LOGO_RIGHT_EDGE;
  for (const logo of [omniLogo, copartLogo]) {
    if (!logo) continue;
    const scale = LOGO_HEIGHT / logo.height;
    const logoWidth = logo.width * scale;
    cursorX -= logoWidth;
    page.drawImage(logo, {
      x: cursorX,
      y: LOGO_ROW_Y,
      width: logoWidth,
      height: LOGO_HEIGHT,
    });
    cursorX -= LOGO_GAP;
  }

  return pdfDoc.save();
}
