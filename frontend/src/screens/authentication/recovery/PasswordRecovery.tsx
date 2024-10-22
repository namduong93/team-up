import React, { FC, useState } from "react"
import { FlexBackground } from "../../../components/general_utility/Background"
import styled from "styled-components"
import TextInput from "../../../components/general_utility/TextInput";
import { CustomButton } from "../login/Landing";
import { Outlet, useNavigate, useParams } from "react-router-dom";
import { TimeoutButton } from "../../../components/general_utility/TimeoutButton";
import { ErrorMessage } from "../registration/AccountInformation";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 500px;
  flex: 0 1 auto;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CenteredFormBackground = styled(FlexBackground)`
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.fontFamily};;

  & h1 {
    font-style: ${({ theme }) => theme.fonts.style};;
  }
`;


export const EmailRecoverForm: FC<React.HTMLAttributes<HTMLFormElement>> = ({ style, ...props }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleEmailSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();


    try {
      // Send the forgot password request to the backend to email it


      // IF THE EMAIL WAS SUCCESSFULLY SENT FROM THE BACKEND TO THE CLIENT:
      navigate('/password/recovery/email/success');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error: unknown) { /* empty */ }
  }

  return (
    <FormContainer onSubmit={handleEmailSubmit} style={style} {...props}>
      <h1>Recover Password</h1>
      <div style={{ width: '68%' }}>
        <TextInput
          label="Email"
          placeholder="email@example.com"
          type="email"
          required={true}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          width="100%"
        />
      </div>
      <CustomButton style={{ minWidth: '134px' }}>Get Recovery Code</CustomButton>
    </FormContainer>
  )
}

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
    <FormContainer onSubmit={handleCodeSubmit} style={style} {...props}>
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
      {error && <ErrorMessage>{error}</ErrorMessage>}
      <div style={{ width: '68%', display: 'flex', justifyContent: 'space-around' }}>
        <CustomButton style={{ minWidth: '80px' }}>Change Password</CustomButton>
      </div>
    </FormContainer>
  )
}

export const EmailSuccess: FC<React.HTMLAttributes<HTMLFormElement>> = ({ style, ...props }) => {
  
  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // handle resend email.
  }
  return (
    <FormContainer style={{ justifyContent: 'center', ...style }} {...props}>
      <div style={{
        fontSize: '24px',
      }}>An email has been sent to your address with password recovery steps</div>
      <TimeoutButton onClick={handleResend} >Resend Email</TimeoutButton>
    </FormContainer>
  )
}

export const PasswordRecovery: FC = () => {
  return (
    <CenteredFormBackground>
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <img style={{ width: '100%' }} src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png" />
      </div>

      <Outlet/>
    </CenteredFormBackground>
  )
}