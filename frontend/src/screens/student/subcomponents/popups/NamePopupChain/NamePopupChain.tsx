import { useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import { sendRequest } from "../../../../../utility/request";
import { NamePopup1 } from "./subcomponents/NamePopup1/NamePopup1";
import { SecondStepPopup } from "../SecondStepPopup";
import { ThirdStepPopup } from "../ThirdStepPopup";

interface NamePopupChainProps {
  handleClose: () => void;
}

const StyledHeading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`;

export const NamePopupChain: React.FC<NamePopupChainProps> = ({
  handleClose,
}) => {
  const { compId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [newTeamName, setNewTeamName] = useState("");

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose();
  };

  const handleSubmit = async () => {
    try {
      await sendRequest.put<{}>("/competition/student/team_name_change", {
        compId,
        newTeamName,
      });
      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error requesting a team name change:", error);
    }
  };

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <NamePopup1
            heading={<StyledHeading>Change Team {"\n Name"}</StyledHeading>}
            onClose={handleCloseWithReset}
            onNext={handleNext}
            text="Enter new name"
            inputValue={newTeamName}
            setInputValue={setNewTeamName}
          />
        );
      case 2:
        return (
          <SecondStepPopup
            heading={
              <StyledHeading>
                Are you sure you would {"\nlike to change your Team's"}{" "}
                {"\nname?"}
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
                Your team's new name {"\nis now pending approval"}{" "}
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
