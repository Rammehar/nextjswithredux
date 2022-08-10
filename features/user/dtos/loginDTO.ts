import { JWTToken, RefreshToken } from "../models/token";
import { User } from "../models/user";

export interface LoginDTO {
  accessToken: JWTToken;
  // user: User;
}
