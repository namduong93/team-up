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
  &::after {
    content: '';
    height: 100%;
    width: ${(props) => 100 / props.$numElems}%;
    position: absolute;
    background-color: black;
    z-index: -1;
    translate: ${(props) => 100 * props.$borderIndex}% 0;
    padding-bottom: 2px;
    transition: translate 200ms;
  }
`;

const ToggleDivOptionDiv = styled.div`
  flex: 1;
  cursor: pointer;
  background-color: white;
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

  const numChildren = React.Children.count(children);
  return (
    <StyledToggleDiv $borderIndex={borderIndex} $numElems={numChildren} style={{ ...style }}>
      {React.Children.map(children, (child, index) => {
        return (
        <ToggleDivOptionDiv onClick={handleClick} data-index={index} key={index}>
          {child}
        </ToggleDivOptionDiv>);
      })}
    </StyledToggleDiv>
  )
}