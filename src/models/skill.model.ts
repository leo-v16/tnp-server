import prisma from "../config/db.prisma.js";
import type { ISkill } from "../types/skill.type.js";

class Skill {
    static async findById(skill_id: number): Promise<ISkill | null> {
        const skill = await prisma.skill_table.findUnique({
            where: {
                skill_id
            }
        });
        return skill;
    }
}

export default Skill;