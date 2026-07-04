import { z } from "zod";

export const userRegisterSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be atleast 6 characters"),
        role_id: z.number("Frontend must convert role text to role_id"),
        mobile_no: z.string().length(10, "Phone number should be 10 digit"),
    }),    
});

export const userLoginSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be atleast 6 characters"),
        role_id: z.number("Frontend must convert role text to role_id"),
    })
})
