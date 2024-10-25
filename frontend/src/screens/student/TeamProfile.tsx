import { FC, useEffect, useState  } from "react";
import { MainPageDiv, OverflowFlexBackground, PageOptionsContainerDiv, ToggleOptionDiv } from "../competition_staff_page/components/PageUtils";
import { CustomToggleSwitch } from "../../components/toggle_switch/ToggleSwitch";
import styled from "styled-components";
// import { sendRequest } from "../../utility/request";
import { useNavigate, useParams, Outlet } from "react-router-dom";
import { TeamHeader } from "./TeamHeader";
import { WithdrawPopUpChain } from "./WithdrawPopUpChain";

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

const Overlay = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? "block" : "none")};
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`

export const TeamProfile: FC = () => {
  const navigate = useNavigate();
  const { compId } = useParams();
  const compName = "ICPC Regional Championships 2024";
  const teamName = "UNSWKoalas";
  const compCountdown = 34; // days to go

  const teamSite = "UNSW K17 Building";
  const teamSeat = "Bongo 03"
  const teamLevel = "A";
  const students = [
    {
      name: "Student1",
      email: "email1@email.com",
      bio: "I love coding! I love coding! I love coding! I love coding! I love coding! I love coding!",
      preferredContact: "Instagram:@hollie",
    },
    {
      name: "Student2",
      email: "email2@email.com",
      bio: "My favourite language is java. My favourite language is java. My favourite language is java. ",
      preferredContact: "Discord:@john",
    },
    {
      name: "Student3",
      email: "email3@email.com",
      bio: "First time competing :/",
      preferredContact: "Twitter:@stewie",
    },
  ];
  const coach = {
    name: "Coach1",
    email: "coach@email.com",
    bio: "I think P = NP :)",
  };

  const teamOutletProps = {
    teamName,
    teamSite,
    teamSeat,
    teamLevel,
    students,
    coach,
    compId,
  };

  // const location = useLocation();
  const [withdrawPopUpOpen, setWithdrawPopUpOpen] = useState(false);

  // const handleClosePopUp = () => {
  //   setWithdrawPopUpOpen(false);
  // }

  const handleWithdrawClick = () => {
    setWithdrawPopUpOpen(true);
  }
  
  return (
  <TeamOverflowFlexBackground>
    <MainPageDiv>

    <Overlay $isOpen={withdrawPopUpOpen}>
      <WithdrawPopUpChain handleClose={() => setWithdrawPopUpOpen(false)}/>
    </Overlay>

      <TeamHeader compName={compName} teamName={teamName} compCountdown={compCountdown} onWithdrawClick={handleWithdrawClick}/>
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