import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../../utility/request";
import { StyledFlexBackground } from "../../../components/general_utility/Background";
import { StyledForgotPassword, StyledFormContainer, StyledImage, StyledInputContainer, StyledSignUpLink, StyledTitle } from "./Login.styles";
import TextInput from "../../../components/general_utility/TextInput";
import { backendURL } from "../../../../config/backendURLConfig";
import { StyledCustomButton } from "../../general_styles/button_styles";

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
    <StyledFlexBackground style={{ justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ width: '600px', flex: '0 1 auto' }}>
        <StyledImage src={`${backendURL.HOST}:${backendURL.PORT}/images/icpc_logo_landing.png`} />
      </div>
      <StyledFormContainer onSubmit={handleSubmit}>
        <StyledTitle>Welcome</StyledTitle>

        <StyledInputContainer>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            type="email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="97%"
          />
        </StyledInputContainer>

        <StyledInputContainer>
          <TextInput
            label="Password"
            placeholder="Enter your password"
            type="password"
            required={true}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            width="97%"
          />
        </StyledInputContainer>

        <StyledForgotPassword onClick={() => navigate('/password/recovery/email')}>Forgot Password?</StyledForgotPassword>

        <StyledCustomButton type="submit">Login</StyledCustomButton>

        <div>
          <span style={{ marginRight: '5px', fontFamily: 'Arial, Helvetica, sans-serif' }}>New Here?</span>
          <StyledSignUpLink onClick={() => navigate('/roleregistration')}>Sign Up</StyledSignUpLink>
        </div>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
