import jwt from "jsonwebtoken";

export const generateTokens = (user) => {
    const payload = {
        id: user._id,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_KEY, { expiresIn: "15m" });

    const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_KEY, { expiresIn: "7d" });

    return { accessToken, refreshToken }
};