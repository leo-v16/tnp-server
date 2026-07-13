import z from "zod";

export const departmentRegisterSchema = z.object({
    body: z.object({
        department_name: z.string({ message: "Department name must be a string" }),
        is_active: z.boolean({ message: "Active status must be a boolean value" }).optional(),
        name: z.string("Name must be string"),
        email: z.email("Incorrect email format"),
        password: z.string().min(6, "Minimum 6 characters must be their for password")
    }).strict()
    
});