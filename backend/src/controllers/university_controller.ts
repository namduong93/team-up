import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";
import { UniversityService } from "../services/university_service.js";

export class UniversityController {
  private universityService: UniversityService;
  
  constructor(universityService: UniversityService) {
    this.universityService = universityService;
  }

  /**
   * Handles the request to retrieve university courses for a specific user.
   */
  universityCourses = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const courses = await this.universityService.universityCourses(parseInt(userId as string));

    res.json({ courses });
    return;
  });

  /**
   * Handles the request to get the list of universities.
   */
  universitiesList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    let universitiesList = await this.universityService.universitiesList();
    res.json(universitiesList);
    return;
  });
}