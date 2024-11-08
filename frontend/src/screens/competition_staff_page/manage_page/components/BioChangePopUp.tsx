import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 450px;
  box-sizing: border-box;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

const StyledTextarea = styled.textarea<{ $height: string }>`
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  font-size: 16px;
  height: ${({ $height }) => $height};
  width: 100%;
  padding: 10px;
`;

interface BioChangePopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  inputValue: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const BioChangePopUp: React.FC<BioChangePopUpProps> = ({
  heading,
  onClose,
  onNext,
  inputValue,
  onChange,
}) => {
  const [_, setTextAreaHeight] = useState("auto");

  // Adjust the height based on content
  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextAreaHeight("auto");
    setTextAreaHeight(`${e.target.scrollHeight}px`);
    onChange(e);
  };

  const isButtonDisabled = () => inputValue === "";

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

        <StyledTextarea
          value={inputValue}
          onChange={handleTextChange}
          $height="100px"
          required={false}
        />

        <Button disabled={isButtonDisabled()} onClick={onNext}>
          Save Changes
        </Button>
      </Modal>
    </ModalOverlay>
  );
};
