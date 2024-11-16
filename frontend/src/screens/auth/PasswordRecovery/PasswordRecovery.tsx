import { FC, useState } from "react";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { StyledCenteredFormBackground, StyledFormContainer } from "./PasswordRecovery.styles";
import TextInput from "../../../components/general_utility/TextInput";
import { StyledErrorMessage } from "../../general_styles/error_styles";
import { StyledCustomButton } from "../../general_styles/button_styles";

export const PasswordCodeRecoverForm: FC<React.HTMLAttributes<HTMLFormElement>> = ({ style, ...props }) => {
  const { code } = useParams();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
    
  const handleCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // TODO: Send Backend the verification code to check

      
      // ON SUCCESS FROM BACKEND
      navigate('/');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) { /* empty */ }
  
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  return (
    <StyledFormContainer
      onSubmit={handleCodeSubmit}
      style={style}
      {...props}
      data-test-id="password-recovery--StyledFormContainer-0">
      <h1>Verification Code</h1>
      <div style={{ width: '68%' }}>
        <h2 style={{ color: 'red' }}>DEV: code = {code}</h2>
      </div>
      <div style={{ width: '68%' }}>
        <TextInput
          label="New Password"
          placeholder="Enter your password"
          type="password"
          required={true}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          width="100%"
        />
      </div>
      <div style={{ width: '68%' }}>
        <TextInput
          label="Confirm Password"
          placeholder="Re-enter your password"
          type="password"
          required={true}
          value={confirmPassword}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleConfirmPasswordChange(e.target.value)}
          width="100%"
        />
      </div>
      {error && <StyledErrorMessage data-test-id="password-recovery--StyledErrorMessage-0">{error}</StyledErrorMessage>}
      <div style={{ width: '68%', display: 'flex', justifyContent: 'space-around' }}>
        <StyledCustomButton
          style={{ minWidth: '80px' }}
          data-test-id="password-recovery--StyledCustomButton-0">Change Password</StyledCustomButton>
      </div>
    </StyledFormContainer>
  );
}


export const PasswordRecovery: FC = () => {
  return (
    <StyledCenteredFormBackground data-test-id="password-recovery--StyledCenteredFormBackground-0">
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <img
          style={{ width: '100%' }}
          src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png"
          data-test-id="password-recovery--img-0" />
      </div>
      <Outlet/>
    </StyledCenteredFormBackground>
  );
}