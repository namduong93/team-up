import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import { StyledButton, StyledButtonContainer, StyledContainer, StyledContentContainer, StyledDoubleInputContainer, StyledTitle } from "./AccountDataInput.styles";
import TextInput from "../../../../../components/general_utility/TextInput";
import DropdownInput from "../../../../../components/general_utility/DropDownInput";
import { StyledErrorMessage } from "../../../../general_styles/error_styles";

export const AccountDataInput: FC = () => {
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
    <StyledFlexBackground style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <RegoProgressBar progressNumber={1} />
      <StyledContainer>
        <StyledContentContainer>
          <StyledTitle>Account Information</StyledTitle>

          <StyledDoubleInputContainer>
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
          </StyledDoubleInputContainer>

          <TextInput
            label="Preferred Name"
            placeholder="Please Enter"
            type="text"
            required={false}
            value={formData.preferredName || ""}
            onChange={(e) => setFormData({ ...formData, preferredName: e.target.value })}
            width="100%" 
          />

          <StyledDoubleInputContainer>
            <DropdownInput
              label="Gender"
              options={genderOptions}
              value={formData.gender}
              required={true}
              onChange={(e) => handleGenderChange(e.target.value)}
              width="45%" 
            />
            <div style={{ display: 'flex', width: '45%', minWidth: '172px' }}>
            <DropdownInput
              label="Preferred Pronouns"
              options={pronounOptions}
              value={formData.preferredPronoun || ''}
              required={false}
              onChange={(e) => setFormData({ ...formData, preferredPronoun: e.target.value })}
              width="100%" 
            />
            </div>
          </StyledDoubleInputContainer>

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

          {error && <StyledErrorMessage>{error}</StyledErrorMessage>}

          <StyledButtonContainer>
            <StyledButton onClick={() => navigate('/roleregistration')}>
              Back
            </StyledButton>

            <StyledButton $disabled={isButtonDisabled()} onClick={handleNext}>
              Next
            </StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};

