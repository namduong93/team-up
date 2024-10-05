import { User, validateUser } from "../user.js";

export interface Staff extends User {
  universityId: number;
};

export function validateStaff(staff: Staff): string {
  // Validate the staff object
  if (validateUser(staff) !== "") {
    return validateUser(staff);
  }

  if (!staff.universityId) {
    return "University ID is required";
  }

  return "";
}