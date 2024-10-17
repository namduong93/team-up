import { FC  } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../staff/CoachPage/CoachPage";
// import { PageHeader } from "../../components/sort_filter_search/PageHeader";
import { CustomToggleSwitch } from "../../components/general_utility/ToggleSwitch";
import styled from "styled-components";
// import { sendRequest } from "../../utility/request";
import { useNavigate, useParams } from "react-router-dom";
import { TeamHeader } from "./TeamHeader";

const TeamToggleOptionDiv = styled(ToggleOptionDiv)`
`;

const ToggleOptionTextSpan = styled.span`
  font-size: ${({ theme }) => theme.fonts.fontSizes.subheading};
`;

const TeamOverflowFlexBackground = styled(OverflowFlexBackground)`
  align-self: flex-end;
  height: 98%;
`;

export const TeamProfile: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const compName = "ICPC Regional Championships 2024";
  const teamName = "UNSWKoalas";
  const compCountdown = 34; // days to go

  return (
  <TeamOverflowFlexBackground>
    <MainPageDiv>
      <TeamHeader compName={compName} teamName={teamName} compCountdown={compCountdown} />
      <PageOptionsContainerDiv>
        <CustomToggleSwitch style={{ width: '100%', height: '100%' }} defaultBorderIndex={0}>
          <TeamToggleOptionDiv onClick={() => { navigate(`/competition/page/participant/${compId}/details`) }}>
            <ToggleOptionTextSpan>Details</ToggleOptionTextSpan>
          </TeamToggleOptionDiv>
          <TeamToggleOptionDiv onClick={() => { navigate(`/competition/page/participant/${compId}/manage`) }}>
            <ToggleOptionTextSpan>Manage</ToggleOptionTextSpan>
          </TeamToggleOptionDiv>
        </CustomToggleSwitch>
      </PageOptionsContainerDiv>
    </MainPageDiv>
  </TeamOverflowFlexBackground>
  );
}