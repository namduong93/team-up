import React from 'react';

interface DropdownInputProps {
  label: string;
  options: Array<{ value: string; label: string }>; // Array of options for the dropdown
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  width?: string; // Allow adjustable width
  descriptor?: string; // Optional descriptor text
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
    <div style={styles.container}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.asterisk}>*</span>}
      </label>
      {descriptor && <div style={styles.descriptor}>{descriptor}</div>} {/* Render descriptor if provided */}
      <select
        value={value}
        onChange={onChange}
        style={{ ...styles.select, width }}
        required={required}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
