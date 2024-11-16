import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { StyledButton, StyledFormContainer, RoleContainer, StyledStaffButton, StyledStudentButton, StyledTitle } from "./RoleSelect.styles";

export const RoleSelect: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();

  const handleRoleClick = (selectedRole: 'Student' | 'Staff') => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.role) {
      alert('Please select a role before proceeding');
      return;
    }
    navigate('/accountinformation');
  };

  return (
    <StyledFlexBackground
      style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}
      data-test-id="role-select--StyledFlexBackground-0">
      <StyledFormContainer onSubmit={handleSubmit} data-test-id="role-select--StyledFormContainer-0">
        <StyledTitle data-test-id="role-select--StyledTitle-0">What is your role?</StyledTitle>
        <RoleContainer>
          <StyledStudentButton
            type='button'
            // Pass isSelected prop
            isSelected={formData.role === 'Student'}
            onClick={() => handleRoleClick('Student')}
            data-test-id="role-select--StyledStudentButton-0">Student</StyledStudentButton>

          <StyledStaffButton
            type='button'
            // Pass isSelected prop
            isSelected={formData.role === 'Staff'}
            onClick={() => handleRoleClick('Staff')}
            data-test-id="role-select--StyledStaffButton-0">Staff</StyledStaffButton>
        </RoleContainer>
        <StyledButton disabled={!formData.role} data-test-id="role-select--StyledButton-0">Next</StyledButton>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
