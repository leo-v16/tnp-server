import prisma from "../config/db.prisma.js";
import type { ICategory } from "../types/category.type.js";

class Category {
    static async findById(category_id: number): Promise<ICategory | null> {
        const category = await prisma.category_table.findUnique({
            where: {
                category_id
            }
        });
        return category;
    }
}