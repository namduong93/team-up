const Container = styled.div`
  /* padding: 20px; */
  max-width: 600px;
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Title = styled.h2`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  margin-bottom: 0.5rem;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const AddButton = styled.button`
  border: 2px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 50%;
  width: 35px;
  height: 35px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryLight};
    color: ${({ theme }) => theme.fonts.colour};
    border-color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
  
`;