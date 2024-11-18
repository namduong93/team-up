import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { format, differenceInDays } from "date-fns";
import {
  StyledCardBottom,
  StyledCardHeader,
  StyledCardMiddle,
  StyledCardText,
  StyledCardTop,
  StyledCompCardContainer,
  StyledCompHeader,
  StyledCountdown,
  StyledProgress,
  StyledProgressBar,
  StyledRole,
  StyledRoleContainer,
} from "./CompCard.styles";

interface CardProps {
  compName: string;
  location: string;
  compDate: string;
  roles: string[];
  compId: string;
  compCreationDate: string;
};

/**
 * A React component for displaying information about a competition.
 *
 * The `CompCard` component displays a competition card with key details, such as
 * the competition name, location, date, and the user's roles. It also includes
 * a countdown to the competition date and a progress bar indicating how much time has
 * passed since the competition was created.
 *
 * @param {CardProps} props - React CardProps specified above
 * @returns {JSX.Element} - A card displaying the competition details, a countdown to the competition,
 * and a progress bar showing the time elapsed since creation.
 */
export const CompCard: FC<CardProps> = ({
  compName,
  location,
  compDate,
  roles,
  compId,
  compCreationDate,
}) => {
  const navigate = useNavigate();

  const roleUrl = () => {
    if (roles.includes("Participant")) {
      return `/competition/participant/${compId}`;
    }
    return `/competition/page/${compId}`;
  };

  const compDateFormatted = format(new Date(compDate), "MMMM yyyy");
  const today = new Date(); // Today's date
  const daysRemaining = differenceInDays(new Date(compDate), today);

  // calculate the width of the progress bar as a percentage of the total days
  const compCreationDateFormatted = new Date(compCreationDate);
  let totalDays = differenceInDays(
    new Date(compDate),
    compCreationDateFormatted
  );
  totalDays = Math.max(totalDays, daysRemaining);

  // calculate the progress width
  const progressWidth =
    totalDays > 0 ? ((totalDays - daysRemaining) / totalDays) * 100 : 100;
  return (
    <StyledCompCardContainer onClick={() => navigate(roleUrl())}>
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
        <StyledCountdown>
          {daysRemaining > 0
            ? `${daysRemaining} days to go!`
            : "Competition ended!"}
        </StyledCountdown>
      </StyledCardBottom>

      <StyledProgressBar>
        <StyledProgress $width={progressWidth} />
      </StyledProgressBar>
    </StyledCompCardContainer>
  );
};
