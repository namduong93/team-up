import React, { FC } from "react"
import styled from "styled-components";

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progressNumber: number;
}

const RegoProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  display: flex;
  min-width: 170px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  /* margin-top: 10px;
  margin-left: 10px; */

  @media (max-width: 600px) {
    min-width: 60px;

    & span {
      width: 0;
      display: none;
    }
    & div {
      width: 42px;
    }
  }

`;

const ProgressItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60%;
  width: 80%;
  position: relative;
  justify-content: space-between;
  margin-top: 10vh;

  &::after {
    content: '';
    position: absolute;
    height: 100%;
    width: 2px;
    left: 20px;
    background-color: ${({ theme }) => theme.colours.sidebarLine};
  }
`;

const ProgressBarOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10%;
  /* flex: 1; */

`;

const ProgressCircle = styled.div<{ $isCurrentProgress: boolean }>`
  background-color: ${({ $isCurrentProgress, theme }) => 
    $isCurrentProgress ? theme.colours.primaryDark : theme.background};
  min-width: 42px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  position: relative;
  z-index: 1;
`

export const RegoProgressBar: FC<ProgressBarProps> = ({ progressNumber = 0 }) => {
  return (
    <ProgressBar progressNumber={progressNumber}>
      <span>
        User Type
      </span>
      <span>
        Account Information
      </span>
      <span>
        Site Information
      </span>
      <span>
        Institution Information
      </span>
    </ProgressBar>
  )
}

export const CompCreationProgressBar: FC<ProgressBarProps> = ({ progressNumber = 0 }) => {
  return (
    <ProgressBar progressNumber={progressNumber}>
      <span>
        Competition Details
      </span>
      <span>
        Confirmation
      </span>
    </ProgressBar>
  )
}

// ACCEPTS PROPS:
//  - progressNumber: number --- The index to specify the currently highlighted progress circle
//  - children --- Any ReactNodes that should appear next to the progress circle. (for every 
//      included child there will be an extra dot)
//  - style --- optional style to the container
//  - props --- optional additional props to the container
export const ProgressBar: FC<ProgressBarProps> = ({ progressNumber = 0, children, style, ...props }) => {

  return (
    <RegoProgressContainer style={{...style}} {...props} >
      <ProgressItemsContainer>
        {React.Children.map(children, (child, index) => {
          return (
          <ProgressBarOptionContainer key={index} >
            <ProgressCircle $isCurrentProgress={index === progressNumber} />
            {child}
          </ProgressBarOptionContainer>);
        })}
      </ProgressItemsContainer>
    </RegoProgressContainer>
  )
}