import React from "react";
import styled from "styled-components";
import { FaMedal } from "react-icons/fa";

interface ProgressBarProps {
  daysRemaining: number;
  progress: number; // %
}

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 16px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
  color: ${({ theme }) => theme.fonts.colour};

  @media (max-width: 600px) {
    padding: 12px;
  }
`;

const StyledTitle = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const StyledProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5%;
`;

const StyledProgressBarContainer = styled.div`
  flex: 1;
  height: 12px;
  background-color: ${({ theme }) => theme.colours.progressBackground};
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
`;

const StyledProgress = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress * 100}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colours.progressStart}, ${({ theme }) => theme.colours.progressEnd});
  transition: width 0.5s ease;
`;

const StyledMedalIcon = styled(FaMedal)`
  font-size: 100%;
  color: ${({ theme }) => theme.colours.secondaryDark};
  background-color: ${({ theme }) => theme.background};
`;

export const CompCountdownBar: React.FC<ProgressBarProps> = ({ daysRemaining, progress }) => {
  return (
    <StyledContainer>
      <StyledTitle>{daysRemaining} days to go!</StyledTitle>
      <StyledProgressWrapper>
        <StyledProgressBarContainer>
          <StyledProgress $progress={progress} />
        </StyledProgressBarContainer>
        <StyledMedalIcon />
      </StyledProgressWrapper>
    </StyledContainer>
  );
};
