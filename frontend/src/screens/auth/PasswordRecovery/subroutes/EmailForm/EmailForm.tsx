import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { StyledFormContainer } from "../../PasswordRecovery.styles";
import TextInput from "../../../../../components/general_utility/TextInput";
import { StyledCustomButton } from "../../../../general_styles/button_styles";

export const EmailForm: FC<React.HTMLAttributes<HTMLFormElement>> = ({ style, ...props }) => {
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
    <StyledFormContainer
      onSubmit={handleEmailSubmit}
      style={style}
      {...props}
      className="email-form--StyledFormContainer-0">
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
      <StyledCustomButton
        style={{ minWidth: '134px' }}
        className="email-form--StyledCustomButton-0">Get Recovery Code</StyledCustomButton>
    </StyledFormContainer>
  );
}