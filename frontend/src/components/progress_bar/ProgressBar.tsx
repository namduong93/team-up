import React, { FC } from "react";
import styled from "styled-components";

const StyledRegoProgressContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  color: ${({ theme }) => theme.fonts.colour};
  display: flex;
  position: fixed;
  min-width: 170px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 10px;
  box-sizing: border-box;

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

const StyledProgressItemsContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 60%;
  width: 80%;
  position: relative;
  justify-content: space-between;
  margin-top: 10vh;
  box-sizing: border-box;

  &::after {
    content: "";
    position: absolute;
    height: 100%;
    width: 2px;
    left: 20px;
    background-color: ${({ theme }) => theme.colours.sidebarLine};
  }
`;

const StyledProgressBarOptionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10%;
`;

const StyledProgressCircle = styled.div<{ $isCurrentProgress: boolean }>`
  background-color: ${({ $isCurrentProgress, theme }) =>
    $isCurrentProgress ? theme.colours.primaryDark : theme.background};
  min-width: 42px;
  aspect-ratio: 1 / 1;
  border-radius: 50%;
  position: relative;
  z-index: 1;
  box-sizing: border-box;
`;

export const RegoProgressBar: FC<ProgressBarProps> = ({
  progressNumber = 0,
}) => {
  return (
    <ProgressBar progressNumber={progressNumber}>
      <span>User Type</span>
      <span>Account Information</span>
      <span>Site Information</span>
      <span>Institution Information</span>
    </ProgressBar>
  );
};

export const CompCreationProgressBar: FC<ProgressBarProps> = ({
  progressNumber = 0,
}) => {
  return (
    <ProgressBar progressNumber={progressNumber}>
      <span>Competition Details</span>
      <span>Confirmation</span>
    </ProgressBar>
  );
};

export const CompRegistrationProgressBar: FC<ProgressBarProps> = ({
  progressNumber = 0,
}) => {
  return (
    <ProgressBar progressNumber={progressNumber}>
      <span>Competition Information</span>
      <span>Individual Information</span>
      <span>Competitive Experience</span>
    </ProgressBar>
  );
};

interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  progressNumber: number;
}

/**
 * A React component for the form progress bar
 *
 * @param {ProgressBarProps} props - React ProgressBarProps specified above
 * @returns {JSX.Element} - Web page progress bar component
 */

// ACCEPTS PROPS:
//  - progressNumber: number --- The index to specify the currently highlighted progress circle
//  - children --- Any ReactNodes that should appear next to the progress circle. (for every
//      included child there will be an extra dot)
//  - style --- optional style to the container
//  - props --- optional additional props to the container
export const ProgressBar: FC<ProgressBarProps> = ({
  progressNumber = 0,
  children,
  style,
  ...props
}) => {
  return (
    <StyledRegoProgressContainer
      style={{ position: "relative", ...style }}
      {...props}
    >
      <StyledRegoProgressContainer style={{ ...style }} {...props}>
        <StyledProgressItemsContainer>
          {React.Children.map(children, (child, index) => {
            return (
              <StyledProgressBarOptionContainer key={index}>
                <StyledProgressCircle
                  $isCurrentProgress={index === progressNumber}
                />
                {child}
              </StyledProgressBarOptionContainer>
            );
          })}
        </StyledProgressItemsContainer>
      </StyledRegoProgressContainer>
    </StyledRegoProgressContainer>
  );
};
