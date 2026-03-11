import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User";

let client: OAuth2Client;

const getClient = () => {
    if (!client) {
        if (!process.env.GOOGLE_CLIENT_ID) {
            throw new Error("GOOGLE_CLIENT_ID is not defined in environment variables");
        }
        client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
    return client;
};

export const googleAuth = async (token: string) => {
    const ticket = await getClient().verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
        throw new Error("Invalid Google token");
    }

    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
        // Create new user if they don't exist
        // For social login, we don't necessarily need a password, 
        // but the model might require it. We can set a random one or adjust model.
        user = await User.create({
            name: name || "Google User",
            email: email,
            password: Math.random().toString(36).slice(-10), // Random password for social login
            role: UserRole.USER,
        });
    }

    // Generate tokens (Same as loginUser)
    const accessToken = jwt.sign(
        { id: user._id, role: user.role, hostelId: user.hostelId },
        process.env.JWT_ACCESS_SECRET!,
        { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
        { id: user._id },
        process.env.JWT_REFRESH_SECRET!,
        { expiresIn: "7d" }
    );

    return { user, accessToken, refreshToken };
};
