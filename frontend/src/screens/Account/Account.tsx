
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
  dietaryReqs: string;
  accessibilityReqs: string;
};

import React, { FC, useEffect, useState } from "react";
import { DashInfo } from "../dashboard/hooks/useDashInfo";
import { useNavigate } from "react-router-dom";
import { backendURL } from "../../../config/backendURLConfig";
import { sendRequest } from "../../utility/request";
import { StyledAccountCard, StyledAccountContainer, StyledAccountItem, StyledActionButtons, StyledBackground, StyledButton, StyledButtonGroup, StyledCardContainer, StyledDetailsCard, StyledDetailsText, StyledEditIcon, StyledEditIconButton, StyledInput, StyledLabel, StyledOption, StyledProfileContainer, StyledProfileEditContainer, StyledProfilePic, StyledSelect } from "./Account.styles";

interface AccountProps {
  setDashInfo: React.Dispatch<React.SetStateAction<DashInfo>>;
};

/**
 * A React component to view and edit the current users' account information.
 * 
 * @param {AccountProps} props - React AccountProps specified above
 * @returns {JSX.Element} - Web page that requests from the backend the users information which 
 * it then displays and allows users to edit before saving and sending the edit request to the
 * backend to save it
 */
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
    dietaryReqs: "",
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
    <StyledBackground>
      <StyledAccountContainer>
        <StyledCardContainer>
          <StyledAccountCard $isEditing={isEditingUser}>
            <StyledProfileEditContainer>
              <StyledProfileContainer>
                <StyledProfilePic $imageUrl={newDetails.profilePic || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` } />
              </StyledProfileContainer>
              {!isEditingUser && (
                <StyledEditIconButton onClick={handleEditUser}>
                  <StyledEditIcon />
                </StyledEditIconButton>
              )}
            </StyledProfileEditContainer>
            <StyledDetailsCard>
              <StyledAccountItem>
                {isEditingUser && <StyledLabel $isEditing={isEditingUser}>Profile Picture:</StyledLabel>}
                {isEditingUser && (
                  <StyledInput type="file" accept="image/*" onChange={handlePhotoUpload} />
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.name}
                    onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.name}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Preferred Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.preferredName}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredName: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.preferredName}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Email:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="email"
                    value={newDetails.email}
                    onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.email}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Affiliation:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.affiliation}
                    onChange={(e) => setNewDetails({ ...newDetails, affiliation: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.affiliation}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Gender:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.gender}
                    onChange={(e) => setNewDetails({ ...newDetails, gender: e.target.value as User["gender"] })}
                  >
                    <StyledOption value="Male">Male</StyledOption>
                    <StyledOption value="Female">Female</StyledOption>
                    <StyledOption value="Other">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText>{user.gender}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Preferred Pronouns:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.pronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, pronouns: e.target.value as User["pronouns"] })}
                  >
                    <StyledOption value="She/Her">She/Her</StyledOption>
                    <StyledOption value="He/Him">He/Him</StyledOption>
                    <StyledOption value="They/Them">They/Them</StyledOption>
                    <StyledOption value="Other">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText>{user.pronouns}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>T-Shirt Size:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.tshirtSize}
                    onChange={(e) => setNewDetails({ ...newDetails, tshirtSize: e.target.value })}
                  >
                    <StyledOption value="Male L">Male L</StyledOption>
                    <StyledOption value="Male M">Male M</StyledOption>
                    <StyledOption value="Male S">Male S</StyledOption>
                    <StyledOption value="Female L">Female L</StyledOption>
                    <StyledOption value="Female M">Female M</StyledOption>
                    <StyledOption value="Female S">Female S</StyledOption>
                    <StyledOption value="Other">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText>{user.tshirtSize}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Dietary Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.dietaryReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryReqs: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.dietaryReqs}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Allergy Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.allergies}
                    onChange={(e) => setNewDetails({ ...newDetails, allergies: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.allergies}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem>
                <StyledLabel $isEditing={isEditingUser}>Accessibility Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.accessibilityReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityReqs: e.target.value })}
                  />
                ) : (
                  <StyledDetailsText>{user.accessibilityReqs}</StyledDetailsText>
                )}
                            </StyledAccountItem>
            </StyledDetailsCard>
            <StyledActionButtons>
              {isEditingUser && (
                <StyledButtonGroup>
                  <StyledButton type="confirm" onClick={handleSaveUser}>
                    Save
                  </StyledButton>
                  <StyledButton type="cancel" onClick={handleCancelUser}>
                    Cancel
                  </StyledButton>
                </StyledButtonGroup>
              )}
            </StyledActionButtons>
          </StyledAccountCard>
        </StyledCardContainer>
      </StyledAccountContainer>
    </StyledBackground>
  );
};

