import { FC, useState, useEffect } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import styled from "styled-components";

const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const ToggleButton = styled.button<{ isDarkTheme: boolean }>`
  background-color: ${({ isDarkTheme, theme }) =>
    isDarkTheme ? theme.colours.primaryDark : theme.colours.primaryLight};
  color: ${({ isDarkTheme, theme }) =>
    isDarkTheme ? theme.background : theme.fonts.colour };
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;

  &:hover {
    opacity: 0.8;
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const SettingsContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

export const Settings: FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  // load saved theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
    }
  }, []);

  // toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? "dark" : "light";
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <Background>
      <SettingsContainer>
        <Title>Settings Page</Title>
        <ToggleButton isDarkTheme={isDarkTheme} onClick={toggleTheme}>
          Toggle to {isDarkTheme ? "Light" : "Dark"} Theme
        </ToggleButton>
      </SettingsContainer>
    </Background>
  );
};
