
import { UniversityListObject } from "../models/university/university.js";
import { UniversityRepository } from "../repository/university_repository_type.js";

export type SessionIdObject = { sessionId: string };

export class UniversityService {
  private universityRepository: UniversityRepository;
  
  constructor(userRepository: UniversityRepository) {
    this.universityRepository = userRepository;
  }

  universityCourses = async (userId: number) => {
    return await this.universityRepository.universityCourses(userId);
  }

  universitiesList = async (): Promise<UniversityListObject> => {
    let universitiesList = await this.universityRepository.universitiesList();
    return universitiesList;
  };

}