import Division from "../models/division.model.js";
import type { IDivision } from "../types/division.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllDivisonService = async (): Promise<IDivision[]> => {
    const divisionList = await Division.getAll();
    if (!divisionList) {
        throw new ApiError(500, "Could not fetch department");
    }

    return divisionList;
}