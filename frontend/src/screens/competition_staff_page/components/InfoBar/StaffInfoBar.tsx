import { FC, useEffect, useState } from "react";
import { StaffAccess, StaffInfo } from "../../../../../shared_types/Competition/staff/StaffInfo";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { InfoBarField, LabelSpan } from "./TeamInfoBar";
import { CompetitionInfoContainerDiv } from "./StudentsInfoBar";
import { EditableTextArea } from "./components/TeamStudentInfoCard";
import { EditIcon, EditIconButton } from "../../../account/Account";
import { StaffRoles } from "../../staff_page/components/StaffRole";
import { Input } from "../../../../components/general_utility/RegisterPopUp";
import styled, { useTheme } from "styled-components";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";
import { StaffAccessLevel } from "../../staff_page/StaffDisplay";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";


interface StaffInfoProps extends InfoBarProps {
  staffInfo: StaffInfo;
  staffListState: [Array<StaffInfo>, React.Dispatch<React.SetStateAction<Array<StaffInfo>>>];
}

const CustomCheckbox = styled.input<{ $role: CompetitionRole }>`
  appearance: none;
  -webkit-appearance: none;
  outline: none;

  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 5px;


  &:checked {
    background-color: ${({ theme, $role }) => (
      $role === CompetitionRole.Admin ?
      theme.roles.adminText :
      $role === CompetitionRole.Coach ?
      theme.roles.coachText :
      theme.roles.siteCoordinatorText
    )};
  }
`;

const CustomRadio = styled.input<{ $access: StaffAccess }>`
  appearance: none;
  -webkit-appearance: none;
  outline: none;

  cursor: pointer;
  width: 16px;
  height: 16px;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  border-radius: 50%;

  &:checked {
    background-color: ${({ theme, $access }) => (
      $access === StaffAccess.Accepted ?
      theme.access.acceptedText :
      $access === StaffAccess.Pending ?
      theme.access.pendingText :
      theme.access.rejectedText
   )};
  }
`;

const RoleLabelDiv = styled.div<{ $role: CompetitionRole }>`
  width: 60%;
  border: 1px solid ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};
  border-radius: 5px;

  box-sizing: border-box;
  padding-left: 2px;

  background-color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminBackground :
    $role === CompetitionRole.Coach ?
    theme.roles.coachBackground :
    theme.roles.siteCoordinatorBackground
  )};

  color: ${({ theme, $role }) => (
    $role === CompetitionRole.Admin ?
    theme.roles.adminText :
    $role === CompetitionRole.Coach ?
    theme.roles.coachText :
    theme.roles.siteCoordinatorText
  )};
`;

const AccessLabelDiv = styled.div<{ $access: StaffAccess }>`
  width: 60%;
  border: 1px solid ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
  border-radius: 5px;

  box-sizing: border-box;
  padding-left: 2px;

  background-color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedBackground :
    $access === StaffAccess.Pending ?
    theme.access.pendingBackground :
    theme.access.rejectedBackground
  )};

  color: ${({ theme, $access }) => (
    $access === StaffAccess.Accepted ?
    theme.access.acceptedText :
    $access === StaffAccess.Pending ?
    theme.access.pendingText :
    theme.access.rejectedText
  )};
`;

export const StaffInfoBar: FC<StaffInfoProps> = ({ 
  staffInfo,
  staffListState: [staffList, setStaffList],
  isOpenState: [isOpen, setIsOpen]
 }) => {
  const theme = useTheme();

  const [staffData, setStaffData] = useState(staffInfo);

  const [isEditing, setIsEditing] = useState(false);

  const [isEdited, setIsEdited] = useState(false);

  useEffect(() => {
    if (staffData.access === staffInfo.access
      && staffData.bio === staffInfo.bio
      && staffData.roles.every((staffRole) => staffInfo.roles.includes(staffRole))
      && staffInfo.roles.every((staffRole) => staffData.roles.includes(staffRole))
    ) {
      setIsEdited(false);
      return;
    }
    setIsEdited(true);
  }, [staffData]);

  const handleToggleRole = (role: CompetitionRole) => {
    const roleIndex = staffData.roles.indexOf(role);
    if (roleIndex < 0) {
      setStaffData((p) => ({ ...p, roles: [ ...staffData.roles, role ] }));
      return;
    }

    setStaffData((p) => ({ ...p, roles: [
      ...staffData.roles.slice(0, roleIndex),
      ...staffData.roles.slice(roleIndex + 1)
    ] }));

  }

  const handleSaveEdit = () => {
    // send backend request here

    const currentStaffIndex = staffList.findIndex((staff) => staff.userId === staffData.userId);
    if (currentStaffIndex < 0) {
      return;
    }
    setStaffList([
      ...staffList.slice(0, currentStaffIndex),
      staffData,
      ...staffList.slice(currentStaffIndex + 1)
    ]);
    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]}>

      <InfoBarField>
        <LabelSpan>User Id:</LabelSpan>
        <span>{staffData.userId}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>University Name:</LabelSpan>
        <span>{staffData.universityName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{staffData.name}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{staffData.email}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Gender:</LabelSpan>
        <span>{staffData.sex}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Pronouns:</LabelSpan>
        <span>{staffData.pronouns}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Shirt Size:</LabelSpan>
        <span>{staffData.tshirtSize}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Allergies:</LabelSpan>
        <span>{staffData.allergies}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Dietary Requirements:</LabelSpan>
        <span>{staffData.dietaryReqs}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan style={{ maxWidth: '115px' }}>Accessibility Requirements:</LabelSpan>
        <span>{staffData.accessibilityReqs}</span>
      </InfoBarField>

      <CompetitionInfoContainerDiv>
        <EditIconButton
          style={{ position: 'absolute', right: 0, top: 0 }}
          onClick={() => setIsEditing((p) => !p)}
        >
          <EditIcon />
        </EditIconButton>


        <InfoBarField>
          <LabelSpan>Bio:</LabelSpan>
          {isEditing ? <EditableTextArea
            onChange={(e) => setStaffData((p) => ({ ...p, bio: e.target.value }))}
            value={staffData.bio}
          />
          : <span>{staffData.bio}</span>}
        </InfoBarField>

        <InfoBarField>
          <LabelSpan>Roles:</LabelSpan>
          {isEditing ? <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <InfoBarField>
              <CustomCheckbox
                type='checkbox'
                $role={CompetitionRole.Admin}
                checked={staffData.roles.includes(CompetitionRole.Admin)}
                onChange={() => handleToggleRole(CompetitionRole.Admin)}
              />
              <RoleLabelDiv $role={CompetitionRole.Admin}>Admin</RoleLabelDiv>
            </InfoBarField>
            <InfoBarField>
              <CustomCheckbox
                type='checkbox'
                $role={CompetitionRole.Coach}
                checked={staffData.roles.includes(CompetitionRole.Coach)}
                onChange={() => handleToggleRole(CompetitionRole.Coach)}
              />
              <RoleLabelDiv $role={CompetitionRole.Coach}>Coach</RoleLabelDiv>
            </InfoBarField>
            <InfoBarField>
              <CustomCheckbox
                type='checkbox'
                $role={CompetitionRole.SiteCoordinator}
                checked={staffData.roles.includes(CompetitionRole.SiteCoordinator)}
                onChange={() => handleToggleRole(CompetitionRole.SiteCoordinator)}
              />
              <RoleLabelDiv $role={CompetitionRole.SiteCoordinator}>Site-Coordinator</RoleLabelDiv>
            </InfoBarField>
          </div> :
          <StaffRoles roles={staffData.roles} />}
        </InfoBarField>


        <InfoBarField>
          <LabelSpan>Access:</LabelSpan>
          {isEditing ? <div style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
            <InfoBarField>
              <CustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Accepted}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Accepted }))}
              />
              <AccessLabelDiv $access={StaffAccess.Accepted}>Accepted</AccessLabelDiv>
            </InfoBarField>
            <InfoBarField>
              <CustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Pending}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Pending }))}
              />
              <AccessLabelDiv $access={StaffAccess.Pending}>Pending</AccessLabelDiv>
            </InfoBarField>
            <InfoBarField>
              <CustomRadio
                type='radio'
                name='staff-access-edit-radio'
                $access={staffData.access}
                checked={staffData.access === StaffAccess.Rejected}
                onChange={() => setStaffData((p) => ({ ...p, access: StaffAccess.Rejected }))}
              />
              <AccessLabelDiv $access={StaffAccess.Rejected}>Rejected</AccessLabelDiv>
            </InfoBarField>
          </div> :
          <StaffAccessLevel $access={staffData.access}>{staffData.access}</StaffAccessLevel>}
        </InfoBarField>

        {isEdited && 
      <div style={{ display: 'flex' }}>
        <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
          <TransparentResponsiveButton
            actionType="error"
            label="Reset"
            isOpen={false}
            onClick={() => setStaffData(staffInfo)}
            icon={<RxReset />}
            style={{
              backgroundColor: theme.colours.cancel,
          }} />
        </div>
        
        <div style={{ maxWidth: '150px', width: '100%', height: '30px' }}>
          <TransparentResponsiveButton
            actionType="confirm"
            label="Save Changes"
            isOpen={false}
            onClick={handleSaveEdit}
            icon={<FaSave />}
            style={{
              backgroundColor: theme.colours.confirm,
          }} />
        </div>
      </div>}


      </CompetitionInfoContainerDiv>


    </InfoBar>
  )
}