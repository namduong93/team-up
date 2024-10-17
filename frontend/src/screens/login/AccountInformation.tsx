import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import { useMultiStepRegoForm } from "./MultiStepRegoForm";
import { RegoProgressBar } from "../../components/general_utility/ProgressBar";
import { styled } from "styled-components";

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

  const handleGenderChange = (value: string) => {
    if (value === 'other') {
      setShowOtherGenderInput(true); 
      setFormData({ ...formData, gender: '' }); 
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
      <Container>
        <ContentContainer>
          <Title>Account Information</Title>

          <DoubleInputContainer>
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
          </DoubleInputContainer>

          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text"
            required={false}
            value={formData.preferredName || ""}
            onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
            width="100%" 
          />

          <DoubleInputContainer>
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
          </DoubleInputContainer>

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

          {error && <ErrorMessage>{error}</ErrorMessage>}

          <ButtonContainer>
            <Button onClick={() => navigate('/roleregistration')}>
              Back
            </Button>

            <Button $disabled={isButtonDisabled()} onClick={handleNext}>
              Next
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};

// const styles: Record<string, React.CSSProperties> = {
//   doubleInputContainer: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     width: '100%',
//     gap: '0.8%',
//   },
//   errorMessage: {
//     color: 'red',
//     fontSize: '14px',
//     fontFamily: 'Arial, Helvetica, sans-serif',
//     marginTop: '-10px',
//     textAlign: 'center',
//   },
//   buttonContainer: {
//     display: 'flex',
//     width: '100%',
//     justifyContent: 'center',
//     alignItems: 'center',
//     gap: '90px',
//   },
//   button: {
//     maxWidth: '150px',
//     width: '25%',
//     height: '35px',
//     border: '0px',
//     borderRadius: '30px',
//     backgroundColor: '#6688D2',
//     marginTop: '35px',
//     marginBottom: '40px',
//     color: '#ffffff',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     fontFamily: 'Arial, Helvetica, sans-serif',
//   },
//   buttonDisabled: {
//     backgroundColor: '#ccc',
//     cursor: 'not-allowed',
//   },
// };

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`
export const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.colours.error};
  font-size: 14px;
  font-family: ${({ theme }) => theme.fonts.colour};
  margin-top: -10px;
  text-align: center;
`

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`

export const Button = styled.button<{ $disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  pointer-events: ${({ $disabled: disabled }) => disabled ? 'none' : 'auto'};
  cursor: ${({ $disabled: disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`