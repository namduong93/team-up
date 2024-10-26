import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../../components/general_utility/Background";
import { sendRequest } from "../../../utility/request";
import styled from "styled-components";
import TextInput from "../../../components/general_utility/TextInput";
import { backendURL } from "../../../../config/backendURLConfig";

const FormContainer = styled.form`
  display: flex;
  width: 500px;
  height: 500px;
  flex-shrink: 1;
  flex-direction: column;
  align-items: center; 
  text-align: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const CustomButton = styled.button`
  width: 30%;
  min-width: 74px;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme }) => theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const SignUpLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryLight};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Image = styled.img`
  width: 100%;
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-style: ${({ theme }) => theme.fonts.style};
`;

const InputContainer = styled.div`
  width: 68%;
`;

const ForgotPassword = styled.label`
  text-decoration: underline;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 12px;
  cursor: pointer;
  margin-top: -16px;
`;

export const Landing: FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendRequest.post('/user/login', { email, password });
      window.location.href = '/dashboard';
    } catch (error: unknown) {
      console.error('Login failed', error);
    }
  };

  return (
    <FlexBackground style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <Image src={`${backendURL.HOST}:${backendURL.PORT}/images/icpc_logo_landing.png`} />
      </div>
      <FormContainer onSubmit={handleSubmit}>
        <Title>Welcome</Title>

        <InputContainer>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            type="email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="97%"
          />
        </InputContainer>

        <InputContainer>
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="97%"
          />
        </InputContainer>

        <ForgotPassword onClick={() => navigate('/password/recovery/email')}>Forgot Password?</ForgotPassword>

        <CustomButton type="submit">Login</CustomButton>

        <div>
          <span style={{ marginRight: '5px', fontFamily: 'Arial, Helvetica, sans-serif' }}>New Here?</span>
          <SignUpLink onClick={() => navigate('/roleregistration')}>Sign Up</SignUpLink>
        </div>
      </FormContainer>
    </FlexBackground>
  );
};
