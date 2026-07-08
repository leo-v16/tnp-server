import z from "zod";

export const departmentRegisterSchema = z.object({
    body: z.object({
        dept_name: z.string({ message: "Department name must be a string" }),
        is_active: z.boolean({ message: "Active status must be a boolean value" }).optional()
    }).strict()
});