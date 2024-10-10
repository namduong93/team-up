import { FC } from "react"
import styled from "styled-components";

interface RegoProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progressNumber: number;
}

const RegoProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  display: flex;
  min-width: 200px;
  height: 100%;
`;

export const RegoProgressBar: FC<RegoProgressBarProps> = ({ progressNumber, style, ...props }) => {
  
  return (
    <RegoProgressContainer style={{...style}} {...props} >

    </RegoProgressContainer>
  )
}