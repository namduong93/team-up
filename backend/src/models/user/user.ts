export interface User {
  id?: number;
  name: string;
  preferredName?: string | undefined;
  email: string;
  password: string;
  gender: string;
  pronouns: string;
  tshirtSize: string;
  allergies?: string | undefined;
  dietaryReqs?: string[] | undefined;
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

  if(!user.gender || user.gender.length === 0) {
    return "Gender is required";
  }

  if(!user.pronouns || user.pronouns.length === 0) {
    return "Pronouns is required";
  }

  return "";
}

export const enum UserType {
  STUDENT = 'student',
  STAFF = 'staff',
  SYSTEM_ADMIN = 'system_admin'
}

export type UserTypeObject = { type: UserType };

export function convertGenderToP(gender: string) {
  switch (gender) {
    case "Male":
      return "He/Him";
    case "Female":
      return "She/Her";
    default:
      return "They/Them";
  }
}

