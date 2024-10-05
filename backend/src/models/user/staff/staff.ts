import { UniversityJSON } from "../../university/university.js";
import { User } from "../user.js";

export interface Staff extends User {
  university: UniversityJSON | undefined;
};