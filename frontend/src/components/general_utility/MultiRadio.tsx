import React, { useState } from 'react';
import styled from 'styled-components';

interface CheckboxOption {
  value: string;
  label: string;
}

interface MultiSelectCheckboxGroupProps {
  options: CheckboxOption[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  label: string;
  descriptor?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: 100%;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: bold;
  font-size: 18px;
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const CheckboxInput = styled.input`
  margin-right: 0.5rem;
`;

const CheckboxLabel = styled.label`
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
}) => {
  const [otherValue, setOtherValue] = useState('');

  const handleChange = (value: string) => {
    const newSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((val) => val !== value)
      : [...selectedValues, value];
    onChange(newSelectedValues);
  };

  return (
    <Container>
      {label && <Label>{label}</Label>}
      {descriptor && <Descriptor>{descriptor}</Descriptor>}
      {options.map((option) => (
        <CheckboxContainer key={option.value}>
          <CheckboxInput
            type="checkbox"
            id={option.value}
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
          />
          <CheckboxLabel htmlFor={option.value}>{option.label}</CheckboxLabel>
        </CheckboxContainer>
      ))}
      <CheckboxContainer>
        <CheckboxInput
          type="checkbox"
          id="other"
          value="other"
          checked={selectedValues.includes('other')}
          onChange={() => handleChange('other')}
        />
        <CheckboxLabel htmlFor="other">Other:</CheckboxLabel>
        <OtherInput
          type="text"
          value={otherValue}
          onChange={(e) => setOtherValue(e.target.value)}
          onBlur={() => {
            if (otherValue) {
              onChange([...selectedValues, otherValue]);
            }
          }}
        />
      </CheckboxContainer>
    </Container>
  );
};

export default MultiRadio;
