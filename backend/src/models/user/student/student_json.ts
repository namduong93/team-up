
import { UniversityJSON } from "../../university/university_json.js";
import { UserJSON } from "../user_json.js";

export interface StudentJSON extends UserJSON {
  university: UniversityJSON | undefined;
  studentId: string | undefined;
};