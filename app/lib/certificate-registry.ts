import "server-only";
import { prisma } from "@/app/lib/prisma";

const CERTIFICATE_ID_START = 2001;
const CERTIFICATE_ID_PREFIX = "OMNI-CPRT-";

export async function getOrCreateCertificate(userId: string) {
  const existing = await prisma.certificate.findUnique({ where: { userId } });
  if (existing) return existing;

  const count = await prisma.certificate.count();
  const certificateId = `${CERTIFICATE_ID_PREFIX}${CERTIFICATE_ID_START + count}`;

  return prisma.certificate.create({
    data: { userId, certificateId },
  });
}
