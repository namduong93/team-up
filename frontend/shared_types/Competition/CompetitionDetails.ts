export interface SiteLocation {
  universityId: number;
  defaultSite: string;
}

export interface OtherSiteLocation {
  universityName: string;
  defaultSite: string;
}

export interface CompetitionInformation {
  information: string;
  name: string;
  region: string;
  timeZone: string;
  startDate: string;
  startTime: string;
  start: string;
  earlyBird: boolean | null;
  earlyBirdDate?: string;
  earlyBirdTime?: string;
  early: string;
  generalDate: string;
  generalTime: string;
  general: string;
  code: string;
  siteLocations: SiteLocation[];
  otherSiteLocations: OtherSiteLocation[];
}
