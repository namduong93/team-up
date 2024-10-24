import React, { useState } from 'react';
import { FirstStepPopUp } from './FirstStepPopUp';
import { SecondStepPopUp } from './SecondStepPopUp';
import { ThirdStepPopUp } from './ThirdStepPopUp';
import styled from "styled-components";

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

export const NamePopUpChain: React.FC<NamePopUpChainProps> = ({ handleClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose(); 
  };

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirstStepPopUp
            heading={<Heading>Change {"\nTeam Name"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter new name"
          />
        );
      case 2:
        return (
          <SecondStepPopUp
            heading={<Heading>Are you sure you would {"\nlike to change your Team's"} {"\nname?"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
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
