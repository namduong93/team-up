import React from "react";
import styled from "styled-components";
import { FaMedal } from "react-icons/fa";

interface ProgressBarProps {
  daysRemaining: number;
  progress: number; // %
}

const Container = styled.div`
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

const Title = styled.div`
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;

  @media (max-width: 400px) {
    font-size: 1rem;
  }
`;

const ProgressWrapper = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  gap: 5%;
`;

const ProgressBarContainer = styled.div`
  flex: 1;
  height: 12px;
  background-color: ${({ theme }) => theme.colours.progressBackground};
  border-radius: 6px;
  overflow: hidden;
  box-sizing: border-box;
`;

const Progress = styled.div<{ $progress: number }>`
  height: 100%;
  width: ${({ $progress }) => $progress * 100}%;
  background: linear-gradient(90deg, ${({ theme }) => theme.colours.progressStart}, ${({ theme }) => theme.colours.progressEnd});
  transition: width 0.5s ease;
`

const MedalIcon = styled(FaMedal)`
  font-size: 100%;
  color: ${({ theme }) => theme.colours.secondaryDark};
  background-color: ${({ theme }) => theme.background};
`;

export const CompCountdownBar: React.FC<ProgressBarProps> = ({ daysRemaining, progress }) => {
  return (
    <Container>
      <Title>{daysRemaining} days to go!</Title>
      <ProgressWrapper>
        <ProgressBarContainer>
          <Progress $progress={progress} />
        </ProgressBarContainer>
        <MedalIcon />
      </ProgressWrapper>
    </Container>
  );
};
