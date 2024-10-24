import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { UserService } from "../services/user_service.js";
import { httpErrorHandler, INVALID_TOKEN } from "./controller_util/http_error_handler.js";
import { Competition } from "../models/competition/competition.js";

export class CompetitionController {
  private competitionService: CompetitionService;
  
  constructor(competitionService: CompetitionService) {
    this.competitionService = competitionService;
  }
  
  competitionStaff = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const staff = await this.competitionService.competitionStaff(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ staff });
  });

  competitionStudents = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const students = await this.competitionService.competitionStudents(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ students });
  });

  competitionRoles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const roles = await this.competitionService.competitionRoles(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ roles });
  });
  
  competitionTeams = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamList = await this.competitionService.competitionTeams(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ teamList })

  });

  competitionsSystemAdminCreate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const newCompetition: Competition = {
      name: req.body.name,
      createdDate: Date.now(),
      earlyRegDeadline: req.body.earlyRegDeadline,
      generalRegDeadline: req.body.generalRegDeadline,
      code : req.body.code,
      siteLocations: req.body.siteLocations,
      otherSiteLocations: req.body.otherSiteLocations,
    };

    const competitionId = await this.competitionService.competitionSystemAdminCreate(Number(userId), newCompetition);

    res.json(competitionId);

    return;
  });

  competitionSystemAdminUpdate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const newCompetitionDetails: Competition = {
      id: req.body.id,
      name: req.body.name,
      teamSize: req.body.teamSize,
      createdDate: Date.now(),
      earlyRegDeadline: req.body.earlyRegDeadline,
      generalRegDeadline: req.body.generalRegDeadline,
      siteLocations: req.body.siteLocations,
    };

    const competitionId = await this.competitionService.competitionSystemAdminUpdate(Number(userId), newCompetitionDetails);

    res.json(competitionId);

    return;
  });

  competitionGetDetails = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const competitionId = req.query.id;
    const competitionDetails = await this.competitionService.competitionGetDetails(Number(competitionId));

    res.json(competitionDetails);

    return;
  });

  competitionsList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const competitions = await this.competitionService.competitionsList(Number(userId));

    res.json({competitions: competitions});
    return;
  });

  competitionCodeStatus = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const codeStatus = await this.competitionService.competitionCodeStatus(Number(userId), String(code));
    res.json(codeStatus);
    return;
  });

  competitionStudentJoin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const code = req.body.code;
    const competitionUserInfo = req.body.competitionUser;
    competitionUserInfo.userId = Number(req.query.userId);
    await this.competitionService.competitionStudentJoin(String(code), competitionUserInfo);
    res.json({});
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

  competitionStudentWithdraw = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const competitionId = req.body.competitionId;
    const result = await this.competitionService.competitionStudentWithdraw(Number(userId), Number(competitionId));
    res.json(result);
    return;
  });

  competitionRequestTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { competitionId, teamId, newTeamName } = req.body;
    const result = await this.competitionService.competitionRequestTeamNameChange(Number(userId), Number(competitionId), Number(teamId), newTeamName);
    res.json(result);
    return;
  });

  competitionApproveTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({});
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