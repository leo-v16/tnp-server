import Division from "../models/division.model.js";
import type { IDivision } from "../types/division.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllDivisonService = async (): Promise<IDivision[]> => {
    const divisionList = await Division.findAll();
    if (!divisionList) {
        throw new ApiError(500, "Could not fetch division list");
    }

    return divisionList;
}