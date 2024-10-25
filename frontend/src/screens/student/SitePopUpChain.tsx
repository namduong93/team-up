import React, { useState } from 'react';
import { FirstStepPopUp } from './FirstStepPopUp';
import { SecondStepPopUp } from './SecondStepPopUp';
import { ThirdStepPopUp } from './ThirdStepPopUp';
import styled from "styled-components";

interface SitePopUpChainProps {
  handleClose: () => void;
}

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`

export const SitePopUpChain: React.FC<SitePopUpChainProps> = ({ handleClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newSite, setNewSite] = useState('');

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1); 
    handleClose(); 
  };

  const handleSubmit = () => {
    // TO-DO: add backend routing to submit the newSite request to backend

    setCurrentStep((prevStep) => prevStep + 1);
  }

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <FirstStepPopUp
            heading={<Heading>Change Team Site {"\nLocation"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter a location"
            inputValue={newSite}
            setInputValue={setNewSite}
          />
        );
      case 2:
        return (
          <SecondStepPopUp
            heading={<Heading>Are you sure you would {"\nlike to change your Team's"} {"\nsite location?"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <ThirdStepPopUp
            heading={<Heading>Your team's new site location {"\nis now pending approval"} {"\nfrom your coach"}</Heading>}
            onClose={handleCloseWithReset}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModal()}</div>;
};
