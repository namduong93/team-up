import styled from "styled-components";

export const FlexBackground = styled.div`
  flex: 1;
  overflow: visible;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.5s ease;
  & * {
    transition: background-color 0.5s ease;
  }
`;