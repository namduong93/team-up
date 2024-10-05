import { University } from "../../university/university.js";
import { User } from "../user.js";

export interface Staff extends User {
  university: University | undefined;
};