import Gender from "../models/gender.model.js";
import type { IGender } from "../types/gender.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllGenderService = async (): Promise<IGender[]> => {
    const genderList = await Gender.findAll();
    if (!genderList) {
        throw new ApiError(500, "Could not fetch gender list");
    }

    return genderList;
}