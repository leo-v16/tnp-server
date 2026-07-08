import Category from "../models/category.model.js";
import Department from "../models/department.model.js";
import type { ICategory } from "../types/category.type.js";
import type { IDepartment } from "../types/department.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllCategoryService = async (): Promise<ICategory[]> => {
    const categoryList = await Category.getAll();
    if (!categoryList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return categoryList;
}