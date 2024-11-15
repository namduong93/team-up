import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../../utility/request";
import { FlexBackground } from "../../../components/general_utility/Background";
import { ForgotPassword, FormContainer, Image, InputContainer, SignUpLink, Title } from "./Login.styles";
import TextInput from "../../../components/general_utility/TextInput";
import { backendURL } from "../../../../config/backendURLConfig";
import { CustomButton } from "../../general_styles/button_styles";

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
