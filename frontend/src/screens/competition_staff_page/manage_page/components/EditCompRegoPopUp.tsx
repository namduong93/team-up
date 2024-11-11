import React from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { ToggleButton } from "./ToggleButton";
import {
  EditRego,
  EditCourse,
} from "../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../shared_types/University/Course";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 2000px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  /* overflow-y: scroll;
  height: 70%; */
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

const Button = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Text = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 85% 15%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 100%;
`;

const RowContainer2 = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  gap: 60px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 95%;
`;
const Input = styled.input`
  padding: 10px 1.5%;
  height: 100%;
  box-sizing: border-box;
  width: 100%;
  border: 1px solid ${({ theme }) => theme.colours.notifDark};
  border-radius: 10px;
  margin-bottom: 5px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.background};
  color: ${({ theme }) => theme.fonts.colour};
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  gap: 10px;
  padding: 5px;
`;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center; // Add this line to center the text
`;

const FirstDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
  padding: 5px;
  width: 100%;
  margin-bottom: 32px;
  min-width: 300px;
`;

interface EditCompRegoPopUpProps {
  onClose: () => void;
  regoFields: EditRego;
  setRegoFields: React.Dispatch<React.SetStateAction<EditRego>>;
  onSubmit: (regoFields: EditRego) => void;
  editCourses: EditCourse;
  setCourses: (category: CourseCategory, value: string) => void;
}

export const EditCompRegoPopUp: React.FC<EditCompRegoPopUpProps> = ({
  onClose,
  regoFields,
  setRegoFields,
  onSubmit,
  editCourses,
  setCourses,
}) => {
  const handleToggle = (field: keyof EditRego) => {
    setRegoFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };

  const handleInputChange = (
    category: CourseCategory,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCourses(category, event.target.value); // Pass the value of the input field
  };

  const handleSubmit = () => {
    onSubmit(regoFields);
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "auto",
            height: "auto",
          }}
        >
          <RowContainer2>
            <FirstDiv>
              <div style={{ width: "100%", textAlign: "center" }}>
                <Title2>
                  Input the relevant course codes {"\n"}and names for your
                  university
                  {"\n"}programming subjects
                </Title2>
              </div>

              <Label>Introduction to Programming</Label>
              <Input
                type="text"
                placeholder="COMP1234 Introduction to Programming"
                value={editCourses[CourseCategory.Introduction]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.Introduction, e)
                }
              />

              <Label>Data Structures and Algorithms</Label>
              <Input
                type="text"
                placeholder="COMP1234 Data Structures and Algorithms"
                value={editCourses[CourseCategory.DataStructures]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.DataStructures, e)
                }
              />

              <Label>Algorithm Design and Analysis</Label>
              <Input
                type="text"
                placeholder="COMP1234 Algorithm Design and Analysis"
                value={editCourses[CourseCategory.AlgorithmDesign]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.AlgorithmDesign, e)
                }
              />

              <Label>Programming Challenges and Problems</Label>
              <Input
                type="text"
                placeholder="COMP1234 Programming Challenges and Problems"
                value={editCourses[CourseCategory.ProgrammingChallenges]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.ProgrammingChallenges, e)
                }
              />
            </FirstDiv>

            <div style={{ minWidth: "300px" }}>
              <Title2>
                Please toggle the fields you would {"\n"} like to show on the
                Competition Registration Form
              </Title2>

              <RowContainer>
                <Column>
                  <Label>Codeforces</Label>
                  <Text>Students enter their current Codeforces score</Text>
                </Column>
                <Column>
                  <ToggleButton
                    isOn={regoFields.enableCodeforcesField}
                    onToggle={() => handleToggle("enableCodeforcesField")}
                  />
                </Column>
              </RowContainer>

              <RowContainer>
                <Column>
                  <Label>ICPC Regional Participation</Label>
                  <Text>
                    Students specify if they have ever competed in a regional
                    ICPC round
                  </Text>
                </Column>
                <Column>
                  <ToggleButton
                    isOn={regoFields.enableRegionalParticipationField}
                    onToggle={() =>
                      handleToggle("enableRegionalParticipationField")
                    }
                  />
                </Column>
              </RowContainer>

              <RowContainer>
                <Column>
                  <Label>National Olympiad Prizes</Label>
                  <Text>
                    Students specify if they have ever won any related National
                    Olympiad Prizes in Mathematics or Informatics
                  </Text>
                </Column>
                <Column>
                  <ToggleButton
                    isOn={regoFields.enableNationalPrizesField}
                    onToggle={() => handleToggle("enableNationalPrizesField")}
                  />
                </Column>
              </RowContainer>

              <RowContainer>
                <Column>
                  <Label>International Olympiad Prizes</Label>
                  <Text>
                    Students specify if they have ever won any related
                    International Olympiad Prizes in Mathematics or Informatics
                  </Text>
                </Column>
                <Column>
                  <ToggleButton
                    isOn={regoFields.enableInternationalPrizesField}
                    onToggle={() =>
                      handleToggle("enableInternationalPrizesField")
                    }
                  />
                </Column>
              </RowContainer>
            </div>
          </RowContainer2>
        </div>

        <Button onClick={handleSubmit}>Save Changes</Button>
      </Modal>
    </ModalOverlay>
  );
};
