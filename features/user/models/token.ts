export type JWTToken = string;

export type RefreshToken = string;

export interface JWTTokenClaims {
  userId: string;
  firstName: string;
  email: string;
  isEmailVerified: boolean;
}
