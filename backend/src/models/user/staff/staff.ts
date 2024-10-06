import { User, validateUser } from "../user.js";

export interface Staff extends User {
  universityId: number;
};

export function validateStaff(staff: Staff): string {
  // Validate the staff object
  let userValidation = validateUser(staff);
  if (userValidation) {
    return userValidation;
  }

  if (!staff.universityId) {
    return "University ID is required";
  }

  return "";
}