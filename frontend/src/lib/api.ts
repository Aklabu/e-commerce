import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";


//declaration section
let accessToken: string | null = null;
let isRefreshing = false;
let watingQueue: ((token: string) => void)[] = [];
//declarating public routes
const protectedEndPoint = ["/accounts/register/billing-address/","/accounts/refresh/"];

//creating axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://31.97.114.215/api",
  withCredentials: true,
});

const queuingFailedRoute = (callback: (token: string) => void) => {
  watingQueue.push(callback);
};

const executingRoutes = (token: string) => {
  watingQueue.forEach((callback) => callback(token));
  watingQueue = [];
};

// attacing token in header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const isProtected = protectedEndPoint.some((url) =>
      config.url?.includes(url)
    );

    if (accessToken && isProtected) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(`showing error from here ${error}`)
);

//handle token expaired automaticaly

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry: boolean;
    };

    //wait untill original request complete
    if (error.response.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          queuingFailedRoute((token) => {
            if (originalRequest.headers) {
              originalRequest.headers["Authorization"] = `Bearer ${token}`;
            }
            resolve(api(originalRequest));
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await api.post<{ access_token: string }>(
          "/accounts/token/refresh/"
        );
        const newToken = data.access_token;
        accessToken = newToken;

        api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
        executingRoutes(newToken);

        return api(originalRequest);
      } catch (refreshError) {
        console.log("Token refresh failed", refreshError);
        window.localStorage.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const setAccessToken = (token: string | null): void => {
  accessToken = token;
};

// 🔹 Optionally expose getter for debugging
export const getAccessToken = (): string | null => accessToken;

export default api;
