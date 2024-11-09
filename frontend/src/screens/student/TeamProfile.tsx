import { FC, useEffect, useState } from "react";
import {
  MainPageDiv,
  OverflowFlexBackground,
  PageOptionsContainerDiv,
  ToggleOptionDiv,
} from "../competition_staff_page/components/PageUtils";
import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { TeamHeader } from "./TeamHeader";
import { sendRequest } from "../../utility/request";

import { WithdrawPopUpChain } from "./components/WithdrawPopUpChain";
import { ParticipantTeamDetails } from "../../../shared_types/Competition/team/TeamDetails";

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

export const TeamProfile: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const [teamDetails, setTeamDetails] = useState<ParticipantTeamDetails>({
    compName: "",
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

  useEffect(() => {
    const fetchTeamDetails = async () => {
      const response = await sendRequest.get<ParticipantTeamDetails>(
        "/competition/team/details",
        { compId }
      );

      const details = response.data;
      setTeamDetails({ ...details, startDate: new Date(details.startDate) });
      console.log(details);
    };

    fetchTeamDetails();
  }, []);

  const teamOutletProps = {
    ...teamDetails,
    compId,
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
