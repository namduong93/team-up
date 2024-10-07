import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
// import { sendRequest } from "../../utility/request";
// import ProgressBar from "../../components/general_utility/ProgressBar";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";

const steps = [
  { label: 'User Type', active: false },
  { label: 'Account Information', active: true },  // Set the active step here
  { label: 'Site Information', active: false },
  { label: 'Institution Information', active: false },
];

export const AccountInformation: FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [preferredName, setPreferredName] = useState("");
  const [preferredPronoun, setPreferredPronoun] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const pronounOptions = [
    { value: '', label: 'Please Select' },
    { value: 'M', label: 'He/Him' },
    { value: 'F', label: 'She/Her' },
    { value: 'NB', label: 'They/Them' },
  ];

  const isButtonDisabled = () => {
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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);

    // Check if confirmPassword matches the password
    if (e.target.value !== password) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  return (
    <FlexBackground style={{
      display: 'flex',
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
      // padding: '5px', 
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}>
      {/* <ProgressBar steps={steps} /> */}
      
      <div style={{ flex: 1, marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Account Information</h1>
        <div style={styles.doubleInputContainer}>
          <TextInput
            label="First Name"
            placeholder="John"
            type="text" 
            required={true}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            width="270px" // Custom width
          />

          <TextInput
            label="Last Name"
            placeholder="Smith"
            type="text" 
            required={true}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            width="270px" // Custom width
          />
        </div>

        <div style={styles.doubleInputContainer}>
          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text" 
            required={false}
            value={preferredName}
            onChange={(e) => setPreferredName(e.target.value)}
            width="270px" // Custom width
          />

          <DropDownInput
            label="Preferred Pronouns"
            options={pronounOptions}
            value={preferredPronoun}
            required={true}
            onChange={(e) => setPreferredPronoun(e.target.value)}
            width="270px" // Custom width
          />
        </div>

        <TextInput
            label="Email"
            placeholder="example@email.com"
            type="text" 
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="600px" // Custom width
        />

        <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password" 
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="600px" // Custom width
        />

        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password" 
          required={true}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          width="600px" // Custom width
        />

        {error && (
          <p style={styles.errorMessage}>{error}</p>
        )}

        <div style={styles.buttonContainer}>
          <button style={{
          ...styles.button}}
            onClick={() => navigate('/roleregistration')}
          >
          Back
          </button>

          <button style={{
          ...styles.button,
          ...(isButtonDisabled() ? styles.buttonDisabled : {}),}}
            disabled={isButtonDisabled()}
            onClick={() => navigate('/siteinformation')}
          >
          Next
          </button>
        </div>
        

      </div>
    </FlexBackground>
  );
}

const styles: Record<string, React.CSSProperties> = {
  doubleInputContainer: {
    display: 'flex',
    justifyContent: 'space-between', // Space between fields
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
    // marginTop: '35px',
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