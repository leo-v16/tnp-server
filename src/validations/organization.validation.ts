import z from "zod";

export const organizationRegisterSchema = z.object({
    body: z.object({
        name: z.string({ message: "Organization name must be a string" }),
        email: z.email("Enter valid email"),
        mobile_no: z.string().length(10, "Phone number must be string with 10 numbers"),
        password: z.string().min(6, "Password must be atleast 6 character"),
    }).strict()
});

export const organizationStatusSchema = z.object({
    params: z.object({
        organization_id: z.coerce.number({ message: "organization_id must be a number" })
    }),
    body: z.object({
        approval_id: z.number({ message: "approval_id must be a number" }).refine(val => val === 1 || val === 2, {
            message: "approval_id must be 1 (Approved) or 2 (Rejected)"
        })
    }).strict()
});

export const organizationIdParamSchema = z.object({
    params: z.object({
        organization_id: z.coerce.number({ message: "organization_id must be a number" })
    })
});

export const organizationQuerySchema = z.object({
    query: z.object({
        status: z.enum(["approved", "pending", "rejected"]).optional()
    })
});