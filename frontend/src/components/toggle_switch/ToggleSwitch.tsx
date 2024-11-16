import React, { FC, ReactNode, useState } from "react";
import styled from "styled-components";


interface ToggleSwitchProps {
  children: ReactNode;
  style: React.CSSProperties;
  defaultBorderIndex: number;
}

const StyledToggleDiv = styled.div<{ $numElems: number, $borderIndex: number }>`
  display: flex;
  position: relative;
  user-select: none;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: clamp(0.9em, calc(7.5vw - ${({ $numElems }) => `${$numElems}vw`}), 2em);
  &::after {
    content: '';
    height: 100%;
    width: ${(props) => 100 / props.$numElems}%;
    position: absolute;
    background-color: transparent;
    z-index: -1;
    translate: ${(props) => 100 * props.$borderIndex}% 0;
    transition: translate 200ms;
    border-bottom: solid 2px ${({ theme }) => theme.fonts.colour};
  }
`;

const StyledToggleDivOptionDiv = styled.div`
  flex: 1;
  cursor: pointer;
  background-color: transparent;
  overflow: hidden;
`;

export const CustomToggleSwitch: FC<ToggleSwitchProps> = ({ children, style, defaultBorderIndex = 0 }) => {

  const [borderIndex, setBorderIndex] = useState(defaultBorderIndex);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    const ind = target.getAttribute('data-index');
    setBorderIndex(Number(ind));
  }
  
  const realChildren = React.Children.toArray(children).filter((child) => child !== null)
  const numChildren = realChildren.length;
  return (
    <StyledToggleDiv
      $borderIndex={borderIndex}
      $numElems={numChildren}
      style={{ maxWidth: `${150 * numChildren}px`, ...style }}
      data-test-id="toggle-switch--StyledToggleDiv-0">
      {realChildren.map((child, index) => {
        return (
          <StyledToggleDivOptionDiv
            onClick={handleClick}
            data-index={index}
            key={index}
            data-test-id="toggle-switch--StyledToggleDivOptionDiv-0">
            {child}
          </StyledToggleDivOptionDiv>
        );
      })}
    </StyledToggleDiv>
  );
}