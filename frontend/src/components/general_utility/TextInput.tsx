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

  const StyledContainer = styled.div<{ $width: string }>`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    width: ${({ $width: width }) => width};
  `;
  
  const StyledLabel = styled.label`
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    margin-top: 10px;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
    font-size: 18px;
    color: ${({ theme}) => theme.fonts.colour};
  `;
  
  const StyledAsterisk = styled.span`
    color: ${({ theme }) => theme.colours.error};
  `;
  
  const StyledInput = styled.input`
    padding: 10px 1.5%;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colours.notifDark};
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.fonts.colour};
    border-radius: 10px;
    margin-bottom: 5px;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
  `;
  
  const StyledDescriptor = styled.div`
    margin-bottom: 5px;
    font-size: 14px;
    color: ${({ theme }) => theme.colours.filterText};
  `;

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
    <StyledContainer $width={width}>
      <StyledLabel>
        {label}
        {required && <StyledAsterisk>*</StyledAsterisk>}
      </StyledLabel>
      {descriptor && <StyledDescriptor>{descriptor}</StyledDescriptor>}
      <StyledInput
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        maxLength={maxLength}
      />
    </StyledContainer>
  );
};


export default TextInput;