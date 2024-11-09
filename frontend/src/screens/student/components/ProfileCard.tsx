import { FC } from "react";
import styled from "styled-components";
import { CopyButton } from "../../../components/general_utility/CopyButton";
import { FaEdit, FaUserTie } from "react-icons/fa";
import { backendURL } from "../../../../config/backendURLConfig";
import { InfoLink } from "../TeamManage";

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

const StudentCard = styled.div<{ $isFirst?: boolean }>`
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

const ContactEdit = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const StudentCardContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  flex: 1;
  margin: 5%;
  padding: 5px;
  box-sizing: border-box;
`;

const ContentContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 5%;
`;

const StudentInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  padding-right: 10px;
  box-sizing: border-box;
`;

const StudentName = styled.p`
  margin: 0;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 1rem;
  color: ${({ theme }) => theme.fonts.colour};
`;

const StudentEmail = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  text-decoration: underline;
  color: ${({ theme }) => theme.colours.primaryDark};
`;

const StudentBio = styled.p`
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

const StudentImage = styled.img`
  width: 20%;
  aspect-ratio: 1;
  max-width: 70px;
  height: auto;
  border-radius: 50%;
  object-fit: cover;
  box-sizing: border-box;
`;

const IconWrapper = styled.div`
  width: 20%;
  max-width: 50px;
  height: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px; // Adjust icon size
  color: ${({ theme }) => theme.fonts.colour};
`;

const PreferredContact = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 0.8rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin-top: 5px;
`;

const PreferredContactHandle = styled.span`
  color: ${({ theme }) => theme.colours.secondaryDark};
`;

const EditIcon = styled(FaEdit)`
  width: 1rem;
  height: 1rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.secondaryDark};

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryLight};
  }
`;

const StudentContact = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const CoachContact = styled.div`
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
    <StudentCard $isFirst={isFirst}>
      <StudentCardContent>
        <ContentContainer>
          {isCoach ? (
            <IconWrapper>
              <FaUserTie />
            </IconWrapper>
          ) : (
            <StudentImage
              src={
                image ||
                `${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`
              } // Use defaultProfile if image is undefined
              alt={`${name}'s profile`}
            />
          )}
          <StudentInfo>
            <ContactEdit>
              <StudentContact>
                <StudentName>{name}</StudentName>
                <StudentEmail>
                  <InfoLink
                    href={email}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {email}
                  </InfoLink>
                  <CopyButton textToCopy={email} />
                </StudentEmail>
                {!isCoach && preferredContact && contactParts.length === 2 ? (
                  <PreferredContact>
                    <span>{contactParts[0]}:</span>
                    <PreferredContactHandle>
                      {contactParts[1]}
                    </PreferredContactHandle>
                    <CopyButton textToCopy={contactParts[1]} />
                  </PreferredContact>
                ) : (
                  // only students should have a preferred contact
                  isCoach && (
                    <CoachContact>No preferred contact available.</CoachContact>
                  )
                )}
              </StudentContact>
              {isFirst && onEdit && <EditIcon onClick={onEdit} />}
            </ContactEdit>
            <StudentBio>{bio}</StudentBio>
          </StudentInfo>
        </ContentContainer>
      </StudentCardContent>
    </StudentCard>
  );
};
