import bcrypt from "bcrypt";

class PasswordManager {
    static hashRounds = 12;

    static async hashPassword(password: string): Promise<string> {
        const hash = await bcrypt.hash(password, this.hashRounds);
        return hash;
    }

    static async verifyPassword(password: string, hash: string): Promise<boolean> {
        const verified = await bcrypt.compare(password, hash);
        return verified;
    }
}

export default PasswordManager;