export interface Announcement {
  competitionId: number;
  userId?: number;
  message: string;
  createdAt: EpochTimeStamp;
  universityId: number;
}

