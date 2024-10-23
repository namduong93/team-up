import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { styled } from 'styled-components';
import TextInputLight from '../../components/general_utility/TextInputLight';

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
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

// Step 1 Component
const StepOne: React.FC<{ nextStep: () => void }> = ({ nextStep, message }) => (
    // <div>
    //     <h2>Step 1: Enter Your Name</h2>
    //     <input type="text" placeholder="Your Name" />
    //     <button onClick={nextStep}>Next</button>
    // </div>

    <div>{message}</div>
    <div style={{ width: "80%"}}>
      <TextInputLight
        label="Enter your new Site Location"
        placeholder="Please enter"
        required={true}
        value={newSite}
        onChange={(e) => setNewSite(e.target.value)}
        width="100%"
      />
    </div>

    <Button onClick={nextStep}>
      Next
    </Button>
);


const StepTwo: React.FC<{ nextStep: () => void; prevStep: () => void }> = ({ nextStep, prevStep }) => (
    <div>
        <h2>Step 2: Enter Your Email</h2>
        <input type="email" placeholder="Your Email" />
        <button onClick={prevStep}>Back</button>
        <button onClick={nextStep}>Next</button>
    </div>
);

const StepThree: React.FC<{ prevStep: () => void }> = ({ prevStep }) => (
    <div>
        <h2>Step 3: Confirm Details</h2>
        <p>Please confirm your details.</p>
        <button onClick={prevStep}>Back</button>
        <button onClick={() => alert('Submitted!')}>Submit</button>
    </div>
);

// Main Pop-Up Component
const MultiStepPopUp: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);

  const nextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <StepOne nextStep={nextStep} />;
      case 2:
        return <StepTwo nextStep={nextStep} prevStep={prevStep} />;
      case 3:
        return <StepThree prevStep={prevStep} />;
      default:
        return null;
    }
  };

  return (
    // <div className="popup">
    //   <button onClick={onClose}>Close</button>
    //   {renderStep()}
    // </div>

    <Modal>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>

      {renderStep()}
    
    </Modal>
  );
};

export default MultiStepPopUp