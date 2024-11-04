import React, { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { FlexBackground } from "../../components/general_utility/Background";
import { sendRequest } from "../../utility/request";
import { DashInfo } from "../dashboard/hooks/useDashInfo";
import { backendURL } from "../../../config/backendURLConfig";
import { FaEdit } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface User {
  role: "student" | "staff";
  profilePic: string;
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: "Male" | "Female" | "Other";
  pronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string[];
  accessibilityReqs: string;
};

const Background = styled(FlexBackground)`
  background-color: ${({ theme }) => theme.background};
  width: 100%;
  height: 100%;
  align-items: center;
`;

const AccountContainer = styled.div`
  display: flex;
  margin: 10px;
  width: 100%;
  max-height: 95%;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const CardContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-height: 100%;
`;

const AccountCard = styled.div<{ $isEditing: boolean }>`
  background-color: ${({ theme }) => theme.background};
  border: 1.5px solid ${({ theme, $isEditing: isEditing }) => isEditing ? theme.colours.secondaryLight : theme.colours.sidebarBackground };
  border-radius: 20px;
  flex: 1 0;
  text-align: center;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  overflow-y: auto;
  word-wrap: break-word;
  justify-content: space-evenly;
  padding: 10px;
  max-height: 100%;
  box-sizing: border-box;
`;

const ProfileEditContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px;
  width: 100%;
`;

export const ProfilePic = styled.div<{ $imageUrl: string }>`
  width: 8rem;
  height: 8rem;
  border-radius: 50%;
  background-image: url(${(props) => props.$imageUrl || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`});
  background-size: cover;
  background-position: center;
`;

const DetailsCard = styled.div`
  text-align: left;
  padding: 10px;
  box-sizing: border-box;
`;

const AccountItem = styled.div`
  margin-top: 15px;
  margin-bottom: 15px;
`;

const Label = styled.label<{ $isEditing: boolean }>`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme, $isEditing: isEditing }) => isEditing ? theme.colours.secondaryDark : theme.colours.primaryDark };
`;

const DetailsText = styled.div`
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
`;

const Input = styled.input`
  width: 95%;
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 20px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
`;

const Select = styled.select`
  padding: 10px;
  margin-top: 10px;
  margin-bottom: 10px;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme }) => theme.background};
  box-sizing: border-box;
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

export const EditIconButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  align-self: flex-start;
  box-sizing: border-box;
`;

export const EditIcon = styled(FaEdit)`
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colours.secondaryDark};
  
  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight}
  };
`;

const Button = styled.button<{ type: "confirm" | "cancel" }>`
  padding: 12px 20px;
  border: none;
  box-sizing: border-box;
  border-radius: 10px;
  cursor: pointer;
  font-size: ${({ theme }) => theme.fonts.fontSizes.medium};
  color: ${({ theme }) => theme.fonts.colour};
  background-color: ${({ theme, type }) => {
    switch (type) {
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

interface AccountProps {
  setDashInfo: React.Dispatch<React.SetStateAction<DashInfo>>;
};

export const Account: FC<AccountProps> = ({ setDashInfo }) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const navigate = useNavigate();
  const [user, setUser] = useState<User>({
    role: "student",
    name: "",
    preferredName: "",
    email: "",
    affiliation: "",
    gender: "Other",
    pronouns: "They/Them",
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
    tshirtSize: "",
    allergies: "",
    dietaryReqs: [],
    accessibilityReqs: "",
  });

  const [isEditingUser, setIsEditingUser] = useState(false);
  
  const [newDetails, setNewDetails] = useState<User>({
    ...user,
    profilePic: `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`,
  });

  const handleEditUser = () => {
    setNewDetails(user);
    setIsEditingUser(true);
  };

  const handleSaveUser = async () => {
    setUser(newDetails);
    setIsEditingUser(false);
    await sendRequest.put('/user/profile_info', newDetails);
    setDashInfo({ preferredName: newDetails.preferredName, affiliation: newDetails.affiliation, profilePic: newDetails.profilePic });
  };

  const handleCancelUser = () => {
    setNewDetails(user);
    setIsEditingUser(false);
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
        setIsLoaded(true);
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          setIsLoaded(false);
          navigate('/');
          console.log('Error fetching account details: ', error);
        });
      }
    })();
  }, []);

  return ( isLoaded &&
    <Background>
      <AccountContainer>
        <CardContainer>
          <AccountCard $isEditing={isEditingUser}>
            <ProfileEditContainer>
              <ProfileContainer>
                <ProfilePic $imageUrl={newDetails.profilePic || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` } />
              </ProfileContainer>
              {!isEditingUser && (
                <EditIconButton onClick={handleEditUser}>
                  <EditIcon />
                </EditIconButton>
              )}
            </ProfileEditContainer>
            <DetailsCard>
              <AccountItem>
                {isEditingUser && <Label $isEditing={isEditingUser}>Profile Picture:</Label>}
                {isEditingUser && (
                  <Input type="file" accept="image/*" onChange={handlePhotoUpload} />
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Name:</Label>
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
                <Label $isEditing={isEditingUser}>Preferred Name:</Label>
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
                <Label $isEditing={isEditingUser}>Email:</Label>
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
                <Label $isEditing={isEditingUser}>Affiliation:</Label>
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
                <Label $isEditing={isEditingUser}>Gender:</Label>
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
                <Label $isEditing={isEditingUser}>Preferred Pronouns:</Label>
                {isEditingUser ? (
                  <Select
                    value={newDetails.pronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, pronouns: e.target.value as User["pronouns"] })}
                  >
                    <Option value="She/Her">She/Her</Option>
                    <Option value="He/Him">He/Him</Option>
                    <Option value="They/Them">They/Them</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                ) : (
                  <DetailsText>{user.pronouns}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>T-Shirt Size:</Label>
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
                <Label $isEditing={isEditingUser}>Dietary Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.dietaryReqs.join(', ')}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryReqs: e.target.value.split(',').map((item) => item.trim()) })}
                  />
                ) : (
                  <DetailsText>{user.dietaryReqs}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Allergy Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.allergies}
                    onChange={(e) => setNewDetails({ ...newDetails, allergies: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.allergies}</DetailsText>
                )}
              </AccountItem>
              <AccountItem>
                <Label $isEditing={isEditingUser}>Accessibility Preferences:</Label>
                {isEditingUser ? (
                  <Input
                    type="text"
                    value={newDetails.accessibilityReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityReqs: e.target.value })}
                  />
                ) : (
                  <DetailsText>{user.accessibilityReqs}</DetailsText>
                )}
                            </AccountItem>
            </DetailsCard>
            <ActionButtons>
              {isEditingUser && (
                <ButtonGroup>
                  <Button type="confirm" onClick={handleSaveUser}>
                    Save
                  </Button>
                  <Button type="cancel" onClick={handleCancelUser}>
                    Cancel
                  </Button>
                </ButtonGroup>
              )}
            </ActionButtons>
          </AccountCard>
        </CardContainer>
      </AccountContainer>
    </Background>
  );
};

