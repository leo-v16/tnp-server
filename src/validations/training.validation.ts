import { Prisma } from "@prisma/client";
import { title } from "node:process";
import { start } from "node:repl";
import z, { email } from "zod";

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

        email: z.email(),
        role_id: z.number(),
        auth_token: z.string() 
    }).strict()
})