
const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const FormContainer = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  width: 100%;
`;

const LocationList = styled.div`
  display: grid;
  width: 65%;
  grid-template-columns: 1fr 1fr auto;
  margin-top: 20px;
  gap: 25px;
`;

const LocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center;
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
  margin-left: 30px;

  &:hover {
    color: ${({ theme }) => theme.colours.error};
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  min-width: 70px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;
const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;
const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;