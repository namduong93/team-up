
import { UniversityListObject } from "../models/university/university.js";
import { UniversityRepository } from "../repository/university_repository_type.js";

export type SessionIdObject = { sessionId: string };

export class UniversityService {
  private userRepository: UniversityRepository;

  constructor(userRepository: UniversityRepository) {
    this.userRepository = userRepository;
  }

  universitiesList = async (): Promise<UniversityListObject> => {
    let universitiesList = await this.userRepository.universitiesList();
    return universitiesList;
  };

}