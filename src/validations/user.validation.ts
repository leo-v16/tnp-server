import { z } from "zod";
import { Role } from "../types/role.type.js";

export const userRegisterSchema = z.object({
    body: z.object({
        email: z.email("Invalid email address"),
        password: z.string().min(6, "Password must be atleast 6 characters"),
        role: z.enum(Role, {error: "Invalid role"}),
    }),    
});