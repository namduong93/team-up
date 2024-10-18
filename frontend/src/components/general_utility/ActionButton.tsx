import { FC, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

interface ActionButtonProps {
  actionName: string;
  question: string;
  redirectPath: string;
  actionType: "primary" | "secondary" | "error";
};

const Button = styled.button<{ $actionType: "primary" | "secondary" | "error" }>`
  border-radius: 10px;
  padding: 10px;
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
    };
  }};

  &:hover {
    cursor: pointer;
    background-color: ${({ $actionType: actionType, theme }) => {
      if (actionType === "primary") {
        return theme.colours.primaryDark;
      } else if (actionType === "secondary") {
        return theme.colours.secondaryDark;
      } else {
        return theme.colours.cancelDark;
      }
    }};
    color: ${({ theme }) => theme.background};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
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
  z-index: 1000;
`;

const PopUpContent = styled.div`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
`;

const Question = styled.div`
  padding: 20px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme }) => theme.fonts.colour};
`;

const ConfirmButton = styled.button`
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.fonts.colour};
  padding: 10px 15px 10px 15px;
  border-radius: 20px;
  border: none;
  margin: 15px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
  }
`;

const CancelButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};
  padding: 10px 15px 10px 15px;
  border-radius: 20px;
  border: none;
  margin: 15px;
  cursor: pointer;

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
      <Button $actionType={actionType} onClick={() => setIsOpen(true)}>
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
