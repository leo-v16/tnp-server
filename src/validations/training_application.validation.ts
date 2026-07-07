import z from "zod";

export const trainingApplicationCreateSchema = z.object({
    body: z.object({
        training_id: z.number("Training ID must be a number")
    }).strict()
});