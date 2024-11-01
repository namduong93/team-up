import React, { useState } from 'react';
import { FirstStepPopUp } from './FirstStepPopUp';
import { SecondStepPopUp } from './SecondStepPopUp';
import { ThirdStepPopUp } from './ThirdStepPopUp';
import styled from "styled-components";
import { sendRequest } from '../../utility/request';
import { useParams } from 'react-router-dom';
import { SitePopup1 } from './SitePopup1';

interface SitePopUpChainProps {
  compId?: number;
  handleClose: () => void;
  siteOptionsState?: [{ value: string; label: string; }[], React.Dispatch<React.SetStateAction<{ value: string; label: string; }[]>>];
}

const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`

export const SitePopUpChain: React.FC<SitePopUpChainProps> = ({ compId = useParams().compId, handleClose, siteOptionsState = [[{ value: '', label: '' }], () => {}] }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newSite, setNewSite] = useState({ value: '', label: '' });

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1); 
    handleClose(); 
  };

  const handleSubmit = () => {
    try {
      sendRequest.put('/competition/student/site_change', { compId, newSiteId: parseInt(newSite.value) });
    } catch (error: unknown) {
      
    }

    setCurrentStep((prevStep) => prevStep + 1);
  }

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <SitePopup1
            siteOptionsState={siteOptionsState}
            heading={<Heading>Change Team Site {"\nLocation"}</Heading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter a location"
            inputOption={newSite}
            setInputOption={setNewSite}
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
