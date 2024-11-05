import React, { FC, ReactNode, useState } from "react"
import styled from "styled-components"
import { NarrowStatusDiv } from "../../staff_page/StaffDisplay";
import { StudentStatus } from "../StudentDisplay";
import { StudentsInfoBar } from "../../components/InfoBar/StudentsInfoBar";
import { StudentInfo } from "../../../../../shared_types/Competition/student/StudentInfo";
import { CompetitionLevel } from "../../../../../shared_types/Competition/CompetitionLevel";

export const StudentInfoContainerDiv = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: auto;
  flex-wrap: wrap;
  /* background-color: lightgrey; */
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  /* border-radius: 10px; */
  box-sizing: border-box;
  font-size: 13px;
`;

const ContainerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  /* border-radius: 10px; */
  box-sizing: border-box;
  border: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  min-height: 60px;
  height: auto;
  row-gap: 3px;
`

const FieldTitle = styled.div`
  flex: 1;
  width: 100%;
  /* border-radius: 10px 10px 0 0; */
  text-align: center;
  align-content: end;
  font-weight: bold;
  border-bottom: 1px solid ${({ theme }) => theme.colours.sidebarLine};
  background-color: #D9D9D9;
  box-sizing: border-box;
`;

const FieldValue = styled.div`
  width: 100%;
  flex: 2 1 auto;
  flex-direction: column;
  height: fit-content;
  text-align: center;
  text-overflow: ellipsis;
  overflow: visible;
  /* white-space: nowrap; */
  max-width: 170px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
`;

interface FieldContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: ReactNode;
}

export const Field: FC<FieldContainerProps> = ({ label, value, style, ...props }) => {
  return (
    <ContainerDiv style={{ ...style }} {...props}>
      <FieldTitle>{label}</FieldTitle>
      <FieldValue>{value}</FieldValue>
    </ContainerDiv>
  )
}

export interface StudentCardProps extends React.HTMLAttributes<HTMLDivElement> {
  studentInfo?: StudentInfo;
}

export const StudentInfoCard: FC<StudentCardProps> = ({ style, studentInfo, ...props }) => {
  const [isInfoBarOpen, setIsInfoBarOpen] = useState(false);

  const { name, sex, email, status, studentId, teamName, level, tshirtSize, siteName }
    = studentInfo ?? {};
  return (<>
    {studentInfo && <StudentsInfoBar studentInfo={studentInfo} isOpenState={[isInfoBarOpen, setIsInfoBarOpen]} />}
    <StudentInfoContainerDiv onDoubleClick={() => setIsInfoBarOpen((p) => !p)} style={style} {...props}>
      <Field label="Full Name" value={name} style={{ width: '20%', minWidth: '120px' }} />
      <Field label="Sex" value={sex} style={{ width: '5%', minWidth: '37px'}} />
      <Field label="Email" value={email} style={{ width: '25%', minWidth: '170px' }} />
      <Field label="Status" 
        value={
          <NarrowStatusDiv>
            <StudentStatus style={{ minWidth: '78px' }} isMatched={status === 'Matched'}>
              {status}
            </StudentStatus>
          </NarrowStatusDiv>
        }
        style={{ width: '20%', minWidth: '88px' }}
      />
      <Field label="Identifier" value={studentId} style={{ width: '10%', minWidth: '70px' }} />
      <Field label="Team Name" value={teamName} style={{ width: '25%', minWidth: '163px' }}/>
      <Field label="Level" value={level} style={{ width: '10%', minWidth: '37px' }} />
      <Field label="Shirt Size" value={tshirtSize} style={{ width: '5%', minWidth: '65px' }}/>
      <Field label="Site" value={siteName} style={{ width: '25%', minWidth: '163px' }} />

      
      <div style={{ display: 'flex' }}>
        
      </div>
    </StudentInfoContainerDiv>
  </>)
}