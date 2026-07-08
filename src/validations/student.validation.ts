import { Prisma } from "@prisma/client";
import z from "zod";

export const studentRegisterSchema = z.object({
    body: z.object({
        roll_no: z.string("Roll Number must be of type string"),
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be atleast 6 character"),
        mobile_no: z.string().length(10, "Phone number should be 10 digit"),
        gender_id: z.number("Frontend must convert gender text to gender_id"),
        department_id: z.number("Frontend must convert department text to department_id"),
        semester_id: z.number("Frontend must convert semester text to semester_id"),
        name: z.string("Name must be of type string"),
        age: z.string("Age must be of type string"),
    }).strict()
});

export const studentUpdateAdminSchema = z.object({
    body: z.object({
        roll_no: z.string("Roll Number must be of type string").optional(),
        email: z.email("Invalid email address").optional(),
        mobile_no: z.string().length(10, "Phone number should be 10 digit").optional(),
        gender_id: z.number("Frontend must convert gender text to gender_id").optional(),
        department_id: z.number("Frontend must convert department text to department_id").optional(),
        semester_id: z.number("Frontend must convert semester text to semester_id").optional(),
        name: z.string("Name must be of type string").optional(),
        age: z.string("Age must be of type string").optional(),
        has_backlog: z.boolean("has_backlog must be of type boolean").optional(),
        is_graduate: z.boolean("is_graduate must be of type boolean").optional(),
        cgpa: z.number("cgpa must be of type number").optional().transform((val) => (val !== undefined ? new Prisma.Decimal(val): undefined)),
        tenth_divison_id: z.number("Frontend must convert tenth_division text to tenth_division_id").optional(),
        twelfth_division_id: z.number("Frontend must convert twelfth_division text to twelfth_division_id").optional(),
        category_id: z.number("Frontend must convert category text to category_id").optional(),
        resume_url: z.string("resume_url must be of type string").optional(),
        image_url: z.string("image_url must be of type string").optional()
    }).strict()
});

export const studentUpdateSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address").optional(),
        mobile_no: z.string().length(10, "Phone number should be 10 digit").optional(),
        has_backlog: z.boolean("has_backlog must be of type boolean").optional(),
        cgpa: z.number("cgpa must be of type number").optional().transform((val) => (val !== undefined ? new Prisma.Decimal(val): undefined)),
        tenth_divison_id: z.number("Frontend must convert tenth_division text to tenth_division_id").optional(),
        twelfth_division_id: z.number("Frontend must convert twelfth_division text to twelfth_division_id").optional(),
        category_id: z.number("Frontend must convert category text to category_id").optional(),
        resume_url: z.string("resume_url must be of type string").optional(),
        image_url: z.string("image_url must be of type string").optional()
    }).strict()
});

export const studentIdParamSchema = z.object({
    params: z.object({
        user_id: z.coerce.number("user_id must be a number")
    })
});