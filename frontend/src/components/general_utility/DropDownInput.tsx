import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import styled from 'styled-components';

interface DropdownInputProps extends React.HTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string;
  descriptor?: string;
}

const Container = styled.div<{ width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: Arial, Helvetica, sans-serif;
  width: ${({ width }) => width};
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-weight: bold;
  font-size: 18px;
`;

const Asterisk = styled.span`
  color: red;
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: #555;
`;

const RelativeSelectGrid = styled.div`
  width: 100%;
  height: 38px;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 1fr 38px;
`;

const RelativeSelectElement = styled.select`
  appearance: none;
  border: 1px solid #ccc;
  font-family: Arial, Helvetica, sans-serif;
  height: 100%;
  width: 100%;
  padding: 10px 1.5%;
  padding-right: 30px;
  border-radius: 10px;
  box-sizing: border-box;
  grid-row: 1 / 2;
  grid-column: 1 / 3;
`;

const SelectDownArrow = styled(IoIosArrowDown)`
  grid-row: 1 / 2;
  grid-column: 2 / 3;
  margin: auto 6px auto auto;
  pointer-events: none;
  height: 40%;
  width: 40%;
`;

interface RelativeSelectProps extends React.HTMLAttributes<HTMLSelectElement> {
  value: string;
  required: boolean;
}

const RelativeSelect: React.FC<RelativeSelectProps> = ({ children, value, onChange, required, ...props }) => (
  <RelativeSelectGrid>
    <RelativeSelectElement value={value} onChange={onChange} required={required} {...props}>
      {children}
    </RelativeSelectElement>
    <SelectDownArrow />
  </RelativeSelectGrid>
);

// DropdownInput Component
const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  required = false,
  value,
  onChange,
  width = '300px',
  descriptor,
}) => {
  return (
    <Container width={width}>
      <Label>
        {label}
        {required && <Asterisk>*</Asterisk>}
      </Label>
      {descriptor && <Descriptor>{descriptor}</Descriptor>}
      <RelativeSelect value={value} onChange={onChange} required={required}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </RelativeSelect>
    </Container>
  );
};

export default DropdownInput;
