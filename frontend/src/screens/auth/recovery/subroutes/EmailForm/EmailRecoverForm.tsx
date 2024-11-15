
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