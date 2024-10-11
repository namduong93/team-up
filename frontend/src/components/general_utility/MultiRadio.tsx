import React, { useState } from 'react';

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
    <div style={styles.container}>
      {label && <label style={styles.label}>{label}</label>}
      {descriptor && <div style={styles.descriptor}>{descriptor}</div>}
      {options.map((option) => (
        <div key={option.value} style={styles.checkboxContainer}>
          <input
            type="checkbox"
            id={option.value}
            name="checkbox-group" 
            value={option.value}
            checked={selectedValues.includes(option.value)}
            onChange={() => handleChange(option.value)}
            style={styles.checkboxInput}
          />
          <label htmlFor={option.value} style={styles.checkboxLabel}>
            {option.label}
          </label>
        </div>
      ))}
      <div style={styles.checkboxContainer}>
        <input
          type="checkbox"
          id="other"
          name="checkbox-group"
          value="other"
          checked={selectedValues.includes('other')}
          onChange={() => handleChange('other')}
          style={styles.checkboxInput}
        />
        <label htmlFor="other" style={styles.checkboxLabel}>
          Other:
        </label>
        <input
          type="text"
          value={otherValue}
          onChange={(e) => setOtherValue(e.target.value)}
          onBlur={() => {
            if (otherValue) {
              onChange([...selectedValues, otherValue]); 
            }
          }} 
          style={styles.otherInput}
        />
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    fontFamily: 'Arial, Helvetica, sans-serif',
    width: '100%',
  },
  label: {
    display: 'block',
    textAlign: 'left',
    marginBottom: '0.5rem',
    marginTop: '10px',
    fontWeight: 'bold',
    fontSize: '18px',
  },
  descriptor: {
    marginBottom: '5px',
    fontSize: '14px',
    color: '#555',
  },
  checkboxContainer: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '0.5rem',
  },
  checkboxInput: {
    marginRight: '0.5rem',
  },
  checkboxLabel: {
    fontSize: '16px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  otherInput: {
    marginLeft: '0.5rem',
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    fontSize: '16px',
    flexGrow: 1, 
  },
};

export default MultiRadio;
