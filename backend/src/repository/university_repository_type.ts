import { UniversityListObject } from "../models/university/university.js";

export interface UniversityRepository {
  universitiesList(): Promise<UniversityListObject>;
}