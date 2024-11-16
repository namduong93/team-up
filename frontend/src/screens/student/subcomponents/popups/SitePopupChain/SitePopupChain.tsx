import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { sendRequest } from "../../../../../utility/request";
import { SitePopup1 } from "./subcomponents/SitePopup1/SitePopup1";
import { SecondStepPopup } from "../SecondStepPopup";
import { ThirdStepPopup } from "../ThirdStepPopup";

interface SitePopupChainProps {
  compId?: number;
  handleClose: () => void;
  siteOptionsState?: [
    { value: string; label: string }[],
    React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>
  ];
}

const StyledHeading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const SitePopupChain: React.FC<SitePopupChainProps> = ({
  compId = useParams().compId,
  handleClose,
  siteOptionsState = [[{ value: "", label: "" }], () => {}],
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [newSite, setNewSite] = useState({ value: "", label: "" });

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose();
  };

  const handleSubmit = () => {
    try {
      sendRequest.put("/competition/student/site_change", {
        compId,
        newSiteId: parseInt(newSite.value),
      });
    } catch (error: unknown) {}

    setCurrentStep((prevStep) => prevStep + 1);
  };

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <SitePopup1
            siteOptionsState={siteOptionsState}
            heading={<StyledHeading data-test-id="site-popup-chain--StyledHeading-0">Change Team Site{"\nLocation"}</StyledHeading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter a location"
            inputOption={newSite}
            setInputOption={setNewSite}
          />
        );
      case 2:
        return (
          <SecondStepPopup
            heading={
              <StyledHeading data-test-id="site-popup-chain--StyledHeading-1">Are you sure you would{"\nlike to change your Team's"}{" "}
                {"\nsite location?"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <ThirdStepPopup
            heading={
              <StyledHeading data-test-id="site-popup-chain--StyledHeading-2">Your team's new site location{"\nis now pending approval"}{" "}
                {"\nfrom your coach"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModal()}</div>;
};
