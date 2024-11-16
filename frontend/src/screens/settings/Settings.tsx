import { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import studentFAQs from "./config/faq_student.json";
import adminFAQs from "./config/faq_admin.json";
import staffFAQs from "./config/faq_staff.json";
import Fuse from "fuse.js";
import { StyledBackground, StyledDropdownContainer, StyledDropdownContent, StyledDropdownHeader, StyledFAQSearchBar, StyledSettingsContainer, StyledThemeButton, StyledTitle } from "./Settings.styles";
import { FaChevronDown } from "react-icons/fa";
import { UpdatePassword } from "./subcomponents/UpdatePassword";
import { ProfileCard } from "../student/subcomponents/ProfileCard/ProfileCard";
import { backendURL } from "../../../config/backendURLConfig";

interface FAQ {
  question: string;
  answer: string;
}

export interface ThemeButtonProps {
  $newTheme: "light" | "dark" | "christmas" | "colourblind";
}

export const Settings: FC = () => {
  const [theme, setTheme] = useState<string>("light");
  const [passwordOpen, setPasswordOpen] = useState<boolean>(false);
  const [faq, setFAQ] = useState<FAQ[]>([]);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [appearancesOpen, setAppearancesOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const typeResponse = await sendRequest.get<{ type: string }>(
          "/user/type"
        );
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme) setTheme(savedTheme);
        fetchFAQs(typeResponse.data.type);
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate("/");
        });
      }
    })();
  }, []);

  const fetchFAQs = (userType: string) => {
    let faqs: FAQ[] = [];

    if (userType === "student") {
      faqs = studentFAQs;
    } else if (userType === "staff") {
      faqs = [...staffFAQs, ...studentFAQs];
    } else if (userType === "system_admin") {
      faqs = [...adminFAQs, ...staffFAQs, ...studentFAQs];
    }

    setFAQ(faqs);
  };

  const fuse = new Fuse(faq, { keys: ["question", "answer"], threshold: 1 });
  const searchedFAQs = searchQuery
    ? fuse.search(searchQuery).map((result) => result.item)
    : faq;

  const changeTheme = (newTheme: string) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("storage"));
    console.log(`theme updated to: ${newTheme}`);
  };

  return isLoaded && (
    <StyledBackground data-test-id="settings--StyledBackground-0">
      <StyledSettingsContainer data-test-id="settings--StyledSettingsContainer-0">
        <StyledTitle data-test-id="settings--StyledTitle-0">Settings Page</StyledTitle>
        <StyledDropdownContainer data-test-id="settings--StyledDropdownContainer-0">
          <StyledDropdownHeader
            $isOpen={passwordOpen}
            onClick={() => setPasswordOpen(!passwordOpen)}
            data-test-id="settings--StyledDropdownHeader-0">Update Password<FaChevronDown />
          </StyledDropdownHeader>
          <StyledDropdownContent $isOpen={passwordOpen} data-test-id="settings--StyledDropdownContent-0">
            <UpdatePassword isOpen={passwordOpen} />
          </StyledDropdownContent>
        </StyledDropdownContainer>
        <StyledDropdownContainer data-test-id="settings--StyledDropdownContainer-1">
          <StyledDropdownHeader
            $isOpen={faqOpen}
            onClick={() => setFaqOpen(!faqOpen)}
            data-test-id="settings--StyledDropdownHeader-1">FAQs<FaChevronDown />
          </StyledDropdownHeader>
          <StyledDropdownContent $isOpen={faqOpen} data-test-id="settings--StyledDropdownContent-1">
            <StyledFAQSearchBar
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-test-id="settings--StyledFAQSearchBar-0" />
            {searchedFAQs.length > 0 ? (
              searchedFAQs.map((faq, index) => (
                <div key={index}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </div>
              ))
            ) : (
              <div>No results found.</div>
            )}
          </StyledDropdownContent>
        </StyledDropdownContainer>
        <StyledDropdownContainer data-test-id="settings--StyledDropdownContainer-2">
          <StyledDropdownHeader
            $isOpen={appearancesOpen}
            onClick={() => setAppearancesOpen(!appearancesOpen)}
            data-test-id="settings--StyledDropdownHeader-2">Appearances<FaChevronDown />
          </StyledDropdownHeader>
          <StyledDropdownContent
            $isOpen={appearancesOpen}
            data-test-id="settings--StyledDropdownContent-2">
            <StyledThemeButton
              $isLight={true}
              $newTheme={"light"}
              $isSelected={theme === "light"}
              onClick={() => changeTheme("light")}
              data-test-id="settings--StyledThemeButton-0">Light</StyledThemeButton>
            <StyledThemeButton
              $isLight={false}
              $newTheme={"dark"}
              $isSelected={theme === "dark"}
              onClick={() => changeTheme("dark")}
              data-test-id="settings--StyledThemeButton-1">Dark</StyledThemeButton>
            <StyledThemeButton
              $isLight={false}
              $newTheme={"christmas"}
              $isSelected={theme === "christmas"}
              onClick={() => changeTheme("christmas")}
              data-test-id="settings--StyledThemeButton-2">Christmas</StyledThemeButton>
            <StyledThemeButton
              $isLight={false}
              $newTheme={"colourblind"}
              $isSelected={theme === "colourblind"}
              onClick={() => changeTheme("colourblind")}
              data-test-id="settings--StyledThemeButton-3">Colour Blind</StyledThemeButton>
          </StyledDropdownContent>
        </StyledDropdownContainer>
        <StyledDropdownContainer data-test-id="settings--StyledDropdownContainer-3">
          <StyledDropdownHeader
            $isOpen={creditsOpen}
            onClick={() => setCreditsOpen(!creditsOpen)}
            data-test-id="settings--StyledDropdownHeader-3">Credits<FaChevronDown />
          </StyledDropdownHeader>
          <StyledDropdownContent $isOpen={creditsOpen} data-test-id="settings--StyledDropdownContent-3">
            <p>
              We are a team of computer science students from UNSW who created
              TeamUP!
            </p>
            <ProfileCard
              name="Julian Zincone"
              email="https://www.linkedin.com/in/julian-zincone/"
              bio="An aspiring Full Stack developer who studies Computer Science and Tutors Computer Networks at UNSW."
              image={`${backendURL.HOST}:${backendURL.PORT}/images/julian_credits.jpg`}
            />
            <ProfileCard
              name="Tuyet Nguyen"
              email="https://www.linkedin.com/in/tuyet-nguyen-431192221"
              bio="Currently studying a Bachelors Degree in Mechanical and Manufacturing Engineering (Hon), and Computer Science. I’m an experienced Laboratory Assistant and Tutor at UNSW specialising in Python coding."
              image={`${backendURL.HOST}:${backendURL.PORT}/images/tuyet_credits.jpg`}
            />
            <ProfileCard
              name="Olivia Chen"
              email="https://www.linkedin.com/in/olivia-chen-oc2601"
              bio="Currently studying a Double Degree in Eletrical Engineering and Computer Science. Born to girlie, forced grind."
              image={`${backendURL.HOST}:${backendURL.PORT}/images/olivia_credits.jpg`}
            />
            <ProfileCard
              name="Quan Hoang"
              email="https://www.linkedin.com/in/tung-quan-hoang/"
              bio="Final year student in Commerce/Computer Science. Currently working as a simple IT handyman fixing Google Sheets and printing machines for small businesses."
              image={`${backendURL.HOST}:${backendURL.PORT}/images/quan_credits.png`}
            />
            <ProfileCard
              name="Van Nam Duong"
              email="https://www.linkedin.com/in/namduong93/"
              bio="Software Engineer currently studying final year Computer Science at UNSW. I love solving ridiculously hard problems."
              image={`${backendURL.HOST}:${backendURL.PORT}/images/nam_credits.png`}
            />
            <ProfileCard
              name="X Maverick"
              email="x@gmail.com"
              bio="Backend Dev"
            />
          </StyledDropdownContent>
        </StyledDropdownContainer>
      </StyledSettingsContainer>
    </StyledBackground>
  );
};
