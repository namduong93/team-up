import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";
import { UniversityService } from "../services/university_service.js";

export class UniversityController {
  private universityService: UniversityService;

  constructor(universityService: UniversityService) {
    this.universityService = universityService;
  }

  universitiesList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    let universitiesList = await this.universityService.universitiesList();
    res.json(universitiesList);
    return;
  });
}