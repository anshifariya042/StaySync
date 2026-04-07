import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api/auth`, 
  withCredentials: true,
});

export const registerUser = async (data: any) => {
  const res = await API.post("/register", data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await API.post("/login", data);
  return res.data;
};
