import { FC, useState, useEffect } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
// import { useNavigate } from "react-router-dom";
import { defaultTheme } from "../../themes/defaultTheme";
import { darkTheme } from "../../themes/darkTheme";
import { DashboardSidebar } from "../../components/general_utility/DashboardSidebar";

export const Settings: FC = () => {
  // const navigate = useNavigate();
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const name = "Name";
  const affiliation = "UNSW";

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkTheme(true);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? "dark" : "light";
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);

    // trigger app to update theme
    window.dispatchEvent(new Event("storage"));
  };


  return (
  <FlexBackground>
    <DashboardSidebar name={name} affiliation={affiliation} />
    <h2>Settings Page</h2>
    <div> 
    <button 
        onClick={toggleTheme} 
        style={{
          background: isDarkTheme ? darkTheme.colours.primaryDark : defaultTheme.colours.primaryLight,
          color: isDarkTheme ? darkTheme.colours.primaryLight : defaultTheme.colours.primaryDark,
        }}
      >
        Toggle to {isDarkTheme ? "Light" : "Dark"} Theme
      </button>
    </div>
  </FlexBackground>
  );
}