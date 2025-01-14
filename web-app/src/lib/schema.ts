import { z } from "zod";

const emailSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type EmailSchema = z.infer<typeof emailSchema>;

export { emailSchema, type EmailSchema };
