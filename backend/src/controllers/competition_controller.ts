import { Request, Response } from "express";
import { CompetitionService } from "../services/competition_service.js";
import { httpErrorHandler, INVALID_TOKEN } from "./controller_util/http_error_handler.js";
import { Competition } from "../models/competition/competition.js";
import { CompetitionAccessLevel, CompetitionStaff } from "../models/competition/competitionUser.js";
import { TeamDetails } from "../../shared_types/Competition/team/TeamDetails.js";
import { StudentInfo } from "../../shared_types/Competition/student/StudentInfo.js";
import { StaffInfo } from "../../shared_types/Competition/staff/StaffInfo.js";
import { EditRego } from "../../shared_types/Competition/staff/Edit.js";

export class CompetitionController {
  private competitionService: CompetitionService;
  
  constructor(competitionService: CompetitionService) {
    this.competitionService = competitionService;
  }

  competitionStudentsRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, code } = req.query;
    const regoFields = await this.competitionService.competitionStudentsRegoToggles(
      parseInt(userId as string), code as string);

    res.json({ regoFields });
  });
  
  competitionStaffUpdateRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId, regoFields, universityId } = req.body as {
      compId: number, regoFields: EditRego, universityId?: number 
    };

    await this.competitionService.competitionStaffUpdateRegoToggles(
      parseInt(userId as string), compId, regoFields, universityId);

    res.json({});
  });

  competitionStaffRegoToggles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId, universityId } = req.query;

    const regoFields = await this.competitionService.competitionStaffRegoToggles(
      parseInt(userId as string), parseInt(compId as string), parseInt(universityId as string));
    
    res.json({ regoFields });
  });

  competitionStaffUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const staffList = req.body.staffList as Array<StaffInfo>;
    const compId = req.body.compId as number;
    
    await this.competitionService.competitionStaffUpdate(parseInt(userId as string), staffList, compId);

    res.json({});
  });

  competitionStudentsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const studentList = req.body.studentList as Array<StudentInfo>;
    const compId = req.body.compId as number;

    await this.competitionService.competitionStudentsUpdate(parseInt(userId as string), studentList, compId);

    res.json({});
  });

  competitionTeamsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const teamList = req.body.teamList as Array<TeamDetails>;
    const compId = req.body.compId as number;

    await this.competitionService.competitionTeamsUpdate(parseInt(userId as string), teamList, compId);
    res.json({});
  });

  competitionSitesCodes = httpErrorHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    const sites = await this.competitionService.competitionSitesCodes(code as string);

    res.json({ sites });
  });

  competitionSites = httpErrorHandler(async (req: Request, res: Response) => {
    const { compId } = req.query;

    const sites = await this.competitionService.competitionSites(parseInt(compId as string));

    res.json({ sites });
  });

  competitionAttendees = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const attendees = await this.competitionService.competitionAttendees(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ attendees });
  });

  competitionTeamDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamDetails = await this.competitionService.competitionTeamDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json(teamDetails);
  });

  competitionTeamInviteCode = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const inviteCode = await this.competitionService.competitionTeamInviteCode(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ code: inviteCode });
  });

  competitionTeamJoin = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId, teamCode } = req.body;

    const teamId = await this.competitionService.competitionTeamJoin(Number(userId), Number(compId), String(teamCode));

    res.json({ teamName: 'teamName' });
  });

  competitionStudentDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const studentDetails = await this.competitionService.competitionStudentDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json({studentDetails});
  });
  
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
      startDate: req.body.startDate,
      code: req.body.code,
      siteLocations: req.body.siteLocations,
      otherSiteLocations: req.body.otherSiteLocations,
      region: req.body.region,
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
      startDate: req.body.startDate,
      siteLocations: req.body.siteLocations,
      region: req.body.region,
    };

    const competitionId = await this.competitionService.competitionSystemAdminUpdate(Number(userId), newCompetitionDetails);

    res.json(competitionId);

    return;
  });

  competitionGetDetails = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const competitionId = req.query.compId;
    const competitionDetails = await this.competitionService.competitionGetDetails(Number(competitionId));

    res.json({competition: competitionDetails});

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

  competitionUserDefaultSite = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const defaultSite = await this.competitionService.competitionUserDefaultSite(Number(userId), String(code));
    res.json({ site : defaultSite });
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
    const compId = req.body.compId;
    const result = await this.competitionService.competitionStudentWithdraw(Number(userId), Number(compId));
    res.json(result);
    return;
  });
  
  competitionApproveTeamAssignment = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds } = req.body;
    const result = await this.competitionService.competitionApproveTeamAssignment(Number(userId), Number(compId), approveIds);
    res.json(result);
    return;
  });

  competitionRequestTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newTeamName } = req.body;
    const result = await this.competitionService.competitionRequestTeamNameChange(Number(userId), Number(compId), newTeamName);
    res.json(result);
    return;
  });

  competitionApproveTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionService.competitionApproveTeamNameChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
    return;
  });

  competitionRequestSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newSiteId } = req.body;
    const result = await this.competitionService.competitionRequestSiteChange(Number(userId), Number(compId), Number(newSiteId));
    res.json(result);
  });

  competitionApproveSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionService.competitionApproveSiteChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
  });

  competitionTeamSeatAssignments = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, seatAssignments} = req.body;
    const result = await this.competitionService.competitionTeamSeatAssignments(Number(userId), Number(compId), seatAssignments);
    res.json(result);
  });

  competitionRegisterTeams = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, teamIds } = req.body;
    const result = await this.competitionService.competitionRegisterTeams(Number(userId), Number(compId), teamIds);
    res.json(result);
  });

  competitionStaffJoin = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const code = req.body.code;
    let competitionStaffInfo : CompetitionStaff = {
      userId: Number(userId),
      competitionRoles: req.body.staffRegistrationData.roles,
      accessLevel: CompetitionAccessLevel.PENDING,
      siteLocation: req.body.staffRegistrationData.site,
      competitionBio: req.body.staffRegistrationData.competitionBio
    }
    console.log(competitionStaffInfo);
    await this.competitionService.competitionStaffJoin(String(code), competitionStaffInfo);
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

  competitionAlgorithm = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    let userId = req.query.userId;
    const compId = req.body.compId;
    const teamParticipant = await this.competitionService.competitionAlgorithm(Number(compId), Number(userId));
    res.json(teamParticipant);
    return;
  });

}