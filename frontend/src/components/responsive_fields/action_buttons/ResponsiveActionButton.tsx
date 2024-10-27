import { FC, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../ResponsiveButton";
import { CancelButton, ConfirmButton, PopUpContent, PopUpOverlay, Question, TimeoutConfirmButton } from "./ActionButton";


export const StyledResponsiveActionDiv = styled.div<{ $actionType: 'primary' | 'secondary' | 'error' | 'confirm' }>`
  border-radius: 10px;
  box-sizing: border-box;
  height: 35px;
  border: none;
  white-space: nowrap;
  max-width: 150px;
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

interface ResponsiveActionButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  label: string;
  question: string;
  redirectPath?: string;
  timeout?: number;
  actionType: "primary" | "secondary" | "error" | "confirm";
  handleClick?: () => void; // Optional function prop for a custom click handler
  handleSubmit?: () => Promise<boolean>;
  handleClose?: () => void;
}

export const ResponsiveActionButton: FC<ResponsiveActionButtonProps> = ({
    question, redirectPath, actionType, handleClick, timeout, handleClose = () => {},
    icon, label, style, handleSubmit, children, ...props }) => {
  
  const theme = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (handleSubmit) {
      if (!(await handleSubmit())) {
        return;
      };
    }
    if (redirectPath) {
      navigate(redirectPath); // Go to the correct redirected path
    } else {
      setIsOpen(false);
    }
  };

  const handleButtonClick = () => {
    if (handleClick) {
      handleClick(); // Call the custom click handler if provided
    } 
    setIsOpen(true); // Open the confirmation pop-up
  };

  const handleClosePopup = () => {
    handleClose();
    setIsOpen(false);
  }
  
  return (
    <>
      <StyledResponsiveActionDiv $actionType={actionType} style={style} >
        <TransparentResponsiveButton
          actionType={actionType}
          onClick={handleButtonClick}
          isOpen={isOpen}
          icon={icon} label={label}
          {...props}
        />
      </StyledResponsiveActionDiv>
      {isOpen && (
        <PopUpOverlay onClick={handleClosePopup}>
          <PopUpContent onClick={(e) => e.stopPropagation()}>
            <Question>{question}</Question>
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
              {children}
            </div>
            {!timeout ?
              <ConfirmButton onClick={handleConfirm}>Confirm</ConfirmButton>
            : <TimeoutConfirmButton bgColor={theme.colours.confirm} seconds={timeout} onClick={handleConfirm}>Confirm</TimeoutConfirmButton>
            }
            <CancelButton onClick={handleClosePopup}>Cancel</CancelButton>
          </PopUpContent>
        </PopUpOverlay>
      )}
    </>
  );
}
