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

  /**
   * Updates the details of a number of staff for a competition.
   */
  competitionStaffUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const staffList = req.body.staffList as Array<StaffInfo>;
    const compId = req.body.compId as number;
    
    await this.competitionService.competitionStaffUpdate(parseInt(userId as string), staffList, compId);

    res.json({});
  });

  /**
   * Updates the details of a number of students for a competition.
   */
  competitionStudentsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const studentList = req.body.studentList as Array<StudentInfo>;
    const compId = req.body.compId as number;

    await this.competitionService.competitionStudentsUpdate(parseInt(userId as string), studentList, compId);

    res.json({});
  });

  /**
   * Updates the details of a number of teams in a competition.
   */
  competitionTeamsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const teamList = req.body.teamList as Array<TeamDetails>;
    const compId = req.body.compId as number;

    await this.competitionService.competitionTeamsUpdate(parseInt(userId as string), teamList, compId);
    res.json({});
  });

  /**
   * Handles the request to get competition site codes based on the provided code query parameter.
   */
  competitionSitesCodes = httpErrorHandler(async (req: Request, res: Response) => {
    const { code } = req.query;

    const sites = await this.competitionService.competitionSitesCodes(code as string);

    res.json({ sites });
  });

  /**
   * Handles the request to get competition sites based on the competition ID.
   */
  competitionSites = httpErrorHandler(async (req: Request, res: Response) => {
    const { compId } = req.query;

    const sites = await this.competitionService.competitionSites(parseInt(compId as string));

    res.json({ sites });
  });

  /**
   * Handles the request to get the attendees of a competition.
   */
  competitionAttendees = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const attendees = await this.competitionService.competitionAttendees(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ attendees });
  });

  /**
   * Handles the request to get the details of a team in a competition.
   */
  competitionTeamDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamDetails = await this.competitionService.competitionTeamDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json(teamDetails);
  });

  /**
   * Handles the request to generate an invite code for a competition team.
   */
  competitionTeamInviteCode = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const inviteCode = await this.competitionService.competitionTeamInviteCode(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ code: inviteCode });
  });

  /**
   * Handles the request to join a competition team by a user.
   */
  competitionTeamJoin = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId, teamCode } = req.body;

    const teamId = await this.competitionService.competitionTeamJoin(Number(userId), Number(compId), String(teamCode));

    res.json({ teamName: 'teamName' });
  });

  /**
   * Handles the request to get student details for a specific competition.
   */
  competitionStudentDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    console.log(userId, compId);

    const studentDetails = await this.competitionService.competitionStudentDetails(
      parseInt(userId as string), parseInt(compId as string));

    console.log(studentDetails);

    res.json({studentDetails});
  });

  competitionStaffDetails = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const staffDetails = await this.competitionService.competitionStaffDetails(
      parseInt(userId as string), parseInt(compId as string));

    res.json({staffDetails});
  });

  competitionStaffDetailsUpdate = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId } = req.query;
    const { compId } = req.body;
    const staffDetails = req.body.staffInfo as StaffInfo;
    await this.competitionService.competitionStaffDetailsUpdate(
      parseInt(userId as string), parseInt(compId as string), staffDetails);
    res.json({});
  });
  
  /**
   * Handles the request to get competition staff by user ID and competition ID.
   */
  competitionStaff = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const staff = await this.competitionService.competitionStaff(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ staff });
  });

  /**
   * Handles the request to get students participating in a competition.
   */
  competitionStudents = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const students = await this.competitionService.competitionStudents(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ students });
  });

  /**
   * Handles the request to get competition roles for a user in a specific competition.
   */
  competitionRoles = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;
    const roles = await this.competitionService.competitionRoles(
      parseInt(userId as string), parseInt(compId as string));
    
    res.json({ roles });
  });
  
  /**
   * Handles the request to get the list of teams in a competition.
   */
  competitionTeams = httpErrorHandler(async (req: Request, res: Response) => {
    const { userId, compId } = req.query;

    const teamList = await this.competitionService.competitionTeams(
      parseInt(userId as string), parseInt(compId as string));

    res.json({ teamList })
  });

  /**
   * Handles the creation of a new competition by a system admin.
   */
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

  /**
   * Updates competition details by system admin.
   */
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

  /**
   * Handles the request to get competition details by competition ID.
   */
  competitionGetDetails = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const competitionId = req.query.compId;
    const competitionDetails = await this.competitionService.competitionGetDetails(Number(competitionId));

    res.json({competition: competitionDetails});

    return;
  });

  /**
   * Handles the request to get a list of competitions that the user is a part of.
   */
  competitionsList = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;

    const competitions = await this.competitionService.competitionsList(Number(userId));

    res.json({competitions: competitions});
    return;
  });

  /**
   * Handles the request to verify a competition code.
   */
  competitionCodeStatus = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const codeStatus = await this.competitionService.competitionCodeStatus(Number(userId), String(code));
    res.json(codeStatus);
    return;
  });

  /**
   * Handles the request to get the default site for a competition user.
   */
  competitionUserDefaultSite = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, code } = req.query;
    const defaultSite = await this.competitionService.competitionUserDefaultSite(Number(userId), String(code));
    res.json({ site : defaultSite });
    return;
  });

  /**
   * Handles the request for a student to join a competition by code.
   */
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

  /**
   * Handles the withdrawal of a student from a competition.
   */
  competitionStudentWithdraw = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const compId = req.body.compId;
    const result = await this.competitionService.competitionStudentWithdraw(Number(userId), Number(compId));
    res.json(result);
    return;
  });
  
  /**
   * Approves team assignments for a competition.
   */
  competitionApproveTeamAssignment = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds } = req.body;
    const result = await this.competitionService.competitionApproveTeamAssignment(Number(userId), Number(compId), approveIds);
    res.json(result);
    return;
  });

  /**
   * Handles a request to change a team's name in a competition.
   */
  competitionRequestTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newTeamName } = req.body;
    const result = await this.competitionService.competitionRequestTeamNameChange(Number(userId), Number(compId), newTeamName);
    res.json(result);
    return;
  });

  /**
   * Approves or rejects team name change requests for a competition.
   */
  competitionApproveTeamNameChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionService.competitionApproveTeamNameChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
    return;
  });

  /**
   * Handles the request to change the site of a competition for a user.
   */
  competitionRequestSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, newSiteId } = req.body;
    const result = await this.competitionService.competitionRequestSiteChange(Number(userId), Number(compId), Number(newSiteId));
    res.json(result);
  });

  /**
   * Handles the approval or rejection of site changes for a competition.
   */
  competitionApproveSiteChange = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, approveIds, rejectIds } = req.body;
    const result = await this.competitionService.competitionApproveSiteChange(Number(userId), Number(compId), approveIds, rejectIds);
    res.json(result);
  });

  /**
   * Handles the assignment of team seats in a competition.
   */
  competitionTeamSeatAssignments = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, seatAssignments} = req.body;
    const result = await this.competitionService.competitionTeamSeatAssignments(Number(userId), Number(compId), seatAssignments);
    res.json(result);
  });

  /**
   * Registers teams for a competition.
   */
  competitionRegisterTeams = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.query.userId;
    const { compId, teamIds } = req.body;
    const result = await this.competitionService.competitionRegisterTeams(Number(userId), Number(compId), teamIds);
    res.json(result);
  });

  /**
   * Handles the request for a user to join a competition as staff.
   */
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

  competitionAnnouncement = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId, compId, universityId } = req.query;
    const announcement = await this.competitionService.competitionAnnouncement(
      parseInt(userId as string), parseInt(compId as string), parseInt(universityId as string));
    
    res.json(announcement);
    return;
  });

  competitionAnnouncementUpdate = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;
    const { compId, universityId } = req.body;
    const announcementMessage = req.body.announcementMessage;
    await this.competitionService.competitionAnnouncementUpdate(
      parseInt(userId as string), parseInt(compId as string), announcementMessage, parseInt(universityId as string));
    res.json({});
    return;
  });

  competitionStaffJoinSiteCoordinator = httpErrorHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({});
    return;
  });

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