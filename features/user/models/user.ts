export interface User {
  firstName: string;
  lastName: string;
  email: string;
  isEmailVerified: boolean;
  isDeleted: boolean;
  isAdminUser: boolean;
  userType: string;
  phone: string;
  imageUrl: string;
}
