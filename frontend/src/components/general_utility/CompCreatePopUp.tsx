// Modal.tsx

import styled from "styled-components";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
  code: string;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); 
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 70%;
  max-width: 400px;
  text-align: center;
  position: relative;  
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  /* font-weight: bold; */
  color: #666;
  cursor: pointer;

  &:hover {
    color: red;
  }
`;

const Title = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
`;

const Code = styled.p`
  font-size: 18px;
  font-style: italic;
  margin-top: 10px;
`;

// const Button = styled.button`
//   background-color: #6688d2;
//   border: none;
//   color: white;
//   padding: 10px 20px;
//   border-radius: 5px;
//   font-size: 16px;
//   cursor: pointer;
//   margin-top: 20px;

//   &:hover {
//     background-color: #5671b9;
//   }
// `;

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, message, code }) => {
  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Title>{message}</Title>
        <Title>The code is:</Title>
        <Code>{code}</Code>
        {/* <Button onClick={onClose}>Close</Button> */}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;
