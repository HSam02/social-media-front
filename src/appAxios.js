import axios from "axios";

const appAxios = axios.create({
  baseURL: process.env.REACT_APP_API_URL
});

appAxios.interceptors.request.use((config) => {
  config.headers.Authorization = window.localStorage.getItem("token") || "";
  return config;
});

export default appAxios;
