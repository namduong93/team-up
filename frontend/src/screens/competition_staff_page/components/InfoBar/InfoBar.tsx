import React, { FC, useEffect, useRef } from "react";
import styled from "styled-components";

export interface InfoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const InfoBarContainerDiv = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  border-radius: 10px;
  right: 0;
  bottom: 0;
  z-index: 50;
  /* TODO: add min-height */
  transition: width 0.25s ease, height 0.25s ease;
  width: ${({ $isOpen }) => $isOpen ? '30%' : '0'};
  height: 83%;
  max-width: 380px;
  min-width: ${({ $isOpen }) => $isOpen ? '320px' : '0'};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
  border: ${({ $isOpen }) => $isOpen ? '1px' : '0'} solid ${({ theme }) => theme.colours.sidebarLine};
  
  &:focus {
    outline: none;
  }

  & * {
    font-size: ${({ $isOpen }) => $isOpen ? '1em' : '0'};
  }
`;

const InfoContainer = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  box-sizing: border-box;
  margin: 10px 10px 10px 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const InfoBar: FC<InfoBarProps> = ({ isOpenState: [isOpen, setIsOpen], children, ...props }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      isOpen && (containerRef.current as HTMLElement).focus();
    }
  }, [isOpen]);


  return (
    <InfoBarContainerDiv ref={containerRef}
    tabIndex={9999}
    onBlur={() => setIsOpen(false)}
    $isOpen={isOpen} {...props}>

    <InfoContainer>
      {children}
    </InfoContainer>

    </InfoBarContainerDiv>
  )
}