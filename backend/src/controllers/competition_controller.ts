import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { httpErrorHandler } from "./controller_util/http_error_handler.js";

export class CompetitionController {
  private competitionService: CompetitionService;

  constructor(competitionService: CompetitionService) {
    this.competitionService = competitionService;
  }

  competitionsSystemAdminCreate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ code: 'REG12345' });
    return;
  });

  competitionStudentJoin0 = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ incompleteTeamId: 1 });
    return;
  });

  competitionStudentJoin1 = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ incompleteTeamId: 1 });
    return;
  });

  competitionStudentJoin2 = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ teamId: 1 });
    return;
  });

  competitionStaffJoinCoach = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({});
    return;
  })

  competitionStaffJoinSiteCoordinator = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({});
    return;
  })

  competitionStaffJoinAdmin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({});
    return;
  });

  competitionUniversitiesList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({ id: 1, name: 'Macquarie University' });
    return;
  });

}