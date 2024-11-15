import styled from "styled-components";
import { FlexBackground } from "../../../../../components/general_utility/Background";
import { FaSearch } from "react-icons/fa";

export const OverflowFlexBackground = styled(FlexBackground)`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const MainPageDiv = styled.div`
  flex: 0 1 auto;
  display: flex;
  width: 97%;
  height: 100%;
  min-height: 600px;
  flex-direction: column;
`;

export const PageOptionsContainerDiv = styled.div`
  min-height: 78px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #D9D9D9;
  z-index: 0;
`;

export const ToggleOptionDiv = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const MenuOptionsContainerDiv = styled.div`
  margin-right: min(20px, 2%);
  flex: 1;
  max-width: 360px;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column-reverse;
`;

export const SortContainer = styled.div`
  width: 19%;
  height: 33px;
  position: relative;
  min-width: 29px;
`;

export const SortFilterSearchContainerDiv = styled.div`
  width: 100%;
  /* min-width: 152px; */
  height: 66px;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  min-width: 58px;
`;

const SearchInput = styled.input`
  height: 100%;
  width: 100%;
  min-width: 29px;
  border: 1px solid ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  padding: 0;
  grid-row: 1 / 2;
  grid-column: 1 / 3;
  box-sizing: border-box;
  padding-left: 5px;
  &:focus + div {
    display: none;
  }
`;

const SearchIcon = styled(FaSearch)`
  min-width: 29px;
  pointer-events: none;
`;

const SearchContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;
  overflow: hidden;
  flex-wrap: wrap;
  color: ${({ theme }) => theme.colours.filterText};
`;

const SearchCell = styled.div`
  min-width: 29px;
  height: 100%;
  display: flex;
  align-items: center;
  position: absolute;
  flex-wrap: wrap;
  pointer-events: none;
  overflow: hidden;
  left: 0;
  z-index: 1;
`;