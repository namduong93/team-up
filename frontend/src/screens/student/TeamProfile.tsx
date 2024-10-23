import { FC  } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../competition_staff_page/components/PageUtils";
import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
// import { sendRequest } from "../../utility/request";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { TeamHeader } from "./TeamHeader";

const TeamToggleOptionDiv = styled(ToggleOptionDiv)`
`;

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

export const TeamProfile: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const compName = "ICPC Regional Championships 2024";
  const teamName = "UNSWKoalas";
  const compCountdown = 34; // days to go

  const teamSite = "UNSW Kensington Campus";
  const teamLevel = "A";
  const students = [
    {
      name: "Student1",
      email: "email1@email.com",
      bio: "I love coding! I love coding! I love coding! I love coding! I love coding! I love coding!",
    },
    {
      name: "Student2",
      email: "email2@email.com",
      bio: "My favourite language is java. My favourite language is java. My favourite language is java. ",
    },
    {
      name: "Student3",
      email: "email3@email.com",
      bio: "First time competing :/",
    },
  ];
  const coach = {
    name: "Coach1",
    email: "coach@email.com",
    office: "Level 304 K17",
  };

  const teamOutletProps = {
    teamName,
    teamSite,
    teamLevel,
    students,
    coach,
    compId,
  };

  return (
  <TeamOverflowFlexBackground>
    <MainPageDiv>
      <TeamHeader compName={compName} teamName={teamName} compCountdown={compCountdown} />
      <PageOptionsContainerDiv>
        <CustomToggleSwitch style={{ width: '100%', height: '100%' }} defaultBorderIndex={0}>
          <TeamToggleOptionDiv onClick={() => { navigate(`/competition/participant/${compId}/details`) }}>
            <ToggleOptionTextSpan>Details</ToggleOptionTextSpan>
          </TeamToggleOptionDiv>
          <TeamToggleOptionDiv onClick={() => { navigate(`/competition/participant/${compId}/manage`) }}>
            <ToggleOptionTextSpan>Manage</ToggleOptionTextSpan>
          </TeamToggleOptionDiv>
        </CustomToggleSwitch>
      </PageOptionsContainerDiv>
      <TeamProfileViews context={teamOutletProps}/>
    </MainPageDiv>
  </TeamOverflowFlexBackground>
  );
}