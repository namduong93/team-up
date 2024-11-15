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

const StyledCompCardContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 10px;
  box-sizing: border-box;
  width: 100%;
  max-width: 285px;
  height: fit-content;
  display: flex;
  flex-direction: column;
  cursor: pointer;
  transition: transform 0.2s ease-in-out !important;
  box-sizing: border-box;

  &:hover {
    transform: translate(3px, 3px);
  }
`;

const StyledCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCardTop = styled.div`
  display: flex;
  justify-content: space-between;
`;

const StyledCompHeader = styled.div`
  text-align: left;

  h2 {
    margin: 0;
    font-size: ${({ theme }) => theme.fonts.fontSizes.large};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;

const StyledCardMiddle = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledCardText = styled.div`
  color: ${({ theme }) => theme.fonts.colour};
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

const StyledCardBottom = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
`;

const StyledRoleContainer = styled.div`
  display: flex;
  gap: 5px;
  flex-direction: column;
`;

const StyledRole = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  color: ${({ theme }) => theme.background};
  border: none;
  border-radius: 20px;
  box-sizing: border-box;
  padding: 8px 10px;
  width: fit-content;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

const StyledCountdown = styled.div`
  color: ${({ theme }) => theme.colours.primaryDark};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
`;

const StyledProgressBar = styled.div`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  border-radius: 20px;
  height: 15px;
  overflow: hidden;
  margin-top: 20px;
  box-sizing: border-box;
`;

const StyledProgress = styled.div<{ $width: number }>`
  background-color: ${({ theme }) => theme.colours.primaryDark};
  height: 100%;
  width: ${({ $width: width }) => `${width}%`};
`;

export const CompCard: FC<CardProps> = ({ compName, location, compDate, roles, compId, compCreationDate }) => {
  const navigate = useNavigate();

  // for demo A
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const roleUrl = (_: string) => {
    if (roles.includes('Participant')) {
      return `/competition/participant/${compId}`;
    }
    return `/competition/page/${compId}`;
  };

  const compDateFormatted = format(new Date(compDate), 'MMMM yyyy');
  const today = new Date(); // Today's date
  const daysRemaining = differenceInDays(new Date(compDate), today);
  
  // calculate the width of the progress bar as a percentage of the total days
  const compCreationDateFormatted = new Date(compCreationDate);
  let totalDays = differenceInDays(new Date(compDate), compCreationDateFormatted);
  totalDays = Math.max(totalDays, daysRemaining);
  
  // calculate the progress width
  const progressWidth = totalDays > 0 ? ((totalDays - daysRemaining) / totalDays) * 100 : 100; // set to 100% if no days left
  return (
    <StyledCompCardContainer onClick={() => navigate(roleUrl(roles[0]))}>
      <StyledCardHeader>
        <StyledCardTop>
          <StyledCompHeader>
            <h2>{compName}</h2>
          </StyledCompHeader>
        </StyledCardTop>
      </StyledCardHeader>

      <StyledCardMiddle>
        <StyledCardText>{location}</StyledCardText>
        <StyledCardText>{compDateFormatted}</StyledCardText>
      </StyledCardMiddle>

      <StyledCardBottom>
        <StyledRoleContainer>
          {roles.map((role, index) => (
            <StyledRole key={index}>{role}</StyledRole>
          ))}
        </StyledRoleContainer>
        <StyledCountdown>{daysRemaining > 0 ? `${daysRemaining} days to go!` : "Competition ended!"}</StyledCountdown>
      </StyledCardBottom>

      <StyledProgressBar>
        <StyledProgress $width={progressWidth} />
      </StyledProgressBar>
    </StyledCompCardContainer>
  );
};
