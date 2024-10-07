import { FC, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface ActionButtonProps {
  actionName: string;
  question: string;
  redirectPath: string;
  actionType: "primary" | "secondary";
};

const Button = styled.button<{ actionType: "primary" | "secondary" }>`
  border-radius: 10px;
  border: none;
  padding: 10px 20px;
  white-space: nowrap;
  width: 150px;
  letter-spacing: ${({ theme }) => theme.fonts.spacing.normal};
  
  background-color: ${({ actionType, theme }) =>
    actionType === "primary" 
      ? theme.colours.primaryLight 
      : theme.colours.secondaryLight};
  
  color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    cursor: pointer;
    background-color: ${({ actionType, theme }) =>
      actionType === "primary" 
        ? theme.colours.primaryDark 
        : theme.colours.secondaryDark};
    color: ${({ theme }) => theme.background};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
    letter-spacing: ${({ theme }) => theme.fonts.spacing.wider};
  }
`;

const PopUpOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PopUpContent = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const Question = styled.div`
  padding: 20px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
`;

const ConfirmButton = styled.button`
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
  }
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    background-color: ${({ theme }) => theme.colours.cancelDark};
    color: ${({ theme }) => theme.background};
  }
`;

export const ActionButton: FC<ActionButtonProps> = ({ actionName, question, redirectPath, actionType }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleConfirm = () => {
    navigate(redirectPath); // go to the correct redirected path
  };

  return (
    <>
      <Button actionType={actionType} onClick={() => setIsOpen(true)}>
        {actionName}
      </Button>
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
};
