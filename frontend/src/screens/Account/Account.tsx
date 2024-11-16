
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

  return isLoaded &&
    <StyledBackground data-test-id="account--StyledBackground-0">
      <StyledAccountContainer data-test-id="account--StyledAccountContainer-0">
        <StyledCardContainer data-test-id="account--StyledCardContainer-0">
          <StyledAccountCard $isEditing={isEditingUser} data-test-id="account--StyledAccountCard-0">
            <StyledProfileEditContainer data-test-id="account--StyledProfileEditContainer-0">
              <StyledProfileContainer data-test-id="account--StyledProfileContainer-0">
                <StyledProfilePic
                  $imageUrl={newDetails.profilePic || `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg` }
                  data-test-id="account--StyledProfilePic-0" />
              </StyledProfileContainer>
              {!isEditingUser && (
                <StyledEditIconButton onClick={handleEditUser} data-test-id="account--StyledEditIconButton-0">
                  <StyledEditIcon data-test-id="account--StyledEditIcon-0" />
                </StyledEditIconButton>
              )}
            </StyledProfileEditContainer>
            <StyledDetailsCard data-test-id="account--StyledDetailsCard-0">
              <StyledAccountItem data-test-id="account--StyledAccountItem-0">
                {isEditingUser && <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-0">Profile Picture:</StyledLabel>}
                {isEditingUser && (
                  <StyledInput
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    data-test-id="account--StyledInput-0" />
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-1">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-1">Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.name}
                    onChange={(e) => setNewDetails({ ...newDetails, name: e.target.value })}
                    data-test-id="account--StyledInput-1" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-0">{user.name}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-2">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-2">Preferred Name:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.preferredName}
                    onChange={(e) => setNewDetails({ ...newDetails, preferredName: e.target.value })}
                    data-test-id="account--StyledInput-2" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-1">{user.preferredName}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-3">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-3">Email:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="email"
                    value={newDetails.email}
                    onChange={(e) => setNewDetails({ ...newDetails, email: e.target.value })}
                    data-test-id="account--StyledInput-3" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-2">{user.email}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-4">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-4">Affiliation:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.affiliation}
                    onChange={(e) => setNewDetails({ ...newDetails, affiliation: e.target.value })}
                    data-test-id="account--StyledInput-4" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-3">{user.affiliation}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-5">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-5">Gender:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.gender}
                    onChange={(e) => setNewDetails({ ...newDetails, gender: e.target.value as User["gender"] })}
                    data-test-id="account--StyledSelect-0">
                    <StyledOption value="Male" data-test-id="account--StyledOption-0">Male</StyledOption>
                    <StyledOption value="Female" data-test-id="account--StyledOption-1">Female</StyledOption>
                    <StyledOption value="Other" data-test-id="account--StyledOption-2">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-4">{user.gender}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-6">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-6">Preferred Pronouns:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.pronouns}
                    onChange={(e) => setNewDetails({ ...newDetails, pronouns: e.target.value as User["pronouns"] })}
                    data-test-id="account--StyledSelect-1">
                    <StyledOption value="She/Her" data-test-id="account--StyledOption-3">She/Her</StyledOption>
                    <StyledOption value="He/Him" data-test-id="account--StyledOption-4">He/Him</StyledOption>
                    <StyledOption value="They/Them" data-test-id="account--StyledOption-5">They/Them</StyledOption>
                    <StyledOption value="Other" data-test-id="account--StyledOption-6">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-5">{user.pronouns}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-7">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-7">T-Shirt Size:</StyledLabel>
                {isEditingUser ? (
                  <StyledSelect
                    value={newDetails.tshirtSize}
                    onChange={(e) => setNewDetails({ ...newDetails, tshirtSize: e.target.value })}
                    data-test-id="account--StyledSelect-2">
                    <StyledOption value="Male L" data-test-id="account--StyledOption-7">Male L</StyledOption>
                    <StyledOption value="Male M" data-test-id="account--StyledOption-8">Male M</StyledOption>
                    <StyledOption value="Male S" data-test-id="account--StyledOption-9">Male S</StyledOption>
                    <StyledOption value="Female L" data-test-id="account--StyledOption-10">Female L</StyledOption>
                    <StyledOption value="Female M" data-test-id="account--StyledOption-11">Female M</StyledOption>
                    <StyledOption value="Female S" data-test-id="account--StyledOption-12">Female S</StyledOption>
                    <StyledOption value="Other" data-test-id="account--StyledOption-13">Other</StyledOption>
                  </StyledSelect>
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-6">{user.tshirtSize}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-8">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-8">Dietary Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.dietaryReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, dietaryReqs: e.target.value })}
                    data-test-id="account--StyledInput-5" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-7">{user.dietaryReqs}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-9">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-9">Allergy Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.allergies}
                    onChange={(e) => setNewDetails({ ...newDetails, allergies: e.target.value })}
                    data-test-id="account--StyledInput-6" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-8">{user.allergies}</StyledDetailsText>
                )}
              </StyledAccountItem>
              <StyledAccountItem data-test-id="account--StyledAccountItem-10">
                <StyledLabel $isEditing={isEditingUser} data-test-id="account--StyledLabel-10">Accessibility Preferences:</StyledLabel>
                {isEditingUser ? (
                  <StyledInput
                    type="text"
                    value={newDetails.accessibilityReqs}
                    onChange={(e) => setNewDetails({ ...newDetails, accessibilityReqs: e.target.value })}
                    data-test-id="account--StyledInput-7" />
                ) : (
                  <StyledDetailsText data-test-id="account--StyledDetailsText-9">{user.accessibilityReqs}</StyledDetailsText>
                )}
              </StyledAccountItem>
            </StyledDetailsCard>
            <StyledActionButtons data-test-id="account--StyledActionButtons-0">
              {isEditingUser && (
                <StyledButtonGroup data-test-id="account--StyledButtonGroup-0">
                  <StyledButton
                    type="confirm"
                    onClick={handleSaveUser}
                    data-test-id="account--StyledButton-0">Save</StyledButton>
                  <StyledButton
                    type="cancel"
                    onClick={handleCancelUser}
                    data-test-id="account--StyledButton-1">Cancel</StyledButton>
                </StyledButtonGroup>
              )}
            </StyledActionButtons>
          </StyledAccountCard>
        </StyledCardContainer>
      </StyledAccountContainer>
    </StyledBackground>;
};

