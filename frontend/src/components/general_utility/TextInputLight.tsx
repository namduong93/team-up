import React from 'react';
import styled from 'styled-components';

interface TextInputLightProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}

const TextInputLight: React.FC<TextInputLightProps> = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  width = '300px',
}) => {
  return (
    <Container width={width}>
      <Label>
        {label}
        {required && <Asterisk>*</Asterisk>}
      </Label>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </Container>
  );
};

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
  font-size: 14px;
`;

const Asterisk = styled.span`
  color: red;
`;

const Input = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: Arial, Helvetica, sans-serif;
`;

export default TextInputLight;