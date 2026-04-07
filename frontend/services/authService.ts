import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL}/api`, 
  withCredentials: true,
});

export const registerUser = async (data: any) => {
  const res = await API.post("/auth/register", data);
  return res.data;
};

export const loginUser = async (data: any) => {
  const res = await API.post("/auth/login", data);
  return res.data;
};
