import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { UserService } from "../services/user_service.js";
import { httpErrorHandler, INVALID_TOKEN } from "./controller_util/http_error_handler.js";
import { Competition } from "../models/competition/competition.js";
import { UserType } from "../models/user/user.js";

export class CompetitionController {
  private competitionService: CompetitionService;
  private userService: UserService;

  constructor(competitionService: CompetitionService) {
    this.competitionService = competitionService;
  }

  competitionsSystemAdminCreate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    // Verify system admin
    const userTypeObject = await this.userService.userType(Number(userId));
    if (userTypeObject.type !== UserType.SYSTEM_ADMIN) {
      throw INVALID_TOKEN;
    }

    const newCompetition: Competition = {
      name: req.body.name,
      earlyRegDeadline: req.body.earlyRegDeadline,
      generalRegDeadline: req.body.generalRegDeadline,
      siteLocations: req.body.siteLocations,
    };

    const competitionId = await this.competitionService.competitionsSystemAdminCreate(Number(userId), newCompetition);
    
    res.json(competitionId);

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