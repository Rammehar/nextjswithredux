import axiosInstance from "./axiosInstance";
import { get } from "lodash";
import axios from "axios";
import * as cookie from "cookie";
import * as setCookie from "set-cookie-parser";
import {
  reset,
  updateAccessToken,
} from "../../../features/user/redux/userSlice";

const setup = (store) => {
  const { dispatch } = store;

  function didAccessTokenExpire(response: any): boolean {
    return get(response, "data.message") === "Token signature expired.";
  }

  async function regenerateAccessTokenFromRefreshToken() {
    const response = await axios({
      withCredentials: true,
      method: "POST",
      url: `/api/refreshToken`,
    });

    return response;
  }

  axiosInstance.interceptors.request.use((request) => {
    const token = store.getState().user.accessToken;
    request.headers.Authorization = token ? `Bearer ${token}` : "";
    return request;
  });

  axiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
      try {
        if (didAccessTokenExpire(error.response)) {
          const response = await regenerateAccessTokenFromRefreshToken();

          if (axiosInstance.defaults.headers["setCookie"]) {
            delete axiosInstance.defaults.headers["setCookie"];
          }
          const { accessToken } = response.data;
          const bearer = `Bearer ${accessToken}`;

          axiosInstance.defaults.headers.common["Authorization"] = bearer;

        //   const responseCookie = setCookie.parse(
        //     response.headers["set-cookie"]
        //   )[0];
        //   axiosInstance.defaults.headers["setCookie"] =
        //     response.headers["set-cookie"];
        //   axiosInstance.defaults.headers.common["cookie"] = cookie.serialize(
        //     responseCookie.name,
        //     responseCookie.value
        //   );
          dispatch(updateAccessToken({ token: accessToken }));
          error.config.headers["Authorization"] = bearer;
          return axiosInstance.request(error.config);
        }
      } catch (err) {
        console.log("Interceptor Error", err);
        // need to logout user
        dispatch(reset());
      }
      return Promise.reject({ ...error });
    }
  );
};

export default setup;
