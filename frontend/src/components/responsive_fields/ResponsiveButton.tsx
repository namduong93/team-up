import { FC, ReactNode } from "react";
import styled from "styled-components";


export const SortButton = styled.button<{ $isSortOpen: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border-radius: 10px;
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.filterText};
  color: ${({ theme }) => theme.colours.filterText};
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;

  ${({ $isSortOpen: isSortOpen, theme }) =>
    isSortOpen &&
    `
    background-color: ${theme.colours.sidebarBackground};
    color: ${theme.fonts.colour};
  `}

  &:hover {
    cursor: pointer;
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    color: ${({ theme }) => theme.fonts.colour};
  }
`;


interface ResponsiveButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  isOpen: boolean;
  icon: ReactNode;
  label: string;
}

export const ResponsiveButton: FC<ResponsiveButtonProps> = ({ onClick, icon, label, style, isOpen = false, ...props }) => {
  return (
    <SortButton onClick={onClick} style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      ...style
    }} $isSortOpen={isOpen} {...props}>
      <div style={{ display: 'flex', alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%', justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          {icon}
        </div>
        <span>{label}</span>
      </div>
    </SortButton>
  )
}



export const TransparentButton = styled.button<{ $isSortOpen: boolean, $actionType: 'primary' | 'secondary' | 'confirm' | 'error' }>`
  background-color: transparent;
  border-radius: 10px;
  box-sizing: border-box;
  border: 0px;
  padding: 8px 16px;
  display: flex;
  gap: 10px;
  align-items: center;
  transition: background-color 0.3s ease, color 0.3s ease;

  &:hover {
    cursor: pointer;
    background-color: ${({ $actionType: actionType, theme }) => {
      if (actionType === "primary") {
        return theme.colours.primaryDark;
      } else if (actionType === "secondary") {
        return theme.colours.secondaryDark;
      } else if (actionType === 'confirm') {
        return theme.colours.confirmDark;
      } else {
        return theme.colours.cancelDark;
      }
    }} !important;
    color: ${({ theme }) => theme.background};
    /* font-weight: ${({ theme }) => theme.fonts.fontWeights.bold}; */
  }
`;

interface ResponsiveActionButtonProps extends ResponsiveButtonProps {
  actionType: 'primary' | 'secondary' | 'confirm' | 'error';
}

export const TransparentResponsiveButton: FC<ResponsiveActionButtonProps> = ({
  onClick, actionType, icon, label, style, isOpen = false, ...props }) => {
  
  return (
    <TransparentButton $actionType={actionType} onClick={onClick} style={{
      height: '100%',
      width: '100%',
      overflow: 'hidden',
      padding: '0',
      display: 'flex',
      flexWrap: 'wrap',
      ...style
    }} $isSortOpen={isOpen} {...props}>
      <div style={{ display: 'flex',
        alignContent: 'start', flexWrap: 'wrap', height: '50%', width: '100%',
        justifyContent: 'center' }}>
        <div style={{ height: '200%' }}>
          {icon}
        </div>
        <span style={{ marginLeft: '5px' }}>{label}</span>
      </div>
    </TransparentButton>
  )
}
