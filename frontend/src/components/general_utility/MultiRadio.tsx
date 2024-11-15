import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { CompetitionRole } from "../../../shared_types/Competition/CompetitionRole";

interface CheckboxOption {
  value: string;
  label: string;
}

interface MultiSelectCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[] | CompetitionRole[]) => void;
  label: string | React.ReactNode;
  descriptor?: string;
  showOther?: boolean; // New prop to control "Other" visibility
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
`;

const StyledLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
`;

const StyledDescriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const StyledCheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const StyledCheckboxInput = styled.input`
  margin-right: 0.5rem;
`;

const StyledCheckboxLabel = styled.label`
  font-size: 16px;
  font-family: Arial, Helvetica, sans-serif;
`;

const OtherInput = styled.input`
  width: 100%;
  margin-left: 0.5rem;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 10px;
  font-size: 16px;
  flex-grow: 1;
`;

const MultiRadio: React.FC<MultiSelectCheckboxGroupProps> = ({
  options,
  selectedValues,
  onChange,
  label,
  descriptor,
  showOther = true,
}) => {
  const [otherValue, setOtherValue] = useState("");

  useEffect(() => {
    if (!otherValue && selectedValues.includes("other")) {
      onChange(selectedValues.filter((val) => val !== "other"));
    }
  }, [otherValue, selectedValues, onChange]);

  const handleCheckboxChange = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter((val) => val !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleOtherBlur = () => {
    if (otherValue && !selectedValues.includes(otherValue)) {
      onChange([
        ...selectedValues.filter((val) => val !== "other"),
        otherValue,
      ]);
    }
  };

  const handleOtherCheckboxChange = () => {
    if (selectedValues.includes("other")) {
      setOtherValue("");
      onChange(selectedValues.filter((val) => val !== "other"));
    } else {
      onChange([...selectedValues, "other"]);
    }
  };

  return (
    <StyledContainer>
      {label && <StyledLabel>{label}</StyledLabel>}
      {descriptor && <StyledDescriptor>{descriptor}</StyledDescriptor>}
      {options.map((option) => (
        <StyledCheckboxContainer key={option.value}>
          <StyledCheckboxInput
            type="checkbox"
            id={option.value}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleCheckboxChange(option.value)}
          />
          <StyledCheckboxLabel htmlFor={option.value}>{option.label}</StyledCheckboxLabel>
        </StyledCheckboxContainer>
      ))}
      {showOther && (
        <StyledCheckboxContainer>
          <StyledCheckboxInput
            type="checkbox"
            id="other"
            value="other"
            checked={selectedValues.includes("other")}
            onChange={handleOtherCheckboxChange}
          />
          <StyledCheckboxLabel htmlFor="other">Other:</StyledCheckboxLabel>
          <OtherInput
            type="text"
            value={otherValue}
            onChange={(e) => setOtherValue(e.target.value)}
            onBlur={handleOtherBlur}
          />
        </StyledCheckboxContainer>
      )}
    </StyledContainer>
  );
};

export default MultiRadio;
