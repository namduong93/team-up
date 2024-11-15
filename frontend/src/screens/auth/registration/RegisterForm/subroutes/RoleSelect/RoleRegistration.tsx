
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
