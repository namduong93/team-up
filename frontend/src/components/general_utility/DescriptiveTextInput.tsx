import React from 'react';
import styled from 'styled-components';

interface DescriptiveTextInputProps {
  label?: string;
  descriptor: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  width?: string;
  height?: string;
}

const Container = styled.div<{ width: string }>`
  display: flex;
  flex-direction: column;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: ${({ width }) => width};
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme}) => theme.fonts.colour};
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

const StyledTextarea = styled.textarea<{ $height: string }>`
  border-radius: 10px;
  box-sizing: border-box;
  resize: vertical;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  font-size: 16px;
  height: ${({ $height }) => $height};
  width: 100%;
`;

const DescriptiveTextInput: React.FC<DescriptiveTextInputProps> = ({
  label,
  descriptor,
  placeholder,
  required = false,
  value,
  onChange,
  width = '600px',
  height = '100px',
}) => {
  return (
    <Container width={width}>
       {label && (
        <Label>
          {label}
          {required && <Asterisk>*</Asterisk>}
        </Label>
      )}
      <Descriptor>{descriptor}</Descriptor>
      <StyledTextarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        $height={height}
        required={required}
      />
    </Container>
  );
};

export default DescriptiveTextInput;
