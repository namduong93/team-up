
export interface Competition {
  id: number,
  name: string,
  teamSize: number,
  earlyRegDeadline: EpochTimeStamp,
  generalRegDeadline: EpochTimeStamp,
  code: string
}