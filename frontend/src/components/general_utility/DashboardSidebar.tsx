import React from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaUser, FaCog, FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";
import { sendRequest } from "../../utility/request";

interface SidebarProps {
  name: string;
  affiliation: string;
  cropState: boolean;
}

const SidebarContainer = styled.div<{ $cropState: boolean }>`
  min-width: ${({ $cropState: cropState }) => (cropState ? "40px" : "200px")}; /* Adjust min-width based on cropState */
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px; 
  border-radius: 20px;
  margin: 15px;
  height: calc(100vh - 50px);
  overflow-x: hidden;
  overflow-y: auto;

  @media (max-width: 600px) {
    min-width: 35px;
    width: 35px; /* Maintain this for mobile responsiveness */
  }
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 20px;
  flex-grow: 1;
  width: 100%;
  height: 100%;
  min-height: 600px;
  overflow-y: auto;
  margin-bottom: 10px;
`;

const ProfileSection = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  color: ${({ theme }) => theme.fonts.colour};
  flex-shrink: 1;

  @media (max-width: 600px) {
    display: none;
  }
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
  margin-bottom: 20px;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const NavButton = styled.button<{ $active: boolean }>`
  background-color: ${({ theme, $active: active }) => (active ? theme.background : "transparent")};
  border: none;
  color: ${({ theme }) => theme.fonts.colour};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 15px;
  align-items: center;
  padding: 0px;
  width: 95%;
  text-align: left;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  transition: background-color 0.3s;
  border-radius: 40px;
  flex-grow: 1;
  margin: 5px;
  justify-content: center;

  &:hover {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.fonts.colour};
  }

  svg {
    /* margin-right: 10px; */
    min-width: 16px;
  }

  @media (max-width: 600px) {
    justify-content: center;
    padding: 10px;
    gap: 0;

    span {
      display: none;
    }
  }
`;

const LogoutButton = styled.button`
  background-color: ${({ theme }) => theme.colours.cancel};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  cursor: pointer;
  width: 95%;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  border-radius: 40px;
  transition: background-color 0.3s;
  align-items: center;
  display: flex;
  gap: 20px;
  padding: 20px;
  margin: 5px;
  border-radius: 40px;
  flex-shrink: 1;
  letter-spacing: ${({ theme }) => theme.fonts.spacing.normal};
  
  svg {
    width: 20px;
    height: 20px;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colours.cancelDark};
    color: ${({ theme }) => theme.background};
    font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  }

  @media (max-width: 600px) {
    justify-content: center;
    gap: 0;

    span {
      display: none;
    }
    
    svg {
      width: 24px;
      min-width: 16px;
      height: 24px;
    }
  }
`;

export const DashboardSidebar: React.FC<SidebarProps> = ({ name, affiliation, cropState }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    await sendRequest.post('/user/logout');
    handleNavigation('/');
  }

  return (
    <SidebarContainer $cropState={cropState}> {/* Pass cropState to SidebarContainer */}
      <SidebarContent>
        {!cropState && (
          <ProfileSection>
            <ProfilePic />
            <div>Hello</div>
            <Name>{name}</Name>
            <div>{affiliation}</div>
          </ProfileSection>
        )}

        <NavLinks>
          <NavButton 
            $active={location.pathname === "/dashboard"}
            onClick={() => handleNavigation('/dashboard')}
          >
            <FaHome /> {!cropState && <span>Dashboard</span>}
          </NavButton>
          <NavButton 
            $active={location.pathname === "/account"}
            onClick={() => handleNavigation('/account')}
          >
            <FaUser /> {!cropState && <span>Account</span>}
          </NavButton>
          <NavButton 
            $active={location.pathname === "/settings"}
            onClick={() => handleNavigation('/settings')}
          >
            <FaCog /> {!cropState && <span>Settings</span>}
          </NavButton>
        </NavLinks>
      </SidebarContent>

      <LogoutButton onClick={handleLogout}>
        <FaSignOutAlt /> <span>Logout</span>
      </LogoutButton>
    </SidebarContainer>
  );
};
