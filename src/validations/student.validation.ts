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