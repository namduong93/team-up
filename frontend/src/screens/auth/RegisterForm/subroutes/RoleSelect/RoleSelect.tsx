import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import {
  StyledButton,
  StyledFormContainer,
  RoleContainer,
  StyledStaffButton,
  StyledStudentButton,
  StyledTitle,
} from "./RoleSelect.styles";

/**
 * A React web page form component for selecting the user's role during the registration process.
 *
 * The `RoleSelect` component allows the user to choose between "Student" or "Staff" roles.
 * Once a role is selected, the role is stored in the form data using the `useMultiStepRegoForm` context.
 *
 * @returns {JSX.Element} - A form UI for selecting a user role during registration.
 */
export const RoleSelect: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const handleRoleClick = (selectedRole: "Student" | "Staff") => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.role) {
      alert("Please select a role before proceeding");
      return;
    }
    navigate("/accountinformation");
  };

  return (
    <StyledFlexBackground
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <StyledFormContainer onSubmit={handleSubmit}>
        <StyledTitle>What is your role?</StyledTitle>

        <RoleContainer>
          <StyledStudentButton
            type="button"
            isSelected={formData.role === "Student"}
            onClick={() => handleRoleClick("Student")}
          >
            Student
          </StyledStudentButton>

          <StyledStaffButton
            type="button"
            isSelected={formData.role === "Staff"}
            onClick={() => handleRoleClick("Staff")}
          >
            Staff
          </StyledStaffButton>
        </RoleContainer>

        <StyledButton disabled={!formData.role}>Next</StyledButton>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
