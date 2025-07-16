import crypto from "crypto";

export const generateToken = () => {
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 15); // 15 minutes

    return { token, expiresAt };
};
