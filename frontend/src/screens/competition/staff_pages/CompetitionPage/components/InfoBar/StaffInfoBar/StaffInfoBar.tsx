import { FC, useEffect, useState } from "react";
import { RxReset } from "react-icons/rx";
import { FaSave } from "react-icons/fa";
import { useParams } from "react-router-dom";
import { InfoBar, InfoBarProps } from "../InfoBar";
import { StaffAccess, StaffInfo } from "../../../../../../../../shared_types/Competition/staff/StaffInfo";
import { useTheme } from "styled-components";
import { sendRequest } from "../../../../../../../utility/request";
import { EditIcon, EditIconButton, ProfilePic } from "../../../../../../Account/Account.styles";
import { backendURL } from "../../../../../../../../config/backendURLConfig";
import { EditableTextArea } from "../components/TeamStudentInfoCard";
import { AccessLabelDiv, CustomCheckbox, CustomRadio, RoleLabelDiv } from "./StaffInfoBar.styles";
import { CompetitionRole } from "../../../../../../../../shared_types/Competition/CompetitionRole";
import { StaffRoles } from "../../../subroutes/StaffPage/subcomponents/StaffRole";
import { TransparentResponsiveButton } from "../../../../../../../components/responsive_fields/ResponsiveButton";
import { StaffAccessLevel } from "../../../subroutes/StaffPage/StaffPage.styles";
import { InfoBarField, LabelSpan, NoWrapLabelSpan, VerticalInfoBarField } from "../TeamInfoBar/TeamInfoBar.styles";
import { CompetitionInfoContainerDiv } from "../StudentsInfoBar/StudentsInfoBar";


interface StaffInfoProps extends InfoBarProps {
  staffInfo: StaffInfo;
  staffListState: [Array<StaffInfo>, React.Dispatch<React.SetStateAction<Array<StaffInfo>>>];
}

export const StaffInfoBar: FC<StaffInfoProps> = ({ 
  staffInfo,
  staffListState: [staffList, setStaffList],
  isOpenState: [isOpen, setIsOpen]
 }) => {
  const theme = useTheme();
  const { compId } = useParams();

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

  const handleSaveEdit = async () => {
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
    await sendRequest.post('/competition/staff/update', { staffList: [staffData], compId });
    setIsEdited(false);
  }

  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]}>

      <InfoBarField>
        <LabelSpan>User Id:</LabelSpan>
        <span>{staffData.userId}</span>
      </InfoBarField>

      <ProfilePic
        style={{ marginBottom: '15px' }}
        $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`}
      />

      <VerticalInfoBarField>
        <LabelSpan>University Name:</LabelSpan>
        <span>{staffData.universityName}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{staffData.name}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{staffData.email}</span>
      </VerticalInfoBarField>

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

      <VerticalInfoBarField>
        <LabelSpan>Allergies:</LabelSpan>
        <span>{staffData.allergies}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <LabelSpan>Dietary Requirements:</LabelSpan>
        <span>{staffData.dietaryReqs}</span>
      </VerticalInfoBarField>

      <VerticalInfoBarField>
        <NoWrapLabelSpan>Accessibility Requirements:</NoWrapLabelSpan>
        <span>{staffData.accessibilityReqs}</span>
      </VerticalInfoBarField>

      <CompetitionInfoContainerDiv>
        <EditIconButton
          style={{ position: 'absolute', right: 0, top: 0 }}
          onClick={() => setIsEditing((p) => !p)}
        >
          <EditIcon />
        </EditIconButton>


        <VerticalInfoBarField>
          <LabelSpan>Bio:</LabelSpan>
          {isEditing ? <EditableTextArea
            onChange={(e) => setStaffData((p) => ({ ...p, bio: e.target.value }))}
            value={staffData.bio}
          />
          : <span>{staffData.bio}</span>}
        </VerticalInfoBarField>

        <VerticalInfoBarField>
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
          <InfoBarField style={{ maxWidth: '160px' }}>
            <StaffRoles roles={staffData.roles} />
          </InfoBarField>}
        </VerticalInfoBarField>


        <VerticalInfoBarField>
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
        </VerticalInfoBarField>

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