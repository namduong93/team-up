import React from "react";
import styled from "styled-components";
import { FaTimes, FaRegCopy } from "react-icons/fa";

// Modal styles
const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 25%; // Adjust the width as needed
  text-align: center;
`;

// Close button styles
const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #d9534f; // Change color as needed
  transition: color 0.2s;
  font-size: 26px;

  &:hover {
    color: #c9302c; // Change color on hover
  }
`;

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px; 
  margin-bottom: 30px;
`;

const CopyText = styled.p`
  font-size: 18px; 
  font-style: italic;
  margin: 0; 
  padding: 10px; 
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 8px; 
  display: inline-block; 
`;

const CopyIcon = styled(FaRegCopy)`
  margin-left: 20px;
  width: 1.7rem;
  height: 1.7rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.primaryDark};
  transition: color 0.2s;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;


interface InvitePopUpProps {
  heading: React.ReactNode;
  text: string;
  onClose: () => void;
}


const InvitePopUp: React.FC<InvitePopUpProps> = ({ heading, text, onClose }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    alert("Text copied to clipboard!"); 
  };

  return (
    <>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>
        <CopyContainer>
          <CopyText>{text}</CopyText>
          <CopyIcon onClick={copyToClipboard} />
        </CopyContainer>
      </Modal>
    </>
  );
};

export default InvitePopUp;
