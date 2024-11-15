
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 1100px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  height: 80%;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
`;

const Button = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const RowContainer2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  justify-content: center;
  gap: 60px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 95%;
`;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
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

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 800px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  margin-top: 10px;
  margin-bottom: 55px;
  align-self: stretch;
`;