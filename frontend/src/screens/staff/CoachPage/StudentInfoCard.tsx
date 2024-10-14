import { FC } from "react"
import { StudentInfo } from "./StudentDisplay"
import styled from "styled-components"

const StudentInfoContainerDiv = styled.div`
  display: flex;
  width: 100%;
  height: 320px;
  background-color: lightgrey;
  box-sizing: border-box;
  justify-content: space-around;
  font-size: 14px;
`;

export const StudentInfoCard: FC<StudentInfo> = ({ style, studentInfo, isHeader = false, ...props }) => {

  return (
    <StudentInfoContainerDiv style={style} {...props}>
      <div style={{ width: '15%', display: 'flex', gap: '5px', flexDirection: 'column', height: '60px', backgroundColor: 'lightblue' }}>
        <span>Full Name:</span>
        <span>Full Name:</span>
      </div>
      <div style={{ width: '15%', height: '30px', backgroundColor: 'lightblue' }}>
        Full Name:
      </div>
      <div style={{ width: '15%', height: '30px', backgroundColor: 'lightblue' }}>
        Full Name:
      </div>
      <div style={{ width: '15%', height: '30px', backgroundColor: 'lightblue' }}>
        Full Name:
      </div>
    </StudentInfoContainerDiv>
  )
}