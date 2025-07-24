import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5000/api/auth",
});

export const googleAuth =(code) => api.get(`/google?code=${code}`);

export const githubAuth = (code) => api.get(`/github?code=${code}`);
