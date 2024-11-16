import { FC } from "react";
import { CopyButton } from "../../../../components/general_utility/CopyButton";
import { FaUserTie } from "react-icons/fa";
import { backendURL } from "../../../../../config/backendURLConfig";
import { StyledInfoButton } from "../../subroutes/TeamManage";
import { StyledCoachContact, StyledContactEdit, StyledContentContainer, StyledEditIcon, StyledIconWrapper, StyledPreferredContact, StyledPreferredContactHandle, StyledStudentBio, StyledStudentCard, StyledStudentCardContent, StyledStudentContact, StyledStudentEmail, StyledStudentImage, StyledStudentInfo, StyledStudentName } from "./ProfileCard.styles";

interface ProfileCardProps {
  name: string;
  email: string;
  bio: string;
  image?: string;
  preferredContact?: string;
  isFirst?: boolean;
  onEdit?: () => void;
  isCoach?: boolean;
}


export const ProfileCard: FC<ProfileCardProps> = ({
  name,
  email,
  bio,
  image,
  preferredContact,
  isFirst,
  onEdit,
  isCoach,
}) => {
  const contactParts = preferredContact ? preferredContact.split(":") : [];

  return (
    <StyledStudentCard $isFirst={isFirst} data-test-id="profile-card--StyledStudentCard-0">
      <StyledStudentCardContent data-test-id="profile-card--StyledStudentCardContent-0">
        <StyledContentContainer data-test-id="profile-card--StyledContentContainer-0">
          {isCoach ? (
            <StyledIconWrapper data-test-id="profile-card--StyledIconWrapper-0">
              <FaUserTie />
            </StyledIconWrapper>
          ) : (
            <StyledStudentImage
              // Use defaultProfile if image is undefined
              src={
                image ||
                `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
              }
              alt={`${name}'s profile`}
              data-test-id="profile-card--StyledStudentImage-0" />
          )}
          <StyledStudentInfo data-test-id="profile-card--StyledStudentInfo-0">
            <StyledContactEdit data-test-id="profile-card--StyledContactEdit-0">
              <StyledStudentContact data-test-id="profile-card--StyledStudentContact-0">
                <StyledStudentName data-test-id="profile-card--StyledStudentName-0">{name}</StyledStudentName>
                <StyledStudentEmail data-test-id="profile-card--StyledStudentEmail-0">
                  <StyledInfoButton
                    onClick={() => navigator.clipboard.writeText(email)}
                    data-test-id="profile-card--StyledInfoButton-0">
                    {email}
                  </StyledInfoButton>
                  <CopyButton textToCopy={email} />
                </StyledStudentEmail>
                {!isCoach && preferredContact && contactParts.length === 2 ? (
                  <StyledPreferredContact data-test-id="profile-card--StyledPreferredContact-0">
                    <span>{contactParts[0]}:</span>
                    <StyledPreferredContactHandle data-test-id="profile-card--StyledPreferredContactHandle-0">
                      {contactParts[1]}
                    </StyledPreferredContactHandle>
                    <CopyButton textToCopy={contactParts[1]} />
                  </StyledPreferredContact>
                ) : (
                  // only students should have a preferred contact
                  isCoach && (
                    <StyledCoachContact data-test-id="profile-card--StyledCoachContact-0">No preferred contact available.</StyledCoachContact>
                  )
                )}
              </StyledStudentContact>
              {isFirst && onEdit && <StyledEditIcon onClick={onEdit} data-test-id="profile-card--StyledEditIcon-0" />}
            </StyledContactEdit>
            <StyledStudentBio data-test-id="profile-card--StyledStudentBio-0">{bio}</StyledStudentBio>
          </StyledStudentInfo>
        </StyledContentContainer>
      </StyledStudentCardContent>
    </StyledStudentCard>
  );
};
