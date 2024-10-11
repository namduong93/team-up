import React from 'react';
import { IoIosArrowDown } from 'react-icons/io';
import styled from 'styled-components';

interface DropdownInputProps extends React.HTMLAttributes<HTMLSelectElement> {
  label: string;
  options: Array<{ value: string; label: string }>; // Array of options for the dropdown
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string; // Allow adjustable width
  descriptor?: string; // Optional descriptor text
}

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

const RelativeSelect: React.FC<RelativeSelectProps> = ({ children, value, onChange, required, ...props }) => {

  return (
    <RelativeSelectGrid>
      <RelativeSelectElement value={value} onChange={onChange} required={required} {...props} >
        { children }
      </RelativeSelectElement>
      <SelectDownArrow />
    </RelativeSelectGrid>
  )
}

const DropdownInput: React.FC<DropdownInputProps> = ({
  label,
  options,
  required = false,
  value,
  onChange,
  width = '300px',
  descriptor, // Descriptive text added as an optional prop
}) => {
  return (
    <div style={{...styles.container, width}}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.asterisk}>*</span>}
      </label>
      {descriptor && <div style={styles.descriptor}>{descriptor}</div>} {/* Render descriptor if provided */}
      <RelativeSelect
        value={value}
        onChange={onChange}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </RelativeSelect>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '0.5rem',
    marginTop: '10px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  asterisk: {
    color: 'red',
  },
  select: {
    padding: '10px 1.5%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    marginBottom: '5px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    height: '38px', 
    paddingRight: '30px',
  },
  descriptor: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
};

export default DropdownInput;
