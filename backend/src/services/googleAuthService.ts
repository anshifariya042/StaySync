import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { User, IUser, UserRole, UserStatus } from "../models/User";

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
    try {
        const ticket = await getClient().verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            throw new Error("Invalid Google token payload");
        }

        const { email, name, sub: googleId } = payload;

        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if they don't exist
            // For social login, we set a random password
            const randomPassword = Math.random().toString(36).slice(-10);
            const hashedPassword = await bcrypt.hash(randomPassword, 10);
            
            user = await User.create({
                name: name || "Google User",
                email: email,
                password: hashedPassword,
                role: UserRole.USER,
                status: UserStatus.ACTIVE
            });
            console.log(`New user created via Google: ${email}`);
        }

        // Generate tokens (Same as loginUser)
        const accessToken = jwt.sign(
            { id: user._id.toString(), role: user.role, hostelId: user.hostelId?.toString() },
            process.env.JWT_ACCESS_SECRET!,
            { expiresIn: "1h" }
        );

        const refreshToken = jwt.sign(
            { id: user._id.toString() },
            process.env.JWT_REFRESH_SECRET!,
            { expiresIn: "7d" }
        );

        return { user, accessToken, refreshToken };
    } catch (error: any) {
        console.error("Google Auth Service Error:", error.message);
        throw error;
    }
};
