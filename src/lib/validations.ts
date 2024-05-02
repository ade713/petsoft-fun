import { z } from "zod";

export const petIdSchema = z.string().cuid();

export const petFormSchema = z.object({
  name: z.string().trim().min(1, { message: "Name is required" }).max(180),
  ownerName: z
    .string()
    .trim()
    .min(1, { message: "Owner name is required" })
    .max(180),
  imageUrl: z.union([
    z.literal(""),
    z.string().trim().min(1, { message: "Image url must be a valid url" }),
  ]),
  age: z.coerce.number().int().positive().max(999),
  notes: z.union([z.literal(""), z.string().trim().max(1000)]),
});

export type TPetForm = z.infer<typeof petFormSchema>;
