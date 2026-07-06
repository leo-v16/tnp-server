import z, { email } from "zod";

export const organizationRegisterSchema = z.object({
    body: z.object({
        name: z.string("Organization name must be a string"),
        email: z.email("Enter valid email"),
        mobile_no: z.string().length(10, "Phone number must be string with 10 numbers"),
        password: z.string().min(6, "Password must be atleast 6 character"),
    }).strict()
});

export const organizationApproveSchema = z.object({
    body: z.object({
        email: z.email("Enter valid email"),
        auth_token: z.string("Invalid auth token"),
        role_id: z.number("Frontend must convert role text to role_id"),
        organization_email: z.email("Enter valid organization email")
    }).strict()
})