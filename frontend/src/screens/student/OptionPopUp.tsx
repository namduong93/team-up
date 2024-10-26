import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { styled } from 'styled-components';
import { CancelButton, ConfirmButton } from '../../components/responsive_fields/action_buttons/ActionButton';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  min-width: 290px;
  max-width: 350px;
  box-sizing: border-box;
  left: 50%;
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

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
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
          <ConfirmButton onClick={onNext}>{actionButtonText}</ConfirmButton>
          <CancelButton onClick={onClose}>Cancel</CancelButton>
        </ButtonContainer>

      </Modal>
    </>
  );
};

