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
        email: z.email("Enter valid email")
    }).strict()
});

export const organizationIdParamSchema = z.object({
    params: z.object({
        organization_id: z.coerce.number("organization_id must be a number")
    })
});