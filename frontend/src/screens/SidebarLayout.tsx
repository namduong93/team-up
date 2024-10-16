import { Outlet } from "react-router-dom";
import { DashboardSidebar, DashboardSidebarProps } from "../components/general_utility/DashboardSidebar";
import styled from "styled-components";

const SharedBackground = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  background-color: ${({ theme }) => theme.background};
  transition: background-color 0.5s ease;
  & * {
    transition: background-color 0.5s ease;
  }
`;

export const SidebarLayout = ({ ...props }: DashboardSidebarProps) => {
  return (
    <SharedBackground>
      <DashboardSidebar {...props} />
      <Outlet />
    </SharedBackground>
  );
}