import Skill from "../models/skill.model.js";
import type { ISkill } from "../types/skill.type.js";
import ApiError from "../utils/ApiError.js";

export const getAllSkillService = async (): Promise<ISkill[]> => {
    const skillList = await Skill.findAll();
    if (!skillList) {
        throw new ApiError(500, "Could not fetch skill list");
    }

    return skillList;
}