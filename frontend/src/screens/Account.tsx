import { FC, useState } from "react";
import styled from "styled-components";
import { FlexBackground } from "../components/general_utility/Background";
import { DashboardSidebar } from "../components/general_utility/DashboardSidebar";

interface User {
  role: "student" | "staff"
  name: string;
  email: string;
  affiliation: string;
  gender: "Male" | "Female" | "Other";
  profilePic: string;
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
}

const AccountContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  overflow: hidden;
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 90%;
  gap: 40px;
`;

const AccountCard = styled.div`
  background-color: ${({ theme }) => theme.background};
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 45%;
  height: auto;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  max-height: 100%;
`;

const ProfilePic = styled.div<{ imageUrl: string }>`
  width: 10rem;
  height: 10rem;
  background-color: blueviolet;
  border-radius: 50%;
  margin-bottom: 1rem;
  background-image: url(${(props) => props.imageUrl});
  background-size: cover;
  background-position: center;
`;

const DetailsCard = styled.div`
  text-align: left;
  margin-top: 2rem;
`;

const AccountItem = styled.div`
  margin-bottom: 1.5rem;
  margin-right: 20px;
`;

const Label = styled.label`
  font-weight: bold;
  color: ${({ theme }) => theme.fonts.colour};
`;

const DetailsText = styled.div`
  margin: 0.5rem 0;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.8rem;
  margin-top: 0.5rem;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 1rem;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
`;

const Select = styled.select`
  padding: 1rem;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  border-radius: 0.5rem;
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
  gap: 1rem;
`;

const Button = styled.button<{ type: "primary" | "confirm" | "cancel" }>`
  padding: 1rem 2rem;
  border: none;
  border-radius: 0.5rem;
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
  resize: vertical; // Allows the user to resize vertically
`;

export const Account: FC = () => {
  const [user, setUser] = useState<User>({
    role: "student",
    name: "John Doe",
    email: "john.doe@example.com",
    affiliation: "UNSW",
    gender: "Male",
    profilePic: "../components/assets/default-profile.jpg",
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

  const [editingCard, setEditingCard] = useState<"user" | "competition" | null>(null);
  const [newDetails, setNewDetails] = useState<User>(user);
  const [newCompDetails, setNewCompDetails] = useState<CompetitionDetails>(compDetails);

  const handleEdit = (card: "user" | "competition") => {
    setEditingCard(card);
  };

  const handleSave = () => {
    setUser(newDetails);
    setCompDetails(newCompDetails);
    setEditingCard(null);
  };

  const handleCancel = () => {
    setNewDetails(user);
    setNewCompDetails(compDetails);
    setEditingCard(null);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const photoFile = e.target.files?.[0];

    if (photoFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDetails({ ...newDetails, profilePic: reader.result as string });
      };
      reader.readAsDataURL(photoFile);
    }
  };

  return (
    <FlexBackground>
      <DashboardSidebar name={user.name} affiliation={user.affiliation} cropState={false}/>
      <AccountContainer>
        <CardContainer>
          <AccountCard>
            <ProfilePic imageUrl={newDetails.profilePic} />
            <DetailsCard>
              <AccountItem>
                <Label>Profile Picture:</Label>
                {editingCard === "user" ? (
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                  />
                ) : null}
              </AccountItem>
              <AccountItem>
                <Label>Name:</Label>
                {editingCard === "user" ? (
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
                <Label>Email:</Label>
                {editingCard === "user" ? (
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
                {editingCard === "user" ? (
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
                {editingCard === "user" ? (
                  <Select
                    value={newDetails.gender}
                    onChange={(e) => {
                      setNewDetails({ ...newDetails, gender: e.target.value as "Male" | "Female" | "Other" });
                      setNewCompDetails({ ...newCompDetails, isBoersenEligible: e.target.value !== "Male" });
                    }}
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
                <Label>Dietary Preferences:</Label>
                {editingCard === "user" ? (
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
                {editingCard === "user" ? (
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
                {editingCard === "user" ? (
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
              {editingCard === "user" ? (
                <ButtonGroup>
                  <Button type="confirm" onClick={handleSave}>Save</Button>
                  <Button type="cancel" onClick={handleCancel}>Cancel</Button>
                </ButtonGroup>
              ) : (
                <Button type="primary" onClick={() => handleEdit("user")}>Edit Profile</Button>
              )}
            </ActionButtons>
          </AccountCard>

          {/* Conditional rendering for competition details */}
          {user.role === "student" && (
            <AccountCard>
              <h3>Competition Details</h3>
              <DetailsCard>
                <AccountItem>
                  <Label>Degree:</Label>
                  {editingCard === "competition" ? (
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
                  {editingCard === "competition" ? (
                    <Input
                      type="number"
                      value={newCompDetails.year}
                      onChange={(e) => setNewCompDetails({ ...newCompDetails, year: Number(e.target.value) })}
                    />
                  ) : (
                    <DetailsText>{compDetails.year}</DetailsText>
                  )}
                </AccountItem>
                <AccountItem>
                  <Label>ICPC Eligibility:</Label>
                  {editingCard === "competition" ? (
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
                  {editingCard === "competition" ? (
                    <Select
                      value={newCompDetails.competitionLevel}
                      onChange={(e) => setNewCompDetails({ ...newCompDetails, competitionLevel: e.target.value as "A" | "B" | "AB" })}
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
                  <Label>Boersen Eligibility:</Label>
                  {editingCard === "competition" ? (
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
                  {editingCard === "competition" ? (
                    <Textarea
                      value={newCompDetails.bio}
                      onChange={(e) => setNewCompDetails({ ...newCompDetails, bio: e.target.value })}
                      rows={4} // Adjust the number of rows as needed
                    />
                  ) : (
                    <DetailsText>{compDetails.bio}</DetailsText>
                  )}
                </AccountItem>
                <AccountItem>
                  <Label>Previous Competitions:</Label>
                  {editingCard === "competition" ? (
                    <Input
                      type="text"
                      value={newCompDetails.previousCompetitions}
                      onChange={(e) => setNewCompDetails({ ...newCompDetails, previousCompetitions: e.target.value })}
                    />
                  ) : (
                    <DetailsText>{compDetails.previousCompetitions}</DetailsText>
                  )}
                </AccountItem>
                <AccountItem>
                  <Label>Competition Results:</Label>
                  {editingCard === "competition" ? (
                    <Input
                      type="text"
                      value={newCompDetails.competitionResults}
                      onChange={(e) => setNewCompDetails({ ...newCompDetails, competitionResults: e.target.value })}
                    />
                  ) : (
                    <DetailsText>{compDetails.competitionResults}</DetailsText>
                  )}
                </AccountItem>
              </DetailsCard>
              <ActionButtons>
                {editingCard === "competition" ? (
                  <ButtonGroup>
                    <Button type="confirm" onClick={handleSave}>Save</Button>
                    <Button type="cancel" onClick={handleCancel}>Cancel</Button>
                  </ButtonGroup>
                ) : (
                  <Button type="primary" onClick={() => handleEdit("competition")}>Edit Competition Details</Button>
                )}
              </ActionButtons>
            </AccountCard>
          )}
        </CardContainer>
      </AccountContainer>
    </FlexBackground>
  );
};
