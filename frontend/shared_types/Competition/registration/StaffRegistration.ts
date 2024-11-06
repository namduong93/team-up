import { CompetitionRole } from "../CompetitionRole";

export interface StaffRegistration {
  roles: CompetitionRole[];
  capacity?: number;
  site?: string;
  institution?: string;
  competitionBio?: string;
}