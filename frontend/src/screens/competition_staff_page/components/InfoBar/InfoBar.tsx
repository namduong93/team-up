import React, { FC, useEffect, useRef, useState } from "react";
import styled from "styled-components";

export interface InfoBarProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpenState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const InfoBarContainerDiv = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  border-radius: 10px;
  overflow: auto;
  right: 0;
  bottom: 1.25%;
  z-index: 50;
  /* TODO: add min-height */
  transition: width 0.25s ease, min-width 0.25s ease, background-color 0.25s ease !important;
  width: ${({ $isOpen }) => $isOpen ? '40%' : '0'};
  height: 98%;
  max-width: 380px;
  min-width: ${({ $isOpen }) => $isOpen ? '320px' : '0'};
  background-color: ${({ theme }) => theme.colours.cardBackground};
  color: ${({ theme }) => theme.fonts.colour};
  border: ${({ $isOpen }) => $isOpen ? '1px' : '0'} solid ${({ theme }) => theme.colours.sidebarBackground};
  box-shadow: 4px 4px 4px 4px rgba(0, 0, 0, 0.25);

  &:focus {
    outline: none;
  }

  & * {
    font-size: ${({ $isOpen }) => $isOpen ? '1em' : '0'};
    ${({ $isOpen }) => !$isOpen && 'width: 0'};
    transition: width 0.25s ease !important;
  }
`;

const InfoContainer = styled.div`
  width: calc(100% - 20px);
  height: calc(100% - 20px);
  box-sizing: border-box;
  margin: 10px 10px 10px 10px;
  gap: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const InfoBar: FC<InfoBarProps> = ({ isOpenState: [isOpen, setIsOpen], children, ...props }) => {
  const containerRef = useRef(null);

  useEffect(() => {

    const handleClick = (e: MouseEvent) => {
      if (!containerRef.current) {
        return;
      }
      const bounds = (containerRef.current as HTMLElement).getBoundingClientRect();

      if ((e.clientX >= bounds.left
        && e.clientX <= bounds.right
        && e.clientY >= bounds.top
        && e.clientY <= bounds.bottom)) {
        return;
      }
      setIsOpen(false);

    }

    document.addEventListener('mousedown', handleClick);

    return () => {
      document.removeEventListener('mousedown', handleClick);
    }
  }, []);

  return (
    <InfoBarContainerDiv
      ref={containerRef}
      tabIndex={9999}
      $isOpen={isOpen} {...props}
      onClick={(e) => e.stopPropagation()}
    >
      <InfoContainer>
        {children}
      </InfoContainer>

    </InfoBarContainerDiv>
  )
}