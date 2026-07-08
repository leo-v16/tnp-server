import z from "zod";

export const departmentRegisterSchema = z.object({
    body: z.object({
        dept_name: z.string("Department name must be a string"),
        is_active: z.boolean("Active status must be a boolean value").optional()
    }).strict()
});