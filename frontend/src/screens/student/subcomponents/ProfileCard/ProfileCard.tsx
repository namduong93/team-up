import { FC } from "react";
import { CopyButton } from "../../../../components/general_utility/CopyButton";
import { FaUserTie } from "react-icons/fa";
import { backendURL } from "../../../../../config/backendURLConfig";
import { StyledInfoButton } from "../../subroutes/TeamManage";
import {
  StyledCoachContact,
  StyledContactEdit,
  StyledContentContainer,
  StyledEditIcon,
  StyledIconWrapper,
  StyledPreferredContact,
  StyledPreferredContactHandle,
  StyledStudentBio,
  StyledStudentCard,
  StyledStudentCardContent,
  StyledStudentContact,
  StyledStudentEmail,
  StyledStudentImage,
  StyledStudentInfo,
  StyledStudentName,
} from "./ProfileCard.styles";

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

/**
 * The ProfileCard component is used to display the profile information of a student or coach,
 * including their name, email, bio, profile image, and preferred contact method.
 *
 * This component conditionally renders different content based on whether the user is a coach or a student.
 * It also supports copying the email and preferred contact details to the clipboard,
 * and allows for editing the profile if the `onEdit` callback is provided and `isFirst` is true.
 *
 * @param {ProfileCardProps} props - React ProfileCardProps as specified above.
 * @returns {JSX.Element} - The rendered ProfileCard component.
 */
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
    <StyledStudentCard $isFirst={isFirst}>
      <StyledStudentCardContent>
        <StyledContentContainer>
          {isCoach ? (
            <StyledIconWrapper>
              <FaUserTie />
            </StyledIconWrapper>
          ) : (
            <StyledStudentImage
              src={
                image ||
                `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
              }
              alt={`${name}'s profile`}
            />
          )}
          <StyledStudentInfo>
            <StyledContactEdit>
              <StyledStudentContact>
                <StyledStudentName>{name}</StyledStudentName>
                <StyledStudentEmail>
                  <StyledInfoButton
                    onClick={() => navigator.clipboard.writeText(email)}
                  >
                    {email}
                  </StyledInfoButton>
                  <CopyButton textToCopy={email} />
                </StyledStudentEmail>
                {!isCoach && preferredContact && contactParts.length === 2 ? (
                  <StyledPreferredContact>
                    <span>{contactParts[0]}:</span>
                    <StyledPreferredContactHandle>
                      {contactParts[1]}
                    </StyledPreferredContactHandle>
                    <CopyButton textToCopy={contactParts[1]} />
                  </StyledPreferredContact>
                ) : (
                  // only students should have a preferred contact
                  isCoach && (
                    <StyledCoachContact>
                      No preferred contact available.
                    </StyledCoachContact>
                  )
                )}
              </StyledStudentContact>
              {isFirst && onEdit && <StyledEditIcon onClick={onEdit} />}
            </StyledContactEdit>
            <StyledStudentBio>{bio}</StyledStudentBio>
          </StyledStudentInfo>
        </StyledContentContainer>
      </StyledStudentCardContent>
    </StyledStudentCard>
  );
};
