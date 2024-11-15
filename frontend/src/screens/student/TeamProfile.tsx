import { FC, useEffect, useState } from "react";

import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { TeamHeader } from "./components/TeamHeader";
import { sendRequest } from "../../utility/request";

import { ParticipantTeamDetails } from "../../../shared_types/Competition/team/TeamDetails";

import { Announcement } from "../../../shared_types/Competition/staff/Announcement";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../competition/staff_pages/CompetitionPage/subroutes/CommonSubStyles.styles";
import { WithdrawPopUpChain } from "./subcomponents/WithdrawPopupChain/WithdrawPopUpChain";

const TeamToggleOptionDiv = styled(ToggleOptionDiv)``;

const ToggleOptionTextSpan = styled.span`
  font-size: ${({ theme }) => theme.fonts.fontSizes.subheading};
  color: ${({ theme }) => theme.fonts.colour};
`;

const TeamOverflowFlexBackground = styled(OverflowFlexBackground)`
  align-self: flex-end;
  height: 98%;
`;

const TeamProfileViews = styled(Outlet)`
  /* box-sizing: border-box; */
`;

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const defaultAnnouncement = `
The ICPC is the premier global programming competition conducted by and for the world’s universities. It fosters creativity, teamwork, and innovation in building new software programs, and enables students to test their ability to perform well under pressure.

3 students, 5 hours  
1 computer, 12 problems* (typical, but varies per contest)

In 2021, more than 50,000 of the finest students in computing disciplines from over 3,000 universities competed worldwide in the regional phases of this contest. We conduct ICPC contests for the South Pacific region, with top teams qualifying to the World Finals.

The detail can be seen at: [sppcontests.org/south-pacific-icpc](https://sppcontests.org/south-pacific-icpc/)
`;

export const TeamProfile: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [teamDetails, setTeamDetails] = useState<ParticipantTeamDetails>({
    compName: "",
    siteId: 0,
    teamName: "",
    teamSite: "",
    teamSeat: "",
    teamLevel: "",
    startDate: new Date(),
    students: [],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  });
  const [announcements, setAnnouncements] = useState("");  // for coach to set specific comp details/announcements

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const response = await sendRequest.get<ParticipantTeamDetails>(
        "/competition/team/details",
        { compId }
      );

      const details = response.data;
      setTeamDetails({ ...details, startDate: new Date(details.startDate) });
    };

    fetchTeamDetails();

    const fetchCompAnnouncements = async () => {
      const response = await sendRequest.get<{announcement: Announcement}>("/competition/announcement", { compId });
      if(response.data.announcement === undefined) {
        setAnnouncements(defaultAnnouncement);
        return;
      }
      setAnnouncements(response.data.announcement.message);
    };

    fetchCompAnnouncements();
  }, []);

  const teamOutletProps = {
    ...teamDetails,
    compId,
    announcements,
  };

  const compCountdown = Math.round(
    (teamDetails.startDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  const [withdrawPopUpOpen, setWithdrawPopUpOpen] = useState(false);

  const handleWithdrawClick = () => {
    setWithdrawPopUpOpen(true);
  };

  return (
    <TeamOverflowFlexBackground>
      <MainPageDiv>
        <Overlay $isOpen={withdrawPopUpOpen}>
          <WithdrawPopUpChain handleClose={() => setWithdrawPopUpOpen(false)} />
        </Overlay>

        <TeamHeader
          compName={teamDetails.compName}
          teamName={teamDetails.teamName}
          compCountdown={compCountdown}
          onWithdrawClick={handleWithdrawClick}
        />
        <PageOptionsContainerDiv>
          <CustomToggleSwitch
            style={{ width: "100%", height: "100%" }}
            defaultBorderIndex={0}
          >
            <TeamToggleOptionDiv
              onClick={() => {
                navigate(`/competition/participant/${compId}/details`);
              }}
            >
              <ToggleOptionTextSpan>Details</ToggleOptionTextSpan>
            </TeamToggleOptionDiv>
            <TeamToggleOptionDiv
              onClick={() => {
                navigate(`/competition/participant/${compId}/manage`);
              }}
            >
              <ToggleOptionTextSpan>Manage</ToggleOptionTextSpan>
            </TeamToggleOptionDiv>
          </CustomToggleSwitch>
        </PageOptionsContainerDiv>
        <TeamProfileViews context={teamOutletProps} />
      </MainPageDiv>
    </TeamOverflowFlexBackground>
  );
};
