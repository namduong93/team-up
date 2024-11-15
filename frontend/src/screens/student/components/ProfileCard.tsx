import { FC } from "react";
import styled from "styled-components";
import { CopyButton } from "../../../components/general_utility/CopyButton";
import { FaEdit, FaUserTie } from "react-icons/fa";
import { backendURL } from "../../../../config/backendURLConfig";
import { StyledInfoButton } from "../subroutes/TeamManage";

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

const StyledStudentCard = styled.div<{ $isFirst?: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  border: 2px solid
    ${({ theme, $isFirst }) =>
      $isFirst ? theme.colours.secondaryLight : theme.colours.primaryLight};
  border-radius: 12px;
  background-color: ${({ theme }) => theme.background};
  width: 100%;
  margin: 10px 0;
  position: relative;
  overflow-y: hidden;
  overflow-x: auto;
  height: fit-content;
  box-sizing: border-box;
`;

const StyledContactEdit = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const StyledStudentCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin: 5%;
  padding: 5px;
  box-sizing: border-box;
`;

const StyledContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5%;
`;

const StyledStudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding-right: 10px;
  box-sizing: border-box;
`;

const StyledStudentName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledStudentEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const StyledStudentBio = styled.p`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.fonts.descriptor};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  padding: 10px;
  overflow: hidden;
  white-space: normal;
  max-width: 100%;
  text-overflow: ellipsis;
  flex-grow: 1;
  box-sizing: border-box;
`;

const StyledStudentImage = styled.img`
  width: 20%;
  aspect-ratio: 1;
  max-width: 70px;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  box-sizing: border-box;
`;

const StyledIconWrapper = styled.div`
  width: 20%;
  max-width: 50px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px; // Adjust icon size
  color: ${({ theme }) => theme.fonts.colour};
`;

const StyledPreferredContact = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin-top: 5px;
`;

const StyledPreferredContactHandle = styled.span`
  color: ${({ theme }) => theme.colours.secondaryDark};
`;

const StyledEditIcon = styled(FaEdit)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.secondaryDark};

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight};
  }
`;

const StyledStudentContact = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const StyledCoachContact = styled.div`
  color: ${({ theme }) => theme.colours.sidebarLine};
`;

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
              } // Use defaultProfile if image is undefined
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
                    <StyledCoachContact>No preferred contact available.</StyledCoachContact>
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
