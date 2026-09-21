"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { verifyAdminSession } from "@/app/lib/dal";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/app/lib/prisma";
import { SignupFormSchema } from "@/app/lib/definitions";

export type CreateUserState =
  | {
      errors?: {
        fullName?: string[];
        email?: string[];
        password?: string[];
      };
      message?: string;
      success?: boolean;
    }
  | undefined;

export async function createUserAccount(
  state: CreateUserState,
  formData: FormData
): Promise<CreateUserState> {
  await verifyAdminSession();

  const validatedFields = SignupFormSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { fullName, email, password } = validatedFields.data;
  const passwordHash = await bcrypt.hash(password, 10);

  try {
    await prisma.user.create({
      data: { fullName, email, passwordHash },
    });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        errors: { email: ["An account with this email already exists."] },
      };
    }
    return { message: "An error occurred while creating the account." };
  }

  revalidatePath("/admin");
  return { success: true, message: `Account created for ${fullName}.` };
}
