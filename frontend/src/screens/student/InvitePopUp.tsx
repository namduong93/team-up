import React from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import { CopyButton } from "../../components/general_utility/CopyButton";

// Modal styles
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
`


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
`

const CopyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px; 
  margin-bottom: 30px;
`

const CopyText = styled.p`
  font-size: 18px; 
  font-style: italic;
  margin: 0; 
  padding: 10px; 
  border: 1px solid ${({ theme }) => theme.colours.confirmDark};
  border-radius: 8px; 
  display: inline-block; 
`

const LargeCopyButtonWrapper = styled.div`
  transform: scale(1.5); 
  display: inline-flex; 
  margin-left: 20px;
`

interface InvitePopUpProps {
  heading: React.ReactNode;
  text: string;
  onClose: () => void;
}


const InvitePopUp: React.FC<InvitePopUpProps> = ({ heading, text, onClose }) => {
  return (
    <>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>
        <CopyContainer>
          <CopyText>{text}</CopyText>
          <LargeCopyButtonWrapper>
            <CopyButton textToCopy={text} /> 
          </LargeCopyButtonWrapper>
        </CopyContainer>
      </Modal>
    </>
  );
};

export default InvitePopUp;
