import { NextResponse } from "next/server";
import { verifySession, getCurrentUser } from "@/app/lib/dal";
import { hasPassedAllModules } from "@/app/lib/quiz-progress";
import { getOrCreateCertificate } from "@/app/lib/certificate-registry";
import { generateCertificatePdf } from "@/app/lib/certificate";

export async function GET() {
  const session = await verifySession();

  const allPassed = await hasPassedAllModules(session.userId);
  if (!allPassed) {
    return NextResponse.json(
      { error: "Certificate not yet earned." },
      { status: 403 }
    );
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const certificate = await getOrCreateCertificate(session.userId);

  const pdfBytes = await generateCertificatePdf({
    fullName: user.fullName,
    certificateId: certificate.certificateId,
    issuedAt: certificate.issuedAt,
  });

  return new NextResponse(Buffer.from(pdfBytes), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="omni-bi-certificate.pdf"`,
    },
  });
}
