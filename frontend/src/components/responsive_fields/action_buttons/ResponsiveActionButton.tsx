import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { TransparentResponsiveButton } from "../ResponsiveButton";
import { CancelButton, ConfirmButton, PopUpContent, PopUpOverlay, Question } from "./ActionButton";


export const StyledResponsiveActionDiv = styled.div<{ $actionType: 'primary' | 'secondary' | 'error' }>`
  border-radius: 10px;
  box-sizing: border-box;
  height: 33px;
  border: none;
  white-space: nowrap;
  max-width: 80px;
  width: 100%;

  background-color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "primary") {
      return theme.colours.primaryLight;
    } else if (actionType === "secondary") {
      return theme.colours.secondaryLight;
    } else {
      return theme.colours.error;
    }
  }};

  color: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.background;
    } else {
      return theme.fonts.colour;
    }
  }};

  font-weight: ${({ $actionType: actionType, theme }) => {
    if (actionType === "error") {
      return theme.fonts.fontWeights.bold;
    }
  }};
`;

interface ResponsiveActionButtonProps {
  icon: ReactNode;
  label: string;
  question: string;
  redirectPath: string;
  actionType: "primary" | "secondary" | "error";
  handleClick?: () => void; // Optional function prop for a custom click handler
}

export const ResponsiveActionButton: FC<ResponsiveActionButtonProps> = ({
    question, redirectPath, actionType, handleClick, icon, label }) => {
    
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(redirectPath); // Go to the correct redirected path
  };

  const handleButtonClick = () => {
    if (handleClick) {
      handleClick(); // Call the custom click handler if provided
    } else {
      setIsOpen(true); // Open the confirmation pop-up
    }
  };
  
  return (
    <>
      <StyledResponsiveActionDiv $actionType={actionType}>
        <TransparentResponsiveButton
          actionType={actionType}
          onClick={handleButtonClick}
          isOpen={isOpen}
          icon={icon} label={label}
        />
      </StyledResponsiveActionDiv>
      {isOpen && (
        <PopUpOverlay onClick={() => setIsOpen(false)}>
          <PopUpContent onClick={(e) => e.stopPropagation()}>
            <Question>{question}</Question>
            <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
            <CancelButton onClick={() => setIsOpen(false)}>Cancel</CancelButton>
          </PopUpContent>
        </PopUpOverlay>
      )}
    </>
  );
}
