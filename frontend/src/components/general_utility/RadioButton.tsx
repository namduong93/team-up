import React, { FC } from 'react';
import styled from 'styled-components';

// Styles
const StyledContainer = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: ${({ width }) => width}; // Use width prop or default to auto
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
  color: ${({ theme}) => theme.fonts.colour};
`;

const StyledAsterisk = styled.span`
  color: red;
  margin-left: 5px; // Add space between label and asterisk
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const StyledOptionsContainer = styled.div`
  display: flex; // Use flex to arrange radio buttons side by side
  flex-direction: row; // Arrange in a row
  margin-top: 5px; // Optional: Add some space above the radio buttons
  justify-content: space-between; // Correct the syntax
  width: 100%;
`;

const StyledRadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  flex: 1; // Allow labels to take equal space within the OptionsContainer
  font-size: 16px;
  cursor: pointer;
  color: ${({ theme}) => theme.fonts.colour};
`;

const StyledRadioInput = styled.input`
  margin-right: 10px; // Space between radio input and label text
  cursor: pointer;
`;

interface RadioButtonGroupProps {
  label?: string; // Make label optional
  options: string[];
  selectedOption: string;
  onOptionChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  descriptor?: string | string[]; 
  width?: string; // Optional width field
}

const RadioButton: FC<RadioButtonGroupProps> = ({
  label,
  options,
  selectedOption,
  onOptionChange,
  required = false,
  descriptor,
  width, 
}) => {
  return (
    <StyledContainer width={width} data-test-id="radio-button--StyledContainer-0">
      {label && (
        <StyledLabel data-test-id="radio-button--StyledLabel-0">
          {label}
          {required && <StyledAsterisk data-test-id="radio-button--StyledAsterisk-0">*</StyledAsterisk>}
        </StyledLabel>
      )}
      {descriptor && (
        <StyledDescriptor data-test-id="radio-button--StyledDescriptor-0">
          {Array.isArray(descriptor) 
            ? descriptor.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < descriptor.length - 1 && <br />}
                </React.Fragment>
              ))
            : descriptor
          }
        </StyledDescriptor>
      )}
      <StyledOptionsContainer data-test-id="radio-button--StyledOptionsContainer-0">
        {options.map((option) => (
          <StyledRadioButtonLabel key={option} data-test-id="radio-button--StyledRadioButtonLabel-0">
            <StyledRadioInput
              type="radio"
              // Add an id for accessibility
              id={option}
              // Group name for the radio buttons
              name={label}
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
              data-test-id="radio-button--StyledRadioInput-0" />
            {option}
          </StyledRadioButtonLabel>
        ))}
      </StyledOptionsContainer>
    </StyledContainer>
  );
};

export default RadioButton;
