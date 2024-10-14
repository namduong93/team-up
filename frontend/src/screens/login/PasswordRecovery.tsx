import React, { FC, useState } from "react"
import { FlexBackground } from "../../components/general_utility/Background"
import styled from "styled-components"
import TextInput from "../../components/general_utility/TextInput";
import { CustomButton } from "./Landing";
import { Outlet, useNavigate } from "react-router-dom";
import { ErrorMessage } from "./AccountInformation";
import { TimeoutButton } from "../../components/general_utility/TimeoutButton";

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 500px;
  flex: 0 1 auto;
  align-items: center;
`;

const CenteredFormBackground = styled(FlexBackground)`
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-family: Arial, Helvetica, sans-serif;

  & h1 {
    font-style: italic;
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
      navigate('/password/recovery/code')
    } catch (error: unknown) {

    }
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
  const [code, setCode] = useState('');
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
    } catch (error: unknown) {

    }
  
  }

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (value !== password) {
      setError('Passwords do not match');
    } else {
      setError('');
    }
  };

  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // TODO: resend here
  };

  return (
    <FormContainer onSubmit={handleCodeSubmit} style={style} {...props}>
      <h1>Verification Code</h1>

      <div style={{ width: '68%' }}>
        <TextInput
          label="Code"
          placeholder="000000"
          type="text"
          required={true}
          value={code}
          onChange={(e) => setCode(e.target.value)}
          width="100%"
          maxLength={6}
        />
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
        <TimeoutButton onClick={handleResend}>Resend Code</TimeoutButton>
        <CustomButton style={{ minWidth: '80px' }}>Submit Code</CustomButton>
      </div>
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