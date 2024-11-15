const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  height: 500px;
  width: 500px;
  flex: 0 1 auto;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CenteredFormBackground = styled(FlexBackground)`
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.fontFamily};;

  & h1 {
    font-style: ${({ theme }) => theme.fonts.style};;
  }
`;
