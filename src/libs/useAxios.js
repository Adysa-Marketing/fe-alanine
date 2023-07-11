import secureStorage from "./secureStorage";
import Config from "config";
import axios from "axios";

const logout = () => {
  secureStorage.removeItem("token");
  secureStorage.removeItem("user");
  window.location.href = "/login";
};

const useAxios = () => {
  const baseUrl = Config.ApiUrl;
  let authToken = secureStorage.getItem("token") ? secureStorage.getItem("token") : null;

  const axiosInstance = axios.create({
    baseUrl,
    headers: { Authorization: `Bearer ${authToken}` },
  });

  axiosInstance.interceptors.request.use((req) => {
    if (!authToken) {
      authToken = localStorage.getItem("token") ? JSON.parse(localStorage.getItem("token")) : null;
      req.headers.Authorization = `Bearer ${authToken?.access}`;
    }

    return req;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.data.message == "Forbidden Access") {
        logout();
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};

export default useAxios;
