import { z } from "zod";

export const messageSchema = z.object({
    content: z.string().min(10, "Verification code must be at least 6 characters").max(300, "Verification code must be at most 10 characters")
});
