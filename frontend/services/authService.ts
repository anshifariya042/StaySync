import axios from "axios";

const API = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/auth`,
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
