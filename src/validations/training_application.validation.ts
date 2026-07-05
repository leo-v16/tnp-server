import z from "zod";

export const trainingApplicationCreateSchema = z.object({
    body: z.object({
        student_id: z.number("Student ID must be a number"),
        training_id: z.number("Training ID must be a number")
    })
});