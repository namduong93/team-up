import React, { useState } from "react";
import styled from "styled-components";
import { FaTimes } from "react-icons/fa";
import TextInputLight from "../../components/general_utility/TextInputLight";
import { useNavigate } from "react-router-dom";


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
`;


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

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) => (disabled ? theme.fonts.colour : theme.background)};
    font-weight: ${({ theme, disabled }) => (disabled ? theme.fonts.fontWeights.regular : theme.fonts.fontWeights.bold)};
    background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark)};
  }
`

interface JoinPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
}

const JoinPopUp: React.FC<JoinPopUpProps> = ({ heading, onClose }) => {
  const navigate = useNavigate();
  const [teamCode, setTeamCode] = useState("");
  const [teamName, setTeamName] = useState("");

  const isButtonDisabled = () => {
    // TO-DO: implemented backend routing to check if the teamCode and teamName 
    // correspond to actual Teams in database
    
    return teamCode === "" || teamName === "";
  }

  const handleJoin =() => {
    // TO-DO: implement backend routing to submit join request to backend

    navigate("/dashboard", { state: { joined: true, teamName: teamName }})
  }

  return (
    <>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>
        <div style={{ width: "80%"}}>
          <TextInputLight
            label="Team Code"
            placeholder="Please enter"
            required={true}
            value={teamCode}
            onChange={(e) => setTeamCode(e.target.value)}
            width="100%"
          />
          <TextInputLight
            label="Team Name"
            placeholder="Please enter"
            required={true}
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            width="100%"
          />
        </div>

        <Button disabled={isButtonDisabled()} onClick={handleJoin}>
          Join
        </Button>
      </Modal>
    </>
  );
};

export default JoinPopUp;
