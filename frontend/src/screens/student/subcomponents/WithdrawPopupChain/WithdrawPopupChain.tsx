import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../../../utility/request";
import { WithdrawPopup1 } from "./subcomponents/WithdrawPopup1";
import { SecondStepPopup } from "../popups/SecondStepPopup";
import InvitePopup from "../InvitePopup";

const StyledHeading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  margin-bottom: 10%;
  white-space: pre-wrap;
  word-break: break-word;
`;

interface WithdrawPopupChainProps {
  handleClose: () => void;
}

/**
 * A component for handling the multi-step process of withdrawing a participant from a competition, starting
 * with a pop-up prompting users of the consequences of withdrawal, then another pop-up asking users to confirm
 * their choice, and finally displaying the team code for distribution to a substitute and a message of random
 * replacement if applicable
 *
 * @param {SitePopupChainProps} props - React SitePopupChainProps as specified above
 *
 * @returns {JSX.Element} - A modal component that displays different steps of the withdrawal process.
 */
export const WithdrawPopupChain: React.FC<WithdrawPopupChainProps> = ({
  handleClose,
}) => {
  const { compId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [compCode, setCompCode] = useState<string>("");
  const navigate = useNavigate();

  const handleNext = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handleCloseWithReset = () => {
    setCurrentStep(1);
    handleClose();
    navigate("/dashboard");
  };

  const handleSubmit = async () => {
    try {
      // Send a request to the backend to withdraw from the team.
      const withdrawResponse = await sendRequest.post<string>(
        "/competition/student/withdraw",
        { compId }
      );

      // Retrieve the competition code from the response and update the state.
      setCompCode(withdrawResponse.data);

      setCurrentStep((prevStep) => prevStep + 1);
    } catch (error) {
      console.error("Error withdrawing from the team:", error);
    }
  };

  const renderModal = () => {
    switch (currentStep) {
      case 1:
        return (
          <WithdrawPopup1
            heading={
              <StyledHeading>
                Withdrawing from the Team
                {"\nwill make you ineligible"}
                {"\n to compete in the Competition"}
                {"\n\nThis action is final and"}
                {"\ncannot be undone"}
                {"\n\nDo you still wish"}
                {"\nto proceed?"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
            onNext={handleNext}
            actionButtonText="Proceed"
          />
        );
      case 2:
        return (
          <SecondStepPopup
            heading={
              <StyledHeading>
                Are you sure you would {"\nlike to withdraw?"}
              </StyledHeading>
            }
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <InvitePopup
            heading={
              <StyledHeading>
                Copy and send your
                {"\nTeam Code"}
                {"\nto invite your Substitute"}
                {"\nto the Team"}
                {"\n\nAlternatively, you can wait"}
                {"\nfor a Random Replacement"}
                {"\nto be assigned"}
              </StyledHeading>
            }
            text={compCode}
            onClose={handleCloseWithReset}
          />
        );
      default:
        return null;
    }
  };

  return <div>{renderModal()}</div>;
};
