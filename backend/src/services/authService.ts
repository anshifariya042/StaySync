import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User, IUser, UserRole } from "../models/User";

export const registerUser = async (data: Partial<IUser>) => {
  const hashedPassword = await bcrypt.hash(data.password!, 10);

  const user = await User.create({
    ...data,
    password: hashedPassword,
  });

  return user;
};

export const loginUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });

  if (!user) throw new Error("User not found");

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error("Invalid credentials");


  //access token
  const accessToken = jwt.sign(
    { id: user._id, role: user.role, hostelId: user.hostelId },
    process.env.JWT_ACCESS_SECRET!,
    { expiresIn: "15m" }
  );

  // Refresh Token 
  const refreshToken = jwt.sign(
    { id: user._id },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: "7d" }
  );

  return { user, accessToken, refreshToken };
};
