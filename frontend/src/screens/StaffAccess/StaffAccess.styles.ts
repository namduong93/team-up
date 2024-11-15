const PageBackground = styled(Background)`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const StaffContainer = styled(FlexBackground)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-sizing: border-box;
`;

const StaffRecords = styled.div`
  display: flex;
  flex-direction: column;

`;

const FilterTagContainer = styled.div`
  width: 100%;
  height: 40px;
`;