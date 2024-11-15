import React, { useState } from "react";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { sendRequest } from "../../../../utility/request";
import { OptionPopUp } from "./subcomponents/WithdrawPopup1";
import { SecondStepPopUp } from "../popups/SecondStepPopUp";
import InvitePopUp from "../InvitePopUp";


interface WithdrawPopUpChainProps {
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

export const WithdrawPopUpChain: React.FC<WithdrawPopUpChainProps> = ({
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
          <OptionPopUp
            heading={
              <Heading>
                Withdrawing from the Team
                {"\nwill make you ineligible"}
                {"\n to compete in the Competition"}
                {"\n\nThis action is final and"}
                {"\ncannot be undone"}
                {"\n\nDo you still wish"}
                {"\nto proceed?"}
              </Heading>
            }
            onClose={handleCloseWithReset}
            onNext={handleNext}
            actionButtonText="Proceed"
          />
        );
      case 2:
        return (
          <SecondStepPopUp
            heading={
              <Heading>Are you sure you would {"\nlike to withdraw?"}</Heading>
            }
            onClose={handleCloseWithReset}
            onNext={handleSubmit}
          />
        );
      case 3:
        return (
          <InvitePopUp
            heading={
              <Heading>
                Copy and send your
                {"\nTeam Code"}
                {"\nto invite your Substitute"}
                {"\nto the Team"}
                {"\n\nAlternatively, you can wait"}
                {"\nfor a Random Replacement"}
                {"\nto be assigned"}
              </Heading>
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
