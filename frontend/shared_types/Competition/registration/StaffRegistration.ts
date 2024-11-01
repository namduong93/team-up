import { CompetitionRole } from "../CompetitionRole";
import { CompetitionSite } from "../CompetitionSite";

export interface StaffRegistration {
  roles: CompetitionRole[];
  site?: CompetitionSite;
  institution?: University;
  competitionBio?: string;
}

export interface University {
  id: number;
  name: string;
}