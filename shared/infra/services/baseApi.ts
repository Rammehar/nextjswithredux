import axios, { AxiosInstance } from "axios";
import { get } from "lodash";
import * as cookie from "cookie";
import * as setCookie from "set-cookie-parser";

import { apiConfig } from "../../../config";
import { JWTToken } from "../../../features/user/models/token";
import { IAuthService } from "../../../features/user/services/authService";

let store: any;
export const injectStore = (_store: any) => {
  store = _store;
};

export abstract class BaseAPI {
  protected baseUrl: string;
  private axiosInstance: AxiosInstance | any = null;
  public authService: IAuthService;

  constructor(authService: IAuthService) {
    this.authService = authService;
    this.baseUrl = apiConfig.baseUrl as string;

    this.axiosInstance = axios.create({
      withCredentials: true,
      baseURL: this.baseUrl,
    });

    this.enableInterceptors();
  }

  private enableInterceptors(): void {
    this.axiosInstance.interceptors.response.use(
      this.getSuccessResponseHandler(),
      this.getErrorResponseHandler()
    );
  }

  private didAccessTokenExpire(response: any): boolean {
    return get(response, "data.message") === "Token signature expired.";
  }

  private async regenerateAccessTokenFromRefreshToken(): Promise<JWTToken> {
    const response = await axios({
      withCredentials: true,
      method: "POST",
      url: `${this.baseUrl}/users/token/refresh`,
    });
    if (this.axiosInstance.defaults.headers["setCookie"]) {
      delete this.axiosInstance.defaults.headers["setCookie"];
    }

    const { accessToken } = response.data;
    // 2. Set up new access token
    const bearer = `Bearer ${accessToken}`;
    this.axiosInstance.defaults.headers.common["Authorization"] = bearer;

    // 3. Set up new refresh token as cookie
    const responseCookie = setCookie.parse(response.headers["set-cookie"])[0];
    // 3a. We can't just acces it, we need to parse it first.
    this.axiosInstance.defaults.headers["setCookie"] =
      response.headers["set-cookie"];
    // 3b. Set helper cookie for 'authorize.ts' Higher order Function.
    this.axiosInstance.defaults.headers.common["cookie"] = cookie.serialize(
      responseCookie.name,
      responseCookie.value
    );

    return response.data.accessToken;
  }

  private getSuccessResponseHandler() {
    return (response: any) => {
      return response;
    };
  }

  private getErrorResponseHandler() {
    return async (error: any) => {
      if (this.didAccessTokenExpire(error.response)) {
        try {
          // this method set the refresh token and accessToken in cookies httpOnly
          const accessToken =
            await this.regenerateAccessTokenFromRefreshToken();
          error.response.config.headers[
            "Authorization"
          ] = `Bearer ${accessToken}`;
          return this.axiosInstance.request(error.config);
        } catch (err) {
          throw new Error(err);
          // here we need to clear local state of auth user
          // because refresh token expired
          // thats why we are in this catch block
          // we need to trigger logout action from here
          // store.dispatch(logoutLocally({}));
        }
      }
      return Promise.reject({ ...error });
    };
  }

  protected get(url: string, params?: any, headers?: any): Promise<any> {
    return this.axiosInstance({
      method: "GET",
      url: `${url}`,
      params: params ? params : null,
      headers: headers ? headers : null,
    });
  }

  protected post(
    url: string,
    data?: any,
    params?: any,
    headers?: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<any> {
    return this.axiosInstance.post(`${url}`, data ? data : null, {
      params: params ? params : null,
      headers: headers ? headers : null,
      onUploadProgress,
    });
  }

  protected delete(
    url: string,
    data?: any,
    params?: any,
    headers?: any,
    onUploadProgress?: (progressEvent: any) => void
  ): Promise<any> {
    return this.axiosInstance.delete(`${url}`, data ? data : null, {
      params: params ? params : null,
      headers: headers ? headers : null,
      onUploadProgress,
    });
  }
}
