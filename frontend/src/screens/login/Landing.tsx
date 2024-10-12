import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import { sendRequest } from "../../utility/request";
import styled from "styled-components";
import TextInput from "../../components/general_utility/TextInput";

// Custom styled components
const FormContainer = styled.form`
  display: flex;
  width: 500px;
  height: 500px;
  flex-shrink: 1;
  flex-direction: column;
  align-items: center; 
  text-align: center;
`;

const CustomButton = styled.button`
  width: 30%;
  min-width: 74px;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: #6688D2;
  margin-top: 35px;
  margin-bottom: 40px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
`;

const SignUpLink = styled.span`
  cursor: pointer;
  text-decoration: underline;
  color: #6688D2;
  font-family: Arial, Helvetica, sans-serif;
`;

const Image = styled.img`
  width: 100%;
`;

const Title = styled.h1`
  font-family: Arial, Helvetica, sans-serif;
  font-style: italic;
`;

const InputContainer = styled.div`
  width: 68%;
`;

const ForgotPassword = styled.label`
  text-decoration: underline;
  font-family: Arial, Helvetica, sans-serif;
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
      navigate('/dashboard');
    } catch (error: unknown) {
      console.error('Login failed', error);
    }
  };

  return (
    <FlexBackground style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <Image src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png" />
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

        <ForgotPassword>Forgot Password?</ForgotPassword>

        <CustomButton type="submit">Login</CustomButton>

        <div>
          <span style={{ marginRight: '5px', fontFamily: 'Arial, Helvetica, sans-serif' }}>New Here?</span>
          <SignUpLink onClick={() => navigate('/roleregistration')}>Sign Up</SignUpLink>
        </div>
      </FormContainer>
    </FlexBackground>
  );
};

// const styles: Record<string, React.CSSProperties> = {
//   formContainer: {
//     display: 'flex',
//     width: '500px',
//     height: '500px',
//     flexShrink: '1',
//     flexDirection: 'column',
//     alignItems: 'center', 
//     textAlign: 'center',
//   },
//   inputContainer: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'flex-start', 
//     textAlign: 'left',
//     width: '100%',
//     height: '100%',
//   },
//   image: {
//     width: '100%',
//   }, 
//   button: {
//     width: '30%',
//     minWidth: '74px',
//     height: '35px',
//     border: '0px',
//     borderRadius: '30px',
//     backgroundColor: '#6688D2',
//     marginTop: '35px',
//     marginBottom: '40px',
//     color: '#ffffff',
//     fontSize: '16px',
//     fontWeight: 'bold',
//   },
//   signUpLink: {
//     cursor: 'pointer',
//     textDecoration: 'underline',
//     color: '#6688D2',
//     fontFamily: 'Arial, Helvetica, sans-serif'
//   }
// }