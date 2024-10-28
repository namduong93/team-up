import { FC, useState, useEffect } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../utility/request";
import { SearchBar } from "../competition_staff_page/components/PageUtils";
import { FaChevronDown } from "react-icons/fa";
import { ProfileCard } from "../student/ProfileCard";

import staffFAQs from "./faq_staff.json";
import studentFAQs from "./faq_student.json";
import adminFAQs from "./faq_admin.json";
import Fuse from "fuse.js";

interface FAQ {
  question: string;
  answer: string;
};

const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  width: 100%;
  height: 100%;
  align-items: center;
`;

const ToggleButton = styled.button<{ $isDarkTheme: boolean }>`
  background-color: ${({ $isDarkTheme: isDarkTheme, theme }) =>
    isDarkTheme ? theme.colours.notifDark : theme.colours.notifLight};
  color: ${({ $isDarkTheme: isDarkTheme, theme }) =>
    isDarkTheme ? theme.background : theme.fonts.colour};
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  box-sizing: border-box;

  &:hover {
    background-color: ${({ $isDarkTheme: isDarkTheme, theme }) =>
      isDarkTheme ? theme.colours.notifLight : theme.colours.notifDark};
    color: ${({ $isDarkTheme: isDarkTheme, theme }) =>
      isDarkTheme ? theme.fonts.colour : theme.background};
  }
`;

const Title = styled.h2`
  margin-bottom: 20px;
  box-sizing: border-box;
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
  box-sizing: border-box;
`;

const DropdownHeader = styled.div<{ $isOpen: boolean }>`
  display: flex;
  justify-content: space-between; /* Align text and icon to opposite sides */
  align-items: center;
  padding: 15px;
  cursor: pointer;
  background-color: ${({ $isOpen: isOpen, theme }) =>
    isOpen ? theme.colours.secondaryLight : theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
  border-radius: 10px;
  border: none;
  box-sizing: border-box;

  svg {
    transition: transform 0.3s ease; /* Smooth rotation */
    transform: ${({ $isOpen }) => ($isOpen ? "rotate(180deg)" : "rotate(0deg)")};
  }
`;

const DropdownContent = styled.div<{ $isOpen: boolean }>`
  max-height: ${({ $isOpen: isOpen }) => (isOpen ? "100%" : "0")};
  overflow: hidden;
  transition: max-height 0.3s ease;
  margin: 10px 15px;
  box-sizing: border-box;
`;

const FAQSearchBar = styled(SearchBar)`
  height: 40px;
`;


export const Settings: FC = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [faq, setFAQ] = useState<FAQ[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setUserType] = useState<string>("");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [faqOpen, setFaqOpen] = useState(false);
  const [appearancesOpen, setAppearancesOpen] = useState(false);
  const [creditsOpen, setCreditsOpen] = useState(false);

  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const typeResponse = await sendRequest.get<{ type: string }>('/user/type');
        setUserType(typeResponse.data.type);
        const savedTheme = localStorage.getItem("theme");
        if (savedTheme === "dark") setIsDarkTheme(true);
        fetchFAQs(typeResponse.data.type);
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate('/');
          console.log('Authentication Error: ', error);
        });
        // can handle other codes or types of errors here if needed.
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

  const fuse = new Fuse(faq, {
    keys: ['question', 'answer'],
    threshold: 1
  });
  
  let searchedFAQs;
  if (searchQuery) {
    searchedFAQs = fuse.search(searchQuery);
  } else {
    searchedFAQs = faq.map((faq) => { return { item: faq } });
  }

  // Filter FAQs based on search query
  // const filteredFAQs = faq.filter(faqItem =>
  //   faqItem.question.toLowerCase().includes(searchQuery.toLowerCase())
  // );

  // Toggle between dark and light theme
  const toggleTheme = () => {
    const newTheme = !isDarkTheme ? "dark" : "light";
    setIsDarkTheme(!isDarkTheme);
    localStorage.setItem("theme", newTheme);
    window.dispatchEvent(new Event("storage"));
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
              {filteredFAQs.length > 0 ? (
                filteredFAQs.map((faqItem, index) => (
                  <div key={index}>
                    <h3>{faqItem.question}</h3>
                    <p>{faqItem.answer}</p>
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
              <ToggleButton $isDarkTheme={isDarkTheme} onClick={toggleTheme}>
                Toggle to {isDarkTheme ? "Light" : "Dark"} Theme
              </ToggleButton>
              {/* <ToggleButton $isDarkTheme={isDarkTheme} onClick={toggleTheme}>
                Toggle to {isDarkTheme ? "Light" : "Dark"} Theme
              </ToggleButton> */}
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
              We are a team of computer-science students from UNSW who worked on TeamUP for our capstone project. We hope you enjoy our app!
              <ProfileCard 
                name="Julian"
                email="julian@gamil.com"
                bio="full stack dev"
              />
              <ProfileCard 
                name="Tuyet"
                email="tuyet@gamil.com"
                bio="frontend dev"
              />
              <ProfileCard 
                name="Olivia"
                email="olivia@gamil.com"
                bio="frontend dev"
              />
              <ProfileCard 
                name="Quan"
                email="quan@gamil.com"
                bio="backend dev"
              />
              <ProfileCard 
                name="Nam"
                email="nam@gamil.com"
                bio="backend dev"
              />
              <ProfileCard 
                name="X"
                email="x@gamil.com"
                bio="backend dev"
              />
            </DropdownContent>
          </DropdownContainer>
        </SettingsContainer>
      </Background>
    )
  );
};