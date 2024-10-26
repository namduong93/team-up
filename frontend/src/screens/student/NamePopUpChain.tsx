import React, { useState } from 'react';
import { FirstStepPopUp } from './FirstStepPopUp';
import { SecondStepPopUp } from './SecondStepPopUp';
import { ThirdStepPopUp } from './ThirdStepPopUp';
import styled from "styled-components";
import { useParams } from 'react-router-dom';
import { sendRequest } from '../../utility/request';

interface NamePopUpChainProps {
  handleClose: () => void;
}

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const NamePopUpChain: React.FC<NamePopUpChainProps> = ({ handleClose}) => {
  const { compId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [newTeamName, setNewTeamName] = useState('');

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose(); 
  };

  const handleSubmit = async () => {
    try {
      await sendRequest.put<{}>('/competition/student/team_name_change', { compId, newTeamName });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error requesting a team name change:", error);
    }
  }

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirstStepPopUp
            heading={<Heading>Change Team {"\n Name"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter new name"
            inputValue={newTeamName}
            setInputValue={setNewTeamName}
          />
        );
      case 2:
        return (
          <SecondStepPopUp
            heading={<Heading>Are you sure you would {"\nlike to change your Team's"} {"\nname?"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <ThirdStepPopUp
            heading={<Heading>Your team's new name {"\nis now pending approval"} {"\nfrom your coach"}</Heading>}
            onClose={handleCloseWithReset}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModal()}</div>;
};
