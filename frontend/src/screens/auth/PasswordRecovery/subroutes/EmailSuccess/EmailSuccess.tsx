import { FC } from "react";
import { StyledFormContainer } from "../../PasswordRecovery.styles";
import { TimeoutButton } from "../../../../../components/general_utility/TimeoutButton";

export const EmailSuccess: FC<React.HTMLAttributes<HTMLFormElement>> = ({ style, ...props }) => {
  
  const handleResend = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // handle resend email.
  }
  return (
    <StyledFormContainer style={{ justifyContent: 'center', ...style }} {...props}>
      <div style={{
        fontSize: '24px',
      }}>An email has been sent to your address with password recovery steps</div>
      <TimeoutButton onClick={handleResend} >Resend Email</TimeoutButton>
    </StyledFormContainer>
  )
}
