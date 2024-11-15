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
