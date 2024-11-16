import { FaTimes } from "react-icons/fa";
import {
  EditCourse,
  EditRego,
} from "../../../../../../../../../shared_types/Competition/staff/Edit";
import { CourseCategory } from "../../../../../../../../../shared_types/University/Course";
import {
  StyledButton,
  StyledCloseButton,
  StyledColumn,
  StyledFirstDiv,
  StyledInput,
  StyledLabel,
  StyledModal,
  StyledModalOverlay,
  StyledRowContainer,
  StyledRowContainer2,
  StyledText,
  StyledTitle2,
} from "./EditCompRegistrationPopup.styles";
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

/**
 * `EditCompRegoPopUp is a React web page component that displays a pop up for editing and reviewing
 * competition registration form after the competition has been created. It provides options to toggle to hide
 * registration questions, as well as text inputs to change the courses assigned to the University course categories
 * appearing on the registration form
 *
 * @returns JSX.Element - A styled container presenting toggles to remove competition registration fields and text boxes to
 * alter course codes.
 */
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
    <StyledModalOverlay>
      <StyledModal>
        <StyledCloseButton onClick={onClose}>
          <FaTimes />
        </StyledCloseButton>
        <div>{heading}</div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            overflow: "auto",
            height: "auto",
          }}
        >
          <StyledRowContainer2>
            <StyledFirstDiv>
              <div style={{ width: "100%", textAlign: "center" }}>
                <StyledTitle2>
                  Input the relevant course codes {"\n"}and names for your
                  university
                  {"\n"}programming subjects
                </StyledTitle2>
              </div>

              <StyledLabel>Introduction to Programming</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Introduction to Programming"
                value={editCourses[CourseCategory.Introduction]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.Introduction, e)
                }
              />

              <StyledLabel>Data Structures and Algorithms</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Data Structures and Algorithms"
                value={editCourses[CourseCategory.DataStructures]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.DataStructures, e)
                }
              />

              <StyledLabel>Algorithm Design and Analysis</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Algorithm Design and Analysis"
                value={editCourses[CourseCategory.AlgorithmDesign]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.AlgorithmDesign, e)
                }
              />

              <StyledLabel>Programming Challenges and Problems</StyledLabel>
              <StyledInput
                type="text"
                placeholder="COMP1234 Programming Challenges and Problems"
                value={editCourses[CourseCategory.ProgrammingChallenges]}
                onChange={(e) =>
                  handleInputChange(CourseCategory.ProgrammingChallenges, e)
                }
              />
            </StyledFirstDiv>

            <div style={{ minWidth: "300px" }}>
              <StyledTitle2>
                Please toggle the fields you would {"\n"} like to show on the
                Competition Registration Form
              </StyledTitle2>

              <StyledRowContainer>
                <StyledColumn>
                  <StyledLabel>Codeforces</StyledLabel>
                  <StyledText>
                    Students enter their current Codeforces score
                  </StyledText>
                </StyledColumn>
                <StyledColumn>
                  <ToggleButton
                    isOn={regoFields.enableCodeforcesField}
                    onToggle={() => handleToggle("enableCodeforcesField")}
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer>
                <StyledColumn>
                  <StyledLabel>ICPC Regional Participation</StyledLabel>
                  <StyledText>
                    Students specify if they have ever competed in a regional
                    ICPC round
                  </StyledText>
                </StyledColumn>
                <StyledColumn>
                  <ToggleButton
                    isOn={regoFields.enableRegionalParticipationField}
                    onToggle={() =>
                      handleToggle("enableRegionalParticipationField")
                    }
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer>
                <StyledColumn>
                  <StyledLabel>National Olympiad Prizes</StyledLabel>
                  <StyledText>
                    Students specify if they have ever won any related National
                    Olympiad Prizes in Mathematics or Informatics
                  </StyledText>
                </StyledColumn>
                <StyledColumn>
                  <ToggleButton
                    isOn={regoFields.enableNationalPrizesField}
                    onToggle={() => handleToggle("enableNationalPrizesField")}
                  />
                </StyledColumn>
              </StyledRowContainer>

              <StyledRowContainer>
                <StyledColumn>
                  <StyledLabel>International Olympiad Prizes</StyledLabel>
                  <StyledText>
                    Students specify if they have ever won any related
                    International Olympiad Prizes in Mathematics or Informatics
                  </StyledText>
                </StyledColumn>
                <StyledColumn>
                  <ToggleButton
                    isOn={regoFields.enableInternationalPrizesField}
                    onToggle={() =>
                      handleToggle("enableInternationalPrizesField")
                    }
                  />
                </StyledColumn>
              </StyledRowContainer>
            </div>
          </StyledRowContainer2>
        </div>
        <StyledButton onClick={handleSubmit}>Save Changes</StyledButton>
      </StyledModal>
    </StyledModalOverlay>
  );
};
