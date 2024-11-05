import { FC } from "react";
import { InfoBar, InfoBarProps } from "./InfoBar";
import { StudentStatus } from "../../students_page/StudentDisplay";
import { ProfilePic } from "../../../account/Account";
import { backendURL } from "../../../../../config/backendURLConfig";
import { InfoBarField, LabelSpan } from "./TeamInfoBar";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";

interface StudentsInfoProps extends InfoBarProps {
  studentInfo: StudentInfo;
}

export const StudentsInfoBar: FC<StudentsInfoProps> = (
  { studentInfo, isOpenState: [isOpen, setIsOpen], children, ...props }) => {


  return (
    <InfoBar isOpenState={[isOpen, setIsOpen]} {...props}>
      <ProfilePic $imageUrl={`${backendURL.HOST}:${backendURL.PORT}/images/default_profile.jpg`} />

      <InfoBarField style={{ left: 0, top: 0, position: 'absolute' }}>
        <LabelSpan>User Id:</LabelSpan>
        <span>{studentInfo.userId}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Name:</LabelSpan>
        <span>{studentInfo.name}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Sex:</LabelSpan>
        <span>{studentInfo.sex}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Email:</LabelSpan>
        <span>{studentInfo.email}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Identifier:</LabelSpan>
        <span>{studentInfo.studentId}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Status:</LabelSpan>
        <StudentStatus style={{ height: '25px' }}
          isMatched={studentInfo.status === 'Matched'}
        >
          {studentInfo.status}
        </StudentStatus>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Team:</LabelSpan>
        <span>{studentInfo.teamName}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Level:</LabelSpan>
        <span>{studentInfo.level}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Shirt Size:</LabelSpan>
        <span>{studentInfo.tshirtSize}</span>
      </InfoBarField>

      <InfoBarField>
        <LabelSpan>Site:</LabelSpan>
        <span>{studentInfo.siteName}</span>
      </InfoBarField>




    </InfoBar>
  );
}
