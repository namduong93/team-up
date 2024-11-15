import { FC, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { RadioOption } from "../../TeamCard";
import { ApprovalNameDiv, RadioCheckIcon, RadioCrossIcon, RadioIconDiv } from "../../TeamCard.styles";

interface ApprovalNameRadiosProps extends React.HTMLAttributes<HTMLDivElement> {
  setTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  setRejectedTeamIds: React.Dispatch<React.SetStateAction<Array<number>>>;
  teamId: number;
}

export const ApproveNameRadios: FC<ApprovalNameRadiosProps> = ({ setTeamIds, setRejectedTeamIds, teamId, ...props }) => {
  const theme = useTheme();
  
  const [selectedOption, setSelectedOption] = useState<RadioOption>(RadioOption.Neither);

  const handleCheckClick = () => {
    setSelectedOption((prev) => prev === RadioOption.Check ? RadioOption.Neither : RadioOption.Check);
  }

  const handleCrossClick = () => {
    setSelectedOption((prev) => prev === RadioOption.Cross ? RadioOption.Neither : RadioOption.Cross);
  }

  const addTeam = () => {
    setTeamIds((prev) => prev.includes(teamId) ? prev : [...prev, teamId]);
  }
  const removeTeam = () => {
    setTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ];
    })
  }
  const rejectTeam = () => {
    setRejectedTeamIds((prev) => prev.includes(teamId) ? prev : [...prev, teamId]);
  }
  const unRejectTeam = () => {
    setRejectedTeamIds((prev) => {
      const index = prev.indexOf(teamId);
      if (index < 0) {
        return prev;
      }

      return [
        ...prev.slice(0, index),
        ...prev.slice(index + 1)
      ];
    })
  }

  useEffect(() => {
    if (selectedOption === RadioOption.Check) {
      addTeam();
      unRejectTeam();
    } else {
      removeTeam();
    }

    if (selectedOption === RadioOption.Cross) {
      rejectTeam();
    }

  }, [selectedOption]);

  return (
    <ApprovalNameDiv {...props}>
      
      <RadioIconDiv onClick={handleCheckClick} style={{
        border: `1px solid ${theme.colours.confirm}`,
        backgroundColor: selectedOption === RadioOption.Check ? theme.colours.confirm : theme.background
      }}>
        <RadioCheckIcon style={{
          color: selectedOption === RadioOption.Check ? theme.background : theme.colours.confirm
        }} />
      </RadioIconDiv>

      <div style={{ flex: '0 2 20px' }} />
      
      <RadioIconDiv onClick={handleCrossClick} style={{
        border: `1px solid ${theme.colours.cancel}`,
        backgroundColor: selectedOption === RadioOption.Cross ? theme.colours.cancel : theme.background,
        color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
      }}>
        <RadioCrossIcon style={{
          color: selectedOption === RadioOption.Cross ? theme.background : theme.colours.cancel
        }} />
      </RadioIconDiv>
    
    </ApprovalNameDiv>
  )
}