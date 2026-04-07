import axios from 'axios';


console.log("ENV:", process.env.REACT_APP_API_URL); // 👈 ADD HERE

const api = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}/api/auth`,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use(
    (config) => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('accessToken');
            }
        }
        return Promise.reject(error);
    }
);

export default api;
