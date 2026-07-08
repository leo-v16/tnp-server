import z from "zod";

export const trainingApplicationCreateSchema = z.object({
    body: z.object({
        training_id: z.number("Training ID must be a number")
    }).strict()
});

export const trainingApplicationIdParamSchema = z.object({
    params: z.object({
        training_id: z.coerce.number("training_id must be a number"),
        student_id: z.coerce.number("student_id must be a number"),
    })
});