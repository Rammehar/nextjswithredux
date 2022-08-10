import { left, right } from "../../../shared/core/either";
import { Result } from "../../../shared/core/result";
import { APIResponse } from "../../../shared/infra/services/apiResponse";
import { LoginDTO } from "../dtos/loginDTO";
import { User } from "../models/user";
import axios from "../../../shared/infra/services/axiosInstance";

export interface IUserService {
  login(email: string, password: string): Promise<APIResponse<LoginDTO>>;
  loginWithGoogle(token: string): Promise<APIResponse<LoginDTO>>;
  getCurrentUserProfile(): Promise<User>;
  register(
    email: string,
    firstName: string,
    password: string
  ): Promise<APIResponse<void>>;
  verifyEmail(token: string): Promise<APIResponse<void>>;
  passwordChangeRequest(email: string): Promise<APIResponse<void>>;
  resetPassword(
    password: string,
    passwordChangeRequestId: string,
    token: string
  ): Promise<APIResponse<void>>;
  logout(): Promise<APIResponse<void>>;
}

export class UserService implements IUserService {
  public async changePassword(
    currentPassword: string,
    newPassword: string
  ): Promise<APIResponse<void>> {
    try {
      await axios.post("/users/change-password", {
        currentPassword,
        newPassword,
      });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async resetPassword(
    password: string,
    passwordChangeRequestId: string,
    token: string
  ): Promise<APIResponse<void>> {
    try {
      await axios.post("/passwordChangeRequest/reset-password", {
        password,
        passwordChangeRequestId,
        token,
      });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async passwordChangeRequest(
    email: string
  ): Promise<APIResponse<void>> {
    try {
      await axios.post("/passwordChangeRequest", { email });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async login(
    email: string,
    password: string
  ): Promise<APIResponse<LoginDTO>> {
    try {
      const loginResponse = await axios.post("api/login", { email, password });
      // const meResponse = await axios.get("api/me", {
      //   headers: { Authorization: `Bearer ${loginResponse.data.accessToken}` },
      // });

      const dto: LoginDTO = {
        accessToken: loginResponse.data.accessToken,
        //  user: meResponse.data.user as User,
      };
      return right(Result.ok<LoginDTO>(dto));
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async loginWithGoogle(token: string): Promise<APIResponse<LoginDTO>> {
    try {
      const response = await axios.post("/users/login-with-google", {
        googleAuthToken: token,
      });

      const dto: LoginDTO = response.data as LoginDTO;
      return right(Result.ok<LoginDTO>(dto));
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async register(
    firstName: string,
    email: string,
    password: string
  ): Promise<APIResponse<void>> {
    try {
      await axios.post("/users", { firstName, email, password });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async verifyEmail(token: string): Promise<APIResponse<void>> {
    try {
      await axios.post("/users/email-verification", { token });
      return right(Result.ok<void>());
    } catch (err) {
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }

  public async getCurrentUserProfile(): Promise<User> {
    const response = await axios.get("api/me");
    return response.data.user as User;
  }

  public async logout(): Promise<APIResponse<void>> {
    try {
      await axios.post("/api/logout");
      return right(Result.ok<void>());
    } catch (err) {
      console.log("Logout error", err);
      return left(
        err.response ? err.response.data.message : "Connection failed"
      );
    }
  }
}
