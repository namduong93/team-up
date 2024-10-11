import React from 'react';

interface TextInputProps {
  label: string;
  placeholder: string;
  type?: string; 
  required?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  width?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  placeholder,
  type = 'text',
  required = false, 
  value,
  onChange,
  width = '300px',
}) => {
  return (
    <div style={{...styles.container, width}}>
      <label style={styles.label}>
        {label}
        {required && <span style={styles.asterisk}>*</span>}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        style={{ ...styles.input }}
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
  },
  // label: {
  //   fontSize: '18px',
  //   fontWeight: 'bold',
  //   marginBottom: '0.5rem',
  // },
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
  // input: {
  //   height: '40px',
  //   fontSize: '16px',
  //   padding: '0.5rem',
  //   border: '1px solid #ccc',
  //   borderRadius: '5px',
  // },
  input: {
    padding: '10px 1.5% 10px 1.5%',
    height: '100%',
    boxSizing: 'border-box',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    // marginTop: '5px',
    marginBottom: '5px',
    fontFamily: 'Arial, Helvetica, sans-serif',
  }, 
};

export default TextInput;
