import { University } from "../../university/university.js";
import { User } from "../user.js";

export interface Staff extends User {
  university: University | undefined;
};

export function validateStaff(staff: Staff): string {
  // Validate the staff object
  if (!staff.name || staff.name.length === 0) {
    return "Name is required";
  }

  if (!staff.email || staff.email.length === 0) {
    return "Email is required";
  }

  if (!staff.password || staff.password.length === 0) {
    return "Password is required";
  }

  if (!staff.tshirtSize || staff.tshirtSize.length === 0) {
    return "Tshirt size is required";
  }

  return "";
}