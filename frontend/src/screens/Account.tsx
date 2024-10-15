import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBackground } from "../components/general_utility/Background";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";
import defaultProfile from "../components/assets/default-profile.jpg";
import { sendRequest } from "../utility/request";

interface User {
  role: "student" | "staff"
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: "Male" | "Female" | "Other";
  preferredPronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
  profilePic: string;
  tshirtSize: string;
  dietaryPreferences: string;
  allergyPreferences: string;
  accessibilityPreferences: string;
};

interface CompetitionDetails {
  degree: string;
  year: number;
  isICPCEligible: boolean;
  competitionLevel: "A" | "B" | "AB";
  isBoersenEligible: boolean;
  bio: string;
  previousCompetitions: string; 
  competitionResults: string; 
};

const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
`;

const AccountContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  height: 100vh;
  width: 100vw;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: stretch;
  flex-wrap: wrap;
  width: 100%;
  overflow-y: auto;
  max-height: 100vh;
  
  & > * {
    flex: 1 1 300px;
    margin: 20px;
  }
`;

const AccountCard = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  flex: 1 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  max-height: 90%;
`;

const ProfilePic = styled.div<{ imageUrl: string }>`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-image: url(${(props) => props.imageUrl || defaultProfile});
  background-size: cover;
  background-position: center;
  border: 1px solid rgba(0, 0, 0, 0.2);
`;

const DetailsCard = styled.div`
  text-align: left;
  padding: 10px;
`;

const AccountItem = styled.div`
  margin-bottom: 20px;
  margin-right: 20px;
`;

const Label = styled.label`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const DetailsText = styled.div`
  margin: 10px 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-top: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

const Select = styled.select`
  padding: 15px;
  margin-top: 10px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
`;

const Option = styled.option``;

const ActionButtons = styled.div`
  margin-top: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 20px;
`;

const Button = styled.button<{ type: "primary" | "confirm" | "cancel" }>`
  padding: 15px 20px;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme, type }) => {
    switch (type) {
      case "primary":
        return theme.colours.primaryLight;
      case "confirm":
        return theme.colours.confirm;
      case "cancel":
        return theme.colours.cancel;
      default:
        return theme.colours.primaryLight;
    }
  }};

  &:hover {
    border: none;
    opacity: 0.8;
    color: ${({ theme }) => theme.background};
    background-color: ${({ theme, type }) => {
      switch (type) {
        case "primary":
          return theme.colours.primaryDark;
        case "confirm":
          return theme.colours.confirmDark;
        case "cancel":
          return theme.colours.cancelDark;
        default:
          return theme.colours.primaryDark;
      }
    }};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  resize: vertical;
`;

export const Account: FC = () => {
  const [user, setUser] = useState<User>({
    role: "student",
    name: "John Doe",
    preferredName: "Johnny",
    email: "john.doe@example.com",
    affiliation: "UNSW",
    gender: "Male",
    preferredPronouns: "He/Him",
    profilePic: "../components/assets/default-profile.jpg",
    tshirtSize: "Male L",
    dietaryPreferences: "N/A",
    allergyPreferences: "N/A",
    accessibilityPreferences: "N/A",
  });

  const [compDetails, setCompDetails] = useState<CompetitionDetails>({
    degree: "Computer Science",
    year: 3,
    isICPCEligible: true,
    competitionLevel: "A",
    isBoersenEligible: false,
    bio: "I am super passionate about coding problem solving!",
    previousCompetitions: "None",
    competitionResults: "N/A",
  });

  const [isEditingUser, setIsEditingUser] = useState(false);
  const [isEditingComp, setIsEditingComp] = useState(false);
  
  const [newDetails, setNewDetails] = useState<User>({
    ...user,
    profilePic: defaultProfile,
  });
  const [newCompDetails, setNewCompDetails] = useState<CompetitionDetails>(compDetails);

  const handleEditUser = () => {
    setIsEditingUser(true);
  };

  const handleEditComp = () => {
    setIsEditingComp(true);
  };

  const handleSaveUser = () => {
    setUser(newDetails);
    setIsEditingUser(false);
  };

  const handleSaveComp = () => {
    setCompDetails(newCompDetails);
    setIsEditingComp(false);
  };

  const handleCancelUser = () => {
    setNewDetails(user);
    setIsEditingUser(false);
  };

  const handleCancelComp = () => {
    setNewCompDetails(compDetails);
    setIsEditingComp(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(photoFile.type)) {
        alert("Unsupported file format. Please upload a JPEG, PNG, or GIF.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDetails({ ...newDetails, profilePic: reader.result as string });
      };
      reader.readAsDataURL(photoFile);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<User>('/user/profile_info');
        setUser(infoResponse.data);
        console.log("User details fetched:", infoResponse.data);
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    })();
  }, []);

  return (
    <Background>
      <DashboardSidebar cropState={false} />
      <AccountContainer>
        <CardContainer>
          <AccountCard>
            <ProfilePic imageUrl={newDetails.profilePic || defaultProfile } />
            <DetailsCard>
              <AccountItem>
                <Label>Profile Picture:</Label>
                {isEditingUser && (
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                )}
              </AccountItem>
              <AccountItem>
                <Label>Name:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.name}
                    onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.name}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Preferred Name:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.preferredName}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredName: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.preferredName}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Email:</Label>
                {isEditingUser ? (
                  <Input
                    type="email"
                    value={newDetails.email}
                    onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.email}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Affiliation:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.affiliation}
                    onChange={(e) => setNewDetails({ ...newDetails, affiliation: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.affiliation}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Gender:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.gender}
                    onChange={(e) => setNewDetails({ ...newDetails, gender: e.target.value as User["gender"] })}
                  >
                    <Option value="Male">Male</Option>
                    <Option value="Female">Female</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.gender}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Preferred Pronouns:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.preferredPronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredPronouns: e.target.value as User["preferredPronouns"] })}
                  >
                    <Option value="She/Her">She/Her</Option>
                    <Option value="He/Him">He/Him</Option>
                    <Option value="They/Them">They/Them</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.preferredPronouns}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>T-Shirt Size:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.tshirtSize}
                    onChange={(e) => setNewDetails({ ...newDetails, tshirtSize: e.target.value })}
                  >
                    <Option value="Male L">Male L</Option>
                    <Option value="Male M">Male M</Option>
                    <Option value="Male S">Male S</Option>
                    <Option value="Female L">Female L</Option>
                    <Option value="Female M">Female M</Option>
                    <Option value="Female S">Female S</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.tshirtSize}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Dietary Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.dietaryPreferences}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryPreferences: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.dietaryPreferences}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Allergy Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.allergyPreferences}
                    onChange={(e) => setNewDetails({ ...newDetails, allergyPreferences: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.allergyPreferences}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Accessibility Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.accessibilityPreferences}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityPreferences: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.accessibilityPreferences}</DetailsText>
                )}
              </AccountItem>
            </DetailsCard>
            <ActionButtons>
              {isEditingUser ? (
                <ButtonGroup>
                  <Button type="confirm" onClick={handleSaveUser}>
                    Save
                  </Button>
                  <Button type="cancel" onClick={handleCancelUser}>
                    Cancel
                  </Button>
                </ButtonGroup>
              ) : (
                <Button type="primary" onClick={handleEditUser}>Edit</Button>
              )}
            </ActionButtons>
          </AccountCard>
          
          <AccountCard>
            <DetailsCard>
              <AccountItem>
                <Label>Degree:</Label>
                {isEditingComp ? (
                  <Input
                    type="text"
                    value={newCompDetails.degree}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, degree: e.target.value })}
                  />
                ) : (
                  <DetailsText>{compDetails.degree}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Year:</Label>
                {isEditingComp ? (
                  <Input
                    type="number"
                    value={newCompDetails.year}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, year: parseInt(e.target.value) })}
                  />
                ) : (
                  <DetailsText>{compDetails.year}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>ICPC Eligible:</Label>
                {isEditingComp ? (
                  <Select
                    value={newCompDetails.isICPCEligible ? "true" : "false"}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, isICPCEligible: e.target.value === "true" })}
                  >
                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
                  </Select>
                ) : (
                  <DetailsText>{compDetails.isICPCEligible ? "Yes" : "No"}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Competition Level:</Label>
                {isEditingComp ? (
                  <Select
                    value={newCompDetails.competitionLevel}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, competitionLevel: e.target.value as CompetitionDetails["competitionLevel"] })}
                  >
                    <Option value="A">A</Option>
                    <Option value="B">B</Option>
                    <Option value="AB">AB</Option>
                  </Select>
                ) : (
                  <DetailsText>{compDetails.competitionLevel}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Boersen Eligible:</Label>
                {isEditingComp ? (
                  <Select
                    value={newCompDetails.isBoersenEligible ? "true" : "false"}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, isBoersenEligible: e.target.value === "true" })}
                  >
                    <Option value="true">Yes</Option>
                    <Option value="false">No</Option>
                  </Select>
                ) : (
                  <DetailsText>{compDetails.isBoersenEligible ? "Yes" : "No"}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Bio:</Label>
                {isEditingComp ? (
                  <Textarea
                    value={newCompDetails.bio}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, bio: e.target.value })}
                  />
                ) : (
                  <DetailsText>{compDetails.bio}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Previous Competitions:</Label>
                {isEditingComp ? (
                  <Textarea
                    value={newCompDetails.previousCompetitions}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, previousCompetitions: e.target.value })}
                  />
                ) : (
                  <DetailsText>{compDetails.previousCompetitions}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label>Competition Results:</Label>
                {isEditingComp ? (
                  <Textarea
                    value={newCompDetails.competitionResults}
                    onChange={(e) => setNewCompDetails({ ...newCompDetails, competitionResults: e.target.value })}
                  />
                ) : (
                  <DetailsText>{compDetails.competitionResults}</DetailsText>
                )}
              </AccountItem>
            </DetailsCard>
            <ActionButtons>
              {isEditingComp ? (
                <ButtonGroup>
                  <Button type="confirm" onClick={handleSaveComp}>
                    Save
                  </Button>
                  <Button type="cancel" onClick={handleCancelComp}>
                    Cancel
                  </Button>
                </ButtonGroup>
              ) : (
                <Button type="primary" onClick={handleEditComp}>Edit</Button>
              )}
            </ActionButtons>
          </AccountCard>
        </CardContainer>
      </AccountContainer>
    </Background>
  );
};
