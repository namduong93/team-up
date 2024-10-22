import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useMultiStepRegoForm } from "./hooks/useMultiStepRegoForm";
import { FlexBackground } from "../../../components/general_utility/Background";

export const RoleRegistration: FC = () => {
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
    <FlexBackground style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <FormContainer onSubmit={handleSubmit}>
        <Title>What is your role?</Title>

        <RoleContainer>
          <StudentButton
            type='button'
            isSelected={formData.role === 'Student'} // Pass isSelected prop
            onClick={() => handleRoleClick('Student')}
          >
            Student
          </StudentButton>

          <StaffButton
            type='button'
            isSelected={formData.role === 'Staff'} // Pass isSelected prop
            onClick={() => handleRoleClick('Staff')}
          >
            Staff
          </StaffButton>
        </RoleContainer>

        <Button disabled={!formData.role}>Next</Button>
      </FormContainer>
    </FlexBackground>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Button = styled.button`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.optionUnselected : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const RoleContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const StudentButton = styled.button<{ isSelected: boolean }>`
  border: ${({ theme, isSelected }) => (isSelected ? `2px solid ${theme.colours.confirmDark}` : 'none')}; // Border logic for Student
  border-radius: 10px;
  margin: 0 0 2.5% 2.5%;
  width: 45%;
  min-width: 0px;
  max-width: 300px;
  height: 270px; 
  font-size: 25px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.colours.confirmDark};
`;

const StaffButton = styled.button<{ isSelected: boolean }>`
  border: ${({ theme, isSelected }) => (isSelected ? `1.5px solid ${theme.colours.cancelDark}` : 'none')}; // Border logic for Staff
  border-radius: 10px;
  margin: 0 0 2.5% 2.5%;
  width: 45%;
  min-width: 0px;
  max-width: 300px;
  height: 270px; 
  font-size: 25px;
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  background-color: ${({ theme }) => theme.colours.staffOption};
  color: ${({ theme }) => theme.colours.cancelDark};
`
