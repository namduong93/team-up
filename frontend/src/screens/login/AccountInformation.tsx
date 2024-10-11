import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import { useMultiStepRegoForm } from "./MultiStepRegoForm";
import { RegoProgressBar } from "../../components/general_utility/ProgressBar";

export const AccountInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [showOtherGenderInput, setShowOtherGenderInput] = useState(false); // Track if the "Other" gender input should be shown

  const pronounOptions = [
    { value: '', label: 'Please Select' },
    { value: 'M', label: 'He/Him' },
    { value: 'F', label: 'She/Her' },
    { value: 'NB', label: 'They/Them' },
  ];

  const genderOptions = [
    { value: '', label: 'Please Select' },
    { value: 'M', label: 'Male' },
    { value: 'F', label: 'Female' },
    { value: 'NB', label: 'Non-Binary'},
    { value: 'other', label: 'Other'},
  ];

  const isButtonDisabled = () => {
    const { firstName, lastName, password, email, gender } = formData;
    return (
      error !== '' ||
      password === '' ||
      confirmPassword === '' ||
      firstName === '' ||
      lastName === '' ||
      email === '' ||
      gender === ''
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

  // Handle changes to the gender dropdown
  const handleGenderChange = (value: string) => {
    if (value === 'other') {
      setShowOtherGenderInput(true); // Show text input if "Other" is selected
      setFormData({ ...formData, gender: '' }); // Clear gender value in formData initially
    } else {
      setShowOtherGenderInput(false);
      setFormData({ ...formData, gender: value });
    }
  };

  const handleNext = () => {
    console.log(formData)
    navigate('/siteinformation');
  };

  return (
    <FlexBackground style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <RegoProgressBar progressNumber={1} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', width: '100%', minWidth: '200px' }}>
          <h1 style={{ marginBottom: '20px' }}>Account Information</h1>

          <div style={styles.doubleInputContainer}>
            <TextInput
              label="First Name"
              placeholder="John"
              type="text"
              required={true}
              value={formData.firstName}  
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })} 
              width="45%"
            />

            <TextInput
              label="Last Name"
              placeholder="Smith"
              type="text"
              required={true}
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              width="45%" 
            />
          </div>

          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text"
            required={false}
            value={formData.preferredName || ""}
            onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
            width="100%" 
          />

          <div style={styles.doubleInputContainer}>
            <DropDownInput
              label="Gender"
              options={genderOptions}
              value={formData.gender}
              required={true}
              onChange={(e) => handleGenderChange(e.target.value)}
              width="45%" 
            />
            <div style={{ display: 'flex', width: '45%', minWidth: '172px' }}>
            <DropDownInput
              label="Preferred Pronouns"
              options={pronounOptions}
              value={formData.preferredPronoun || ''}
              required={false}
              onChange={(e) => setFormData({ ...formData, preferredPronoun: e.target.value })}
              width="100%" 
            />
            </div>
          </div>

          {/* Conditionally render the text input for "Other" gender */}
          {showOtherGenderInput && (
            <TextInput
              label="Please Specify Your Gender"
              placeholder="Enter your gender"
              type="text"
              required={true}
              value={formData.gender || ''}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              width="100%"
            />
          )}

          <TextInput
            label="Email"
            placeholder="example@email.com"
            type="text"
            required={true}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            width="100%"
          />

          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            required={true}
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            width="100%" 
          />

          <TextInput
            label="Confirm Password"
            placeholder="Re-enter your password"
            type="password"
            required={true}
            value={confirmPassword}
            onChange={(e) => handleConfirmPasswordChange(e.target.value)} 
            width="100%" 
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
      </div>
    </FlexBackground>
  );
};

const styles: Record<string, React.CSSProperties> = {
  doubleInputContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
    gap: '0.8%',
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
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '90px',
  },
  button: {
    maxWidth: '150px',
    width: '25%',
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
