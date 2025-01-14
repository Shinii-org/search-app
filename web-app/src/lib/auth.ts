"use server";
import db from "@/lib/db";
import { EmailSchema } from "./schema";
import { hash } from "bcryptjs";
import { signIn } from "@/auth";

export const signInWithCredentials = async (params: EmailSchema) => {
  const { email, password } = params;

  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (_) {
    return { success: false, error: "Signin error" };
  }
};

export const signUp = async ({ email, password }: EmailSchema) => {
  const user = await db.user.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  if (user && user.password)
    return { success: false, error: "User already exists" };
  if (user && !user.password) {
    try {
      // If user existed but don't have password, update password
      const hashedPassword = await hash(password, 10);
      await db.user.update({
        where: { email: email.toLowerCase() },
        data: { password: hashedPassword },
      });
      await signInWithCredentials({ email, password });
      return { success: true };
    } catch (_) {
      return { success: false, error: "Signup error" };
    }
  } else {
    // If user hasnt existed, create new user
    const hashedPassword = await hash(password, 10);
    try {
      await db.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
        },
      });
      await signInWithCredentials({ email, password });
      return { success: true };
    } catch (_) {
      return { success: false, error: "Signup error" };
    }
  }
};
