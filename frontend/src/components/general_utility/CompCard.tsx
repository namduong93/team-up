import { FC } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from 'date-fns';

interface CardProps {
  compName: string;
  location: string;
  compDate: string;
  roles: string[];
  compId: string;
  compCreationDate: string;
}

const CompCardContainer = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  margin: 10px;
  width: 275px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CardTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CompHeader = styled.div`
  text-align: left;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonts.fontSizes.large};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

const CardMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
`;

const CardText = styled.div`
  color: ${({ theme }) => theme.fonts.colorLight};
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

const CardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const RoleContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const Role = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 20px;
  padding: 8px 10px;
  width: fit-content;
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

const Countdown = styled.div`
  color: ${({ theme }) => theme.colours.primaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

const ProgressBar = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  border-radius: 20px;
  height: 15px;
  overflow: hidden;
  margin-top: 20px;
`;

const Progress = styled.div<{ width: number }>`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  height: 100%;
  width: ${({ width }) => `${width}%`};
`;

export const CompCard: FC<CardProps> = ({ compName, location, compDate, roles, compId, compCreationDate }) => {
  const navigate = useNavigate();

  // for demo A
  const roleUrl = (role: string) => {
    switch (role) {
      case "Participant":
        return `/competition/participant`;
      case "Coach":
        return `/coach/page`;
      case "Site-Coordinator":
        return `/competition/${compId}/site-coordinator`;
      case "Admin":
        return `/competition/${compId}/admin`;
      default:
        return `/competition/${compId}/participant`;
    }
  };

  // const roleUrl = (role: string) => {
  //   switch (role) {
  //     case "Participant":
  //       return `/competition/${compId}/participant`;
  //     case "Coach":
  //       return `/competition/${compId}/coach`;
  //     case "Site-Coordinator":
  //       return `/competition/${compId}/site-coordinator`;
  //     case "Admin":
  //       return `/competition/${compId}/admin`;
  //     default:
  //       return `/competition/${compId}/participant`;
  //   }
  // };

  const compDateFormatted = format(new Date(compDate), 'MMMM yyyy');
  const today = new Date(); // Today's date
  const daysRemaining = differenceInDays(new Date(compDate), today);
  
  // calculate the width of the progress bar as a percentage of the total days
  const compCreationDateFormatted = new Date(compCreationDate);
  const totalDays = differenceInDays(new Date(compDate), compCreationDateFormatted);
  
  // calculate the progress width
  const progressWidth = totalDays > 0 ? ((totalDays - daysRemaining) / totalDays) * 100 : 100; // set to 100% if no days left
  return (
    <CompCardContainer onClick={() => navigate(roleUrl(roles[0]))}>
      <CardHeader>
        <CardTop>
          <CompHeader>
            <h2>{compName}</h2>
          </CompHeader>
        </CardTop>
      </CardHeader>

      <CardMiddle>
        <CardText>{location}</CardText>
        <CardText>{compDateFormatted}</CardText>
      </CardMiddle>

      <CardBottom>
        <RoleContainer>
          {roles.map((role, index) => (
            <Role key={index}>{role}</Role>
          ))}
        </RoleContainer>
        <Countdown>{daysRemaining > 0 ? `${daysRemaining} days to go!` : "Competition ended!"}</Countdown>
      </CardBottom>

      <ProgressBar>
        <Progress width={progressWidth} />
      </ProgressBar>
    </CompCardContainer>
  );
};
