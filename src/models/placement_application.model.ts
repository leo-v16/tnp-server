import prisma from "../config/db.prisma.js";
import type { IPlacementApplication, PlacementApplicationCreateData } from "../types/placement_application.type.js";

class PlacementApplication {
    static async findById(student_id: number, placement_id: number): Promise<IPlacementApplication | null> {
        const placementApplication = await prisma.placement_application_table.findUnique({
            where: {
                placement_id_student_id: {
                    placement_id,
                    student_id
                }
            }
        });
        return placementApplication;
    }

    static async create(placementApplicationData: PlacementApplicationCreateData): Promise<IPlacementApplication | null> {
        const newPlacementApplication = await prisma.placement_application_table.create({
            data: placementApplicationData
        });
        return newPlacementApplication;
    }

    static async findByStudentId(student_id: number): Promise<IPlacementApplication[] | null> {
        const appliedPlacement = await prisma.placement_application_table.findMany({
            where: {
                student_id
            },
            include: {
                placement_table: {
                    include: {
                        user_table: {
                            include: {
                                organization_table: true
                            }
                        }
                    }
                }
            }
        });

        return appliedPlacement
    }

    static async findByCreatorId(creator_id: number): Promise<IPlacementApplication[] | null> {
        const appliedPlacement = await prisma.placement_application_table.findMany({
            where: {
                placement_table: {
                    creator_id: creator_id
                }
            },
            include: {
                placement_table: true,
                student_table: true
            }
        });

        return appliedPlacement
    }

    static async findByDepartmentId(department_id: number): Promise<IPlacementApplication[] | null> {
        const appliedPlacement = await prisma.placement_application_table.findMany({
            where: {
                placement_table: {
                    creator_id: department_id
                },
                student_table: {
                    department_id
                }
            },
            include: {
                placement_table: true,
                student_table: true
            }
        });

        return appliedPlacement
    }

    static async approve(student_id: number, placement_id: number): Promise<IPlacementApplication | null> {
        const approvedPlacement = await prisma.placement_application_table.update({
            where: {
                placement_id_student_id: {
                    student_id: student_id,
                    placement_id: placement_id
                }
            },
            data: {
                status_id: 1
            }
        });

        return approvedPlacement;
    }
}

export default PlacementApplication;