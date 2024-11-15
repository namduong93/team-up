import styled from "styled-components";
import { Background } from "../Account/Account.styles";
import { FlexBackground } from "../../components/general_utility/Background";

export const PageBackground = styled(Background)`
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const StaffContainer = styled(FlexBackground)`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  box-sizing: border-box;
`;

export const StaffRecords = styled.div`
  display: flex;
  flex-direction: column;

`;

export const FilterTagContainer = styled.div`
  width: 100%;
  height: 40px;
`;