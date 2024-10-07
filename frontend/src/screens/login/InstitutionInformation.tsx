import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
// import { sendRequest } from "../../utility/request";
// import ProgressBar from "../../components/general_utility/ProgressBar";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";

const steps = [
  { label: 'User Type', active: false },
  { label: 'Account Information', active: false },  // Set the active step here
  { label: 'Site Information', active: true },
  { label: 'Institution Information', active: false },
];

const institutionOptions = [
  {value: '', label: 'Please Select'},
  { value: 'MXS', label: 'Mens XS' },
  { value: 'MS', label: 'Mens S' },
  { value: 'MM', label: 'Mens M' },
  { value: 'ML', label: 'Mens L' },
  { value: 'MXL', label: 'Mens XL' },
  { value: 'M2XL', label: 'Mens 2XL' },
  { value: 'M3XL', label: 'Mens 3XL' },
  { value: 'N4XL', label: 'Mens 4XL' },
  { value: 'N5XL', label: 'Mens 5XL' },
  { value: 'LXS', label: 'Ladies XS' },
  { value: 'LS', label: 'Ladies S' },
  { value: 'LM', label: 'Ladies M' },
  { value: 'LL', label: 'Ladies L' },
  { value: 'LXL', label: 'Ladies XL' },
  { value: 'L2XL', label: 'Ladies 2XL' },
  { value: 'L3XL', label: 'Ladies 3XL' },
];


export const InstitutionInformation: FC = () => {
  const navigate = useNavigate();
  const [institution, setInstitution] = useState("");
  const [studentId, setStudentId] = useState("");

  const isButtonDisabled = () => {
    return (
      institution === '' ||
      studentId === ''
    );
  };

  return (
    <FlexBackground style={{
      display: 'flex',
      justifyContent: 'space-between', 
      alignItems: 'flex-start', 
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}>
      {/* <ProgressBar steps={steps} /> */}
      
      <div style={{ flex: 1, marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Institution Information</h1>

        <DropDownInput
          label="T-Shirt Size"
          options={institutionOptions}
          value={institution}
          required={true}
          onChange={(e) => setInstitution(e.target.value)}
          width="600px"
        />

        <TextInput
            label="Student Identifier Number"
            placeholder="Please type"
            required={true}
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            width="600px"
        />

        <div style={styles.buttonContainer}>
          <button style={{
          ...styles.button}}
            onClick={() => navigate('/siteinformation')}
          >
          Back
          </button>

          <button style={{
          ...styles.button,
          ...(isButtonDisabled() ? styles.buttonDisabled : {}),}}
            disabled={isButtonDisabled()}
            onClick={() => navigate('/dashboard')}
          >
          Create Account
          </button>
        </div>
        

      </div>
    </FlexBackground>
  );
}

const styles: Record<string, React.CSSProperties> = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center', // Center the buttons
    alignItems: 'center',
    gap: '90px', // Space between the buttons
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