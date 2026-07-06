import { Prisma } from "@prisma/client";
import z from "zod";

export const trainingCreateSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string().optional(),
        min_cgpa: z.number().optional().transform((val) => (val !== undefined ? new Prisma.Decimal(val): undefined)),
        end_date: z.date().optional(),
        start_date: z.date().optional(),
        image_url: z.string().optional(),
        last_date_of_submission: z.date().optional(),
        is_active: z.boolean().optional(),
    }).strict()
})