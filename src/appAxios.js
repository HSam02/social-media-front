import axios from "axios";

const appAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  },
});

appAxios.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token") || "";
  return config;
});

export default appAxios;
