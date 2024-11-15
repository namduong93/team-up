import { FaTimes } from "react-icons/fa";
import { EditCourse, EditRego } from "../../../../../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../../../../../shared_types/University/Course";
import { Button, CloseButton, Column, FirstDiv, Input, Label, Modal, ModalOverlay, RowContainer, RowContainer2, Text, Title2 } from "./EditCompRegistrationPopup.styles";
import { ToggleButton } from "../ToggleButton";

interface EditCompRegoPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  regoFields: EditRego;
  setRegoFields: React.Dispatch<React.SetStateAction<EditRego>>;
  onSubmit: (regoFields: EditRego) => void;
  editCourses: EditCourse;
  setCourses: (category: CourseCategory, value: string) => void;
}

export const EditCompRegoPopUp: React.FC<EditCompRegoPopUpProps> = ({
  heading,
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

  const handleSubmit = () => {
    onSubmit(regoFields);
    onClose();
  };

  const handleInputChange = (
    category: CourseCategory,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCourses(category, event.target.value);
  };

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

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
