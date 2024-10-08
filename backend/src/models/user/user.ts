export interface User {
  id?: number;
  name: string;
  password: string;
  email: string;
  tshirtSize: string;
  pronouns?: string | undefined;
  allergies?: string | undefined;
  accessibilityReqs?: string | undefined;
};

export function validateUser(user: User): string {
  // Validate the user object
  if (!user.name || user.name.length === 0) {
    return "Name is required";
  }

  if (!user.email || user.email.length === 0) {
    return "Email is required";
  }

  if (!user.password || user.password.length === 0) {
    return "Password is required";
  }

  if (!user.tshirtSize || user.tshirtSize.length === 0) {
    return "Tshirt size is required";
  }

  return "";
}

export const enum UserType {
  STUDENT = 'student',
  STAFF = 'staff',
  SYSTEM_ADMIN = 'system_admin'
}

export type UserTypeObject = { type: UserType };

