import React from "react";
import styled from "styled-components";

// // Define props for the styled components
// interface ToggleProps {
//   ison: boolean;
//   onToggle: () => void; // Correctly typed onToggle function
// }

// Styled component for the container
const ToggleContainer = styled.div<{ $isOn: boolean }>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  width: 42px;
  height: 22px;
  background-color: ${({ $isOn, theme }) =>
    $isOn ? theme.colours.primaryLight : theme.colours.userInfoCardHeader};
  border-radius: 15px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
`;

// Styled component for the circle
const ToggleCircle = styled.div<{ $isOn: boolean }>`
  width: 20px;
  height: 20px;
  background-color: white;
  border-radius: 50%;
  transform: ${({ $isOn }) => ($isOn ? "translateX(20px)" : "translateX(0)")};
  transition: transform 0.3s;
`;

interface ToggleButtonProps {
  isOn: boolean;
  onToggle: () => void;
}

export const ToggleButton: React.FC<ToggleButtonProps> = ({
  isOn,
  onToggle,
}) => {
  return (
    <ToggleContainer $isOn={isOn} onClick={onToggle}>
      <ToggleCircle $isOn={isOn} />
    </ToggleContainer>
  );
};
