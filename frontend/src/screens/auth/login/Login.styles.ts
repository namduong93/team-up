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