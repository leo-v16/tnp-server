export enum Role {
    SuperAdmin = "Super Admin",
    Coordinator = "Coordinator",
    Organization = "Organization",
    Student = "Student"
}

export interface IRole {
    role_id: number,
    role: string,
}