import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";

interface SidebarProps {
  name: string;
  affiliation: string;
};

const SidebarContainer = styled.div`
  width: 300px;
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-radius: 20px;
  margin: 1rem;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 50px;
  flex: 0 1 auto;
  width: 100%;
  height: 100%;
  min-height: 600px;
`;

const ProfileSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  margin-top: 100px;
`;

const ProfilePic = styled.div`
  width: 150px;
  height: 150px;
  background-color: white;
  border-radius: 50%;
  margin-bottom: 10px;
`;

const Name = styled.div`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
`;

const NavLinks = styled.nav`
  margin-top: 20px;
`;

const NavButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "white" : "transparent")};
  border: none;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  display: flex;
  gap: 15px;
  align-items: center;
  padding: 20px;
  width: 95%;
  text-align: left;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  transition: background-color 0.3s;
  border-radius: 40px;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.fonts.colour};
  }

  svg {
    margin-right: 10px;
  }
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: pointer;
  width: 95%;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.bold}
  border-radius: 40px;
  transition: background-color 0.3s;

  &:hover {
    filter: brightness(1.1);
  }
`;

export const DashboardSidebar: React.FC<SidebarProps> = ({ name, affiliation }) => {
  const navigate = useNavigate();
  
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <SidebarContainer>
      <SidebarContent>
        <ProfileSection>
          <ProfilePic />
          <div>Hello,</div>
          <Name>{name}</Name>
          <div>{affiliation}</div>
        </ProfileSection>

        <NavLinks>
          <NavButton 
            active={location.pathname === "/dashboard"}
            onClick={() => handleNavigation('/dashboard')}
          >
            <FaHome /> Dashboard
          </NavButton>
          <NavButton 
            active={location.pathname === "/account"}
            onClick={() => handleNavigation('/account')}
          >
            <FaUser /> Account
          </NavButton>
          <NavButton 
            active={location.pathname === "/settings"}
            onClick={() => handleNavigation('/settings')}
          >
            <FaCog /> Settings
          </NavButton>
        </NavLinks>
      </SidebarContent>

      <LogoutButton onClick={() => handleNavigation('/')}>
        <FaSignOutAlt /> Logout
      </LogoutButton>
    </SidebarContainer>
  );
};
