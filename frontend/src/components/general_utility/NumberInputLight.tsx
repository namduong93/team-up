import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

  const StyledContainer = styled.div<{ $width: string }>`
    display: flex;
    flex-direction: column;
    margin-bottom: 1rem;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    width: ${({ $width }) => $width};
  `;
  
  export const StyledLabel = styled.label`
    display: block;
    text-align: left;
    margin-bottom: 0.5rem;
    margin-top: 10px;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    font-size: 14px;
  `;
  
  const StyledAsterisk = styled.span`
    color: ${({ theme }) => theme.colours.error};
  `;
  
  export const StyledInput = styled.input`
    padding: 10px 1.5%;
    height: 100%;
    box-sizing: border-box;
    width: 100%;
    border: 1px solid ${({ theme }) => theme.colours.notifDark};
    border-radius: 10px;
    margin-bottom: 5px;
    font-family: ${({ theme }) => theme.fonts.fontFamily};
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.fonts.colour};
  `;
  
interface NumberInputLightProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  name?: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
  currentCapacity?: number;
}

export const NumberInputLight: React.FC<NumberInputLightProps> = ({
  label,
  placeholder,
  type = 'number',
  required = false,
  value,
  onChange,
  width = '300px',
  style,
  currentCapacity,
}) => {
  const [displayValue, setDisplayValue] = useState<number | string>(value);

  // Set initial value to currentCapacity if provided
  useEffect(() => {
    if (currentCapacity !== undefined) {
      setDisplayValue(currentCapacity);
    }
  }, [currentCapacity]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    // Allow empty input, or ensure the new value is a valid number and not below 0
    if (newValue === '' || (!isNaN(Number(newValue)) && Number(newValue) >= 0)) {
      onChange(e);
      setDisplayValue(newValue);
    }
  };

  return (
    <StyledContainer
      $width={width}
      style={style}
      data-test-id="number-input-light--StyledContainer-0">
      <StyledLabel data-test-id="number-input-light--StyledLabel-0">
        {label}
        {required && <StyledAsterisk data-test-id="number-input-light--StyledAsterisk-0">*</StyledAsterisk>}
      </StyledLabel>
      <StyledInput
        type={type}
        placeholder={placeholder || '0'}
        value={displayValue === 0 ? '' : displayValue}
        onChange={handleChange}
        required={required}
        data-test-id="number-input-light--StyledInput-0" />
    </StyledContainer>
  );
};

