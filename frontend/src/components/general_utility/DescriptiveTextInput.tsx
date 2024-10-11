import React from 'react';

interface DescriptiveTextInputProps {
  label: string;
  descriptor: string;
  placeholder: string;
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  width?: string;
  height?: string; // Add a height prop to control height
}

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
    <div style={styles.container}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.asterisk}>*</span>}
      </label>
      <div style={styles.descriptor}>{descriptor}</div>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...styles.textarea, width, height }} // Apply dynamic width and height
        required={required}
      />
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '1rem',
    fontFamily: 'Arial, Helvetica, sans-serif',
    width: '100%'
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
  asterisk: {
    color: 'red',
  },
  textarea: {
    // padding: '10px',
    // border: '1px solid #ccc',
    borderRadius: '10px',
    boxSizing: 'border-box',
    resize: 'vertical', // Allow vertical resizing of the textarea
    fontFamily: 'Arial, Helvetica, sans-serif',
    fontSize: '16px',
  },
};

export default DescriptiveTextInput;
