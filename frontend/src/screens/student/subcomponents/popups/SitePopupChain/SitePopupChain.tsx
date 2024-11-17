import { useState } from "react";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../../../utility/request";
import { SitePopup1 } from "./subcomponents/SitePopup1/SitePopup1";
import { SecondStepPopup } from "../SecondStepPopup";
import { ThirdStepPopup } from "../ThirdStepPopup";
import { StyledHeading } from "./SitePopupChain.styles";

interface SitePopupChainProps {
  compId?: number;
  handleClose: () => void;
  siteOptionsState?: [
    { value: string; label: string }[],
    React.Dispatch<React.SetStateAction<{ value: string; label: string }[]>>
  ];
}

/**
 * `SitePopupChain` is a React web page component for handling the multi-step process of changing a
 * team site, starting with a pop-up prompting users to enter the new site, then confirming the change,
 * and finally displaying a confirmation message that the change is pending approval from the coach.
 *
 * @param {SitePopupChainProps} props - React SitePopupChainProps as specified above
 *
 * @returns {JSX.Element} - A modal component that displays different steps of the team site change process.
 */
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
            heading={
              <StyledHeading>Change Team Site {"\nLocation"}</StyledHeading>
            }
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
              <StyledHeading>
                Are you sure you would {"\nlike to change your Team's"}{" "}
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
              <StyledHeading>
                Your team's new site location {"\nis now pending approval"}{" "}
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
