import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

interface RegisterPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  message: string;
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

const Container = styled.div`
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  width: 65%;
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
`

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`

const Title = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: bold;
`;


const Input = styled.input`
  padding: 10px 1.5%;
  /* height: 100%; */
  box-sizing: border-box;
  width: 60%;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const RegisterPopUp: React.FC<RegisterPopUpProps> = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();

  const handleRegister = () => {
    navigate(`/competition/information/${inputValue}`);
  }

  function isButtonDisabled(): boolean | undefined {
    return (
      inputValue === ""
    );
  }

  return (
    <Overlay onClick={onClose}>
      <Container onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <Title>{message}</Title>
        <Input
          type="text"
          placeholder="Enter the competition code"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <ButtonContainer>
          <Button disabled={isButtonDisabled()} onClick={handleRegister}>Register</Button>
          <Button onClick={onClose}>Cancel</Button>
        </ButtonContainer>
      </Container>
    </Overlay>
  );
};

