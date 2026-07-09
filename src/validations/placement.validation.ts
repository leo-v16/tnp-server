import { Prisma } from "@prisma/client";
import z from "zod";

export const placementCreateSchema = z.object({
    body: z.object({
        title: z.string(),
        description: z.string().optional(),
        min_cgpa: z.number().optional().transform((val) => (val !== undefined ? new Prisma.Decimal(val): undefined)),
        end_date: z.coerce.date().optional(),
        start_date: z.coerce.date().optional(),
        image_url: z.string().optional(),
        last_date_of_submission: z.coerce.date().optional(),
        is_active: z.boolean().optional(),
    }).strict()
})

export const placementIdParamSchema = z.object({
    params: z.object({
        placement_id: z.coerce.number({ message: "placement_id must be a number" })
    })
});