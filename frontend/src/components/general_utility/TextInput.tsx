import React from 'react';
import styled from 'styled-components';

interface TextInputProps {
  label: string;
  placeholder: string;
  type?: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  maxLength?: number;
  descriptor?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = 'text',
  required = false,
  value,
  onChange,
  width = '300px',
  maxLength,
  descriptor,
}) => {
  return (
    <Container $width={width}>
      <Label>
        {label}
        {required && <Asterisk>*</Asterisk>}
      </Label>
      {descriptor && <Descriptor>{descriptor}</Descriptor>}
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
    </Container>
  );
};

const Container = styled.div<{ $width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ $width: width }) => width};
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
`;

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

const Input = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
`;

export default TextInput;