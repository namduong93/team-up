import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import { useMultiStepRegoForm } from "./MultiStepRegoForm";

// const steps = [
//   { label: 'User Type', active: false },
//   { label: 'Account Information', active: true },
//   { label: 'Site Information', active: false },
//   { label: 'Institution Information', active: false },
// ];

export const AccountInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const pronounOptions = [
    { value: '', label: 'Please Select' },
    { value: 'M', label: 'He/Him' },
    { value: 'F', label: 'She/Her' },
    { value: 'NB', label: 'They/Them' },
  ];

  const isButtonDisabled = () => {
    const { firstName, lastName, password, email, preferredPronoun } = formData;
    return (
      error !== '' ||
      password === '' ||
      confirmPassword === '' ||
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      preferredPronoun === ''
    );
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== formData.password) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  const handleNext = () => {
    navigate('/siteinformation');
  };

  return (
    <FlexBackground style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ flex: 1, marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Account Information</h1>

        <div style={styles.doubleInputContainer}>
          <TextInput
            label="First Name"
            placeholder="John"
            type="text"
            required={true}
            value={formData.firstName}  
            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
            width="270px" 
          />

          <TextInput
            label="Last Name"
            placeholder="Smith"
            type="text"
            required={true}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            width="270px" 
          />
        </div>

        <div style={styles.doubleInputContainer}>
          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text"
            required={false}
            value={formData.preferredName || ""}
            onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
            width="270px" 
          />

          <DropDownInput
            label="Preferred Pronouns"
            options={pronounOptions}
            value={formData.preferredPronoun}
            required={true}
            onChange={(e) => setFormData({ ...formData, preferredPronoun: e.target.value })}
            width="270px" 
          />
        </div>

        <TextInput
          label="Email"
          placeholder="example@email.com"
          type="text"
          required={true}
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          width="600px"
        />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          type="password"
          required={true}
          value={formData.password}
          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          width="600px" 
        />

        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
          required={true}
          value={confirmPassword}
          onChange={(e) => handleConfirmPasswordChange(e.target.value)} 
          width="600px" 
        />

        {error && (
          <p style={styles.errorMessage}>{error}</p>
        )}

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={() => navigate('/roleregistration')}
          >
            Back
          </button>

          <button
            style={{
              ...styles.button,
              ...(isButtonDisabled() ? styles.buttonDisabled : {}),
            }}
            disabled={isButtonDisabled()}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </FlexBackground>
  );
};

const styles: Record<string, React.CSSProperties> = {
  doubleInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '600px',
    gap: '5px',
  },
  errorMessage: {
    color: 'red',
    fontSize: '14px',
    fontFamily: 'Arial, Helvetica, sans-serif',
    marginTop: '-10px',
    textAlign: 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '90px',
  },
  button: {
    width: '150px',
    height: '35px',
    border: '0px',
    borderRadius: '30px',
    backgroundColor: '#6688D2',
    marginTop: '35px',
    marginBottom: '40px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

