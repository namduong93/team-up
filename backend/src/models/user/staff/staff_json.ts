import { UniversityJSON } from "../../university/university_json.js";
import { UserJSON } from "../user_json.js";

export interface StaffJSON extends UserJSON {
  university: UniversityJSON | undefined;
};