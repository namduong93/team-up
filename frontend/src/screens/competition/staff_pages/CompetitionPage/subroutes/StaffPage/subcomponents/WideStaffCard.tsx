import { FC, useState } from "react";
import styled from "styled-components";
import { StaffCardProps } from "./StaffCardProps";
import {
  StyledUserIcon,
  StyledUserNameContainerDiv,
  StyledUserNameGrid,
  StyledUsernameTextSpan,
  StyledWideInfoContainerDiv,
} from "../../StudentsPage/StudentsPage.styles";
import { CompRoles, StyledStandardContainerDiv } from "./CompRoles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccess } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { StyledStaffAccessLevel } from "../StaffPage.styles";
import { StaffInfoBar } from "../../../components/InfoBar/StaffInfoBar/StaffInfoBar";

export const StyledStandardSpan = styled.span``;

/**
 * A React functional component for displaying a detailed staff member information card.
 *
 * The `WideStaffCard` component provides an expanded view of a staff member's details, including their
 * name, roles, university affiliation, access level, and email. It integrates with the `StaffInfoBar`
 * for viewing and editing additional information in a collapsible sidebar.
 *
 * @param {StaffCardProps} props - React StaffCardProps, which include:
 * 'staffDetails`, which is an object containing staff member details, and
 *  'staffListState' which manages the list of staff members
 * @returns {JSX.Element} - A styled, interactive UI component displaying detailed staff information,
 * with functionality for opening an expandable sidebar to edit or view further details.
 */

export const WideStaffCard: FC<StaffCardProps> = ({
  staffDetails,
  staffListState: [staffList, setStaffList],
  ...props
}) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  return (
    <>
      <StaffInfoBar
        isOpenState={[isInfoBarOpen, setIsInfoBarOpen]}
        staffInfo={staffDetails}
        staffListState={[staffList, setStaffList]}
      />
      <StyledWideInfoContainerDiv
        onDoubleClick={() => setIsInfoBarOpen(true)}
        {...props}
      >
        <StyledUserNameContainerDiv>
          <StyledUserNameGrid>
            <StyledUserIcon />
            <StyledUsernameTextSpan>{staffDetails.name}</StyledUsernameTextSpan>
          </StyledUserNameGrid>
        </StyledUserNameContainerDiv>

        <StyledStandardContainerDiv style={{ overflow: "visible" }}>
          <StyledStandardContainerDiv
            style={{ maxWidth: "90%", overflow: "visible" }}
          >
            <CompRoles roles={staffDetails.roles as CompetitionRole[]} />
          </StyledStandardContainerDiv>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStandardSpan>{staffDetails.universityName}</StyledStandardSpan>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStaffAccessLevel $access={staffDetails.access as StaffAccess}>
            {staffDetails.access}
          </StyledStaffAccessLevel>
        </StyledStandardContainerDiv>

        <StyledStandardContainerDiv>
          <StyledStandardSpan>{staffDetails.email}</StyledStandardSpan>
        </StyledStandardContainerDiv>
      </StyledWideInfoContainerDiv>
    </>
  );
};
