import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { sendRequest } from "../../utility/request";
import { FaTimes } from 'react-icons/fa';

interface RegisterPopUpProps {
  isOpen: boolean;
  onClose: () => void;
  message: React.ReactNode;
  showInput?: boolean;
  showButtons?: boolean;
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

// const CloseButton = styled.button`
//   position: absolute;
//   top: 10px;
//   right: 10px;
//   background: none;
//   border: none;
//   font-size: 24px;
//   /* font-weight: bold; */
//   color: #666;
//   cursor: pointer;

//   &:hover {
//     color: red;
//   }
// `

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

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 100px;
  width: 35%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 10px;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

const ButtonContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 40px;
`

const Input = styled.input`
  padding: 10px 1.5%;
  /* height: 100%; */
  box-sizing: border-box;
  width: 60%;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  margin-bottom: 35px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const ErrorMessage = styled.div`
  color: red; 
  font-size: 14px;
  margin-top: 5px;
`;

export const RegisterPopUp: React.FC<RegisterPopUpProps> = ({
  isOpen,
  onClose,
  message,
  showInput = true,
  showButtons = true,
}) => {

  const [inputValue, setInputValue] = useState("");
  const [isValidCode, setIsValidCode] = useState(false); 
  const [isLoading, setIsLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const validateCode = async () => {
      if (inputValue === "") {
        setIsValidCode(false);
        setErrorMessage(null); // Reset error message
        return;
      }
      setIsLoading(true);
      try {
        const response = await sendRequest.get<{}>('/competition/student/status', { code: inputValue });

        // Check if the response is an empty object (valid code)
        if (Object.keys(response.data).length === 0) {
          setIsValidCode(true); // Valid competition code
          setErrorMessage(null); // Clear any previous error message
        } else {
          setIsValidCode(false); // Invalid code
          setErrorMessage("Invalid competition code. Please try again."); // Set error message
        }
      } catch (error) {
        console.error("Failed to validate competition code:", error);
        setIsValidCode(false); // Treat as invalid if an error occurs
        setErrorMessage("Invalid competition code. Please try again."); // Set error message
      } finally {
        setIsLoading(false);
      }
    };

    validateCode();
  }, [inputValue]);

  const handleRegister = () => {
    navigate(`/competition/information/${inputValue}`);
  };

  const isButtonDisabled = () => isLoading || !isValidCode;

  if (!isOpen) return null;

  return (
    <Overlay onClick={onClose}>
      {/* <Container onClick={(e) => e.stopPropagation()}> */}
      <Modal>

      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>
        <div>{message}</div>
        {showInput && (
          <>
            <Input
              type="text"
              placeholder="COMP1234"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value);
              }}
            />
            {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>} 
          </>
        )}

        {showButtons && (
          <ButtonContainer>
            <Button disabled={isButtonDisabled()} onClick={handleRegister}>
              Register
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ButtonContainer>
        )}

      </Modal>
      {/* </Container> */}
    </Overlay>
  );
};