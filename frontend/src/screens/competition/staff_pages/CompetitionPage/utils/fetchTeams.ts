import { TeamDetails } from "../../../../../../shared_types/Competition/team/TeamDetails";
import { sendRequest } from "../../../../../utility/request";

export const fetchTeams = async (
  compId: string | undefined,
  setTeams: React.Dispatch<React.SetStateAction<Array<TeamDetails>>>
) => {
  try {
    const response = await sendRequest.get<{ teamList: Array<TeamDetails> }>(
      "/competition/teams",
      { compId }
    );
    const { teamList } = response.data;
    console.log(teamList);
    setTeams(teamList.map((team) => ({ ...team, students: team.students.filter((student) => student.userId !== null) })));

  } catch (error: unknown) {
    console.log(error);
  }
};