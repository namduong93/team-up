import { FC, useState, useEffect } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import { SearchBar } from "../competition_staff_page/components/PageUtils";
import { FaChevronDown } from "react-icons/fa";
import { ProfileCard } from "../student/ProfileCard";
import { backendURL } from "../../../config/backendURLConfig";

import staffFAQs from "./faq_staff.json";
import studentFAQs from "./faq_student.json";
import adminFAQs from "./faq_admin.json";
import Fuse from "fuse.js";

interface FAQ {
  question: string;
  answer: string;
};

interface ThemeButtonProps {
  $newTheme: "light" | "dark" | "christmas" | "colourblind";
};

const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: 100%;
  height: 100%;
  align-items: center;
`;

const ThemeButton = styled.button<ThemeButtonProps & { $isSelected: boolean, $isLight: boolean }>`
  background-color: ${({ theme, $newTheme: newTheme }) => theme.themes[newTheme]};
  color: ${({ $isLight: isLight }) => isLight ? "black" : "white"};
  padding: 10px 15px;
  margin: 5px;
  border: ${({ theme, $isSelected: isSelected }) => 
    isSelected ? `3px solid ${theme.colours.cancel}` : "3px solid transparent"};
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
  box-sizing: border-box;

  &:hover {
    transform: translate(2px, 2px);
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
  width: 98%;
  height: 100%;
  overflow-y: auto;
  max-height: 95%;
`;

const DropdownContainer = styled.div`
  width: 100%;
  max-width: 600px;
  margin-top: 20px;
`;

const DropdownHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background-color: ${({ $isOpen, theme }) =>
    $isOpen ? theme.colours.secondaryLight : theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;

  svg {
    transition: transform 0.3s ease;
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen }) => ($isOpen ? "100%" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease !important;
  margin: 10px 15px;
`;

const FAQSearchBar = styled(SearchBar)`
  height: 40px;
`;

export const Settings: FC = () => {
  const [theme, setTheme] = useState<string>("light");
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
        const typeResponse = await sendRequest.get<{ type: string }>("/user/type");
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

  return (
    isLoaded && (
      <Background>
        <SettingsContainer>
          <Title>Settings Page</Title>

          <DropdownContainer>
            <DropdownHeader
              $isOpen={faqOpen}
              onClick={() => setFaqOpen(!faqOpen)}
            >
              FAQs
              <FaChevronDown />
            </DropdownHeader>
            <DropdownContent $isOpen={faqOpen}>
              <FAQSearchBar
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
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
            </DropdownContent>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownHeader
              $isOpen={appearancesOpen}
              onClick={() => setAppearancesOpen(!appearancesOpen)}
            >
              Appearances
              <FaChevronDown />
            </DropdownHeader>
            <DropdownContent $isOpen={appearancesOpen}>
              <ThemeButton $isLight={true} $newTheme={"light"} $isSelected={theme === "light"} onClick={() => changeTheme("light")}>Light</ThemeButton>
              <ThemeButton $isLight={false} $newTheme={"dark"} $isSelected={theme === "dark"} onClick={() => changeTheme("dark")}>Dark</ThemeButton>
              <ThemeButton $isLight={false} $newTheme={"christmas"} $isSelected={theme === "christmas"} onClick={() => changeTheme("christmas")}>Christmas</ThemeButton>
              <ThemeButton $isLight={false} $newTheme={"colourblind"} $isSelected={theme === "colourblind"} onClick={() => changeTheme("colourblind")}>Colour Blind</ThemeButton>
            </DropdownContent>
          </DropdownContainer>

          <DropdownContainer>
            <DropdownHeader
              $isOpen={creditsOpen}
              onClick={() => setCreditsOpen(!creditsOpen)}
            >
              Credits
              <FaChevronDown />
            </DropdownHeader>
            <DropdownContent $isOpen={creditsOpen}>
              <p>We are a team of computer science students from UNSW who created TeamUP!</p>
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
            </DropdownContent>
          </DropdownContainer>
        </SettingsContainer>
      </Background>
    )
  );
};
