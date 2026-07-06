import z from "zod";

export const authValidationSchema = z.object({
    body: z.object({
        user_id: z.number("User id must be a number"),
        role_id: z.number("Role id must be a number"),
        auth_token: z.string("Invalid auth token type")
    })
})