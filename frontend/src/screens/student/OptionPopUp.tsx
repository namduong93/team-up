import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styled } from 'styled-components';

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
  width: 25%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
`


const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 20px;
  color: #d9534f; 
  transition: color 0.2s;
  font-size: 26px;

  &:hover {
    color: #c9302c;
  }
`

const Button = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 35%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme }) => (theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  /* cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )}; */
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`
const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 40px;
`

interface OptionPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onNext: () => void;
  actionButtonText: string;
}

export const OptionPopUp: React.FC<OptionPopUpProps> = ({ heading, onClose, onNext, actionButtonText }) => {

  return (
    <>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

        <ButtonContainer>
          <Button onClick={onNext}>{actionButtonText}</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonContainer>

      </Modal>
    </>
  );
};

