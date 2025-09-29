import { z } from "zod";

export const resetPasswordSchema = z.object({
  password: z.string().superRefine((val, ctx) => {
    const errors = [];

    if (val.length < 8) errors.push("min 8 chars");
    if (!/[A-Z]/.test(val)) errors.push("1 upper");
    if (!/[a-z]/.test(val)) errors.push("1 lower");
    if (!/[0-9]/.test(val)) errors.push("1 number");
    if (!/[^A-Za-z0-9]/.test(val)) errors.push("1 symbol");

    if (errors.length > 0) {
      ctx.addIssue({
        code: z.custom,
        message: errors.join(", "),
      });
    }
  }),

  confirmPassword: z.string().trim().min(1, "required"),
});
