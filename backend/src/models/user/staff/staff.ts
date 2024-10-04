import { University } from "../../university/university.js";
import { User } from "../user.js";

export class Staff extends User {
  private university: University | undefined;

  constructor(
    id: number, name: string, hashedPassword: string, email: string,
    tshirt_size: string, pronouns?: string | undefined, allergies?: string | undefined,
    accessibilityReqs?: string | undefined, university?: University | undefined
  ) {
    super(id, name, hashedPassword, email, tshirt_size, pronouns, allergies, accessibilityReqs);
    this.university = university;
  }
}