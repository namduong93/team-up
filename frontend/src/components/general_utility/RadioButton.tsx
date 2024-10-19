import React, { FC } from 'react';
import styled from 'styled-components';

// Styles
const Container = styled.div<{ width?: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: ${({ width }) => width}; // Use width prop or default to auto
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
`;

const Asterisk = styled.span`
  color: red;
  margin-left: 5px; // Add space between label and asterisk
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const OptionsContainer = styled.div`
  display: flex; // Use flex to arrange radio buttons side by side
  flex-direction: row; // Arrange in a row
  margin-top: 5px; // Optional: Add some space above the radio buttons
  justify-content: space-between; // Correct the syntax
  width: 100%;
`;

const RadioButtonLabel = styled.label`
  display: flex;
  align-items: center;
  flex: 1; // Allow labels to take equal space within the OptionsContainer
  font-size: 16px;
  cursor: pointer;
`;

const RadioInput = styled.input`
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
    <Container width={width}>
      {label && (
        <Label>
          {label}
          {required && <Asterisk>*</Asterisk>}
        </Label>
      )}
      {descriptor && (
        <Descriptor>
          {Array.isArray(descriptor) 
            ? descriptor.map((line, index) => (
                <React.Fragment key={index}>
                  {line}
                  {index < descriptor.length - 1 && <br />}
                </React.Fragment>
              ))
            : descriptor
          }
        </Descriptor>
      )}
      <OptionsContainer>
        {options.map((option) => (
          <RadioButtonLabel key={option}>
            <RadioInput
              type="radio"
              id={option} // Add an id for accessibility
              name={label} // Group name for the radio buttons
              value={option}
              checked={selectedOption === option}
              onChange={onOptionChange}
            />
            {option}
          </RadioButtonLabel>
        ))}
      </OptionsContainer>
    </Container>
  );
};

export default RadioButton;
