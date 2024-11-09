import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useMultiStepRegoForm } from "./hooks/useMultiStepRegoForm";
import { sendRequest } from "../../../utility/request";
import { FlexBackground } from "../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../components/progress_bar/ProgressBar";
import DropdownInput from "../../../components/general_utility/DropDownInput";
import TextInput from "../../../components/general_utility/TextInput";
import { University } from "../../../../shared_types/Competition/registration/StaffRegistration";

export const InstitutionInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();
  const [institutionOptions, setInstitutionOptions] = useState([
    { value: "", label: "Please Select" },
  ]);
  const [isCustomInstitution, setIsCustomInstitution] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: university.id,
          label: university.name,
        }));

        const otherOption = { value: "other", label: "Other" };
        setInstitutionOptions([...institutionOptions, ...options, otherOption]);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === "other") {
      setIsCustomInstitution(true);
      setFormData({ ...formData, institution: "" });
    } else {
      setIsCustomInstitution(false);
      setFormData({ ...formData, institution: selectedValue });
    }
  };

  const isButtonDisabled = () => {
    return (
      !formData.institution ||
      (formData.role === "Student" && !formData.studentId)
    );
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const endpoint =
        formData.role === "Staff" ? "/staff/register" : "/student/register";

      await sendRequest.post(endpoint, {
        name: `${formData.firstName} ${formData.lastName}`,
        preferredName: formData.preferredName,
        password: formData.password,
        email: formData.email,
        tshirtSize: formData.tShirtSize,
        gender: formData.gender,
        pronouns: formData.preferredPronoun,
        allergies: formData.foodAllergies,
        dietaryReqs: formData.dietaryRequirements,
        accessibilityReqs: formData.accessibilityRequirements,
        universityId: formData.institution,
        studentId: formData.role === "Student" ? formData.studentId : undefined,
      });

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <FlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <RegoProgressBar progressNumber={3} />
      <Container>
        <ContentContainer>
          <Title>Institution Information</Title>

          <DropdownInput
            label="Institution"
            options={institutionOptions}
            value={formData.institution || (isCustomInstitution ? "other" : "")}
            required={true}
            onChange={handleInstitutionChange}
            width="100%"
          />

          {isCustomInstitution && (
            <TextInput
              label="Other Institution"
              placeholder="Please type your institution"
              required={true}
              value={formData.institution}
              onChange={(e) =>
                setFormData({ ...formData, institution: e.target.value })
              }
              width="100%"
            />
          )}

          {formData.role === "Student" && (
            <TextInput
              label="Student Identifier Number"
              placeholder="Please type"
              required={true}
              value={formData.studentId || ""}
              onChange={(e) =>
                setFormData({ ...formData, studentId: e.target.value })
              }
              width="100%"
            />
          )}

          <ButtonContainer>
            <Button onClick={() => navigate("/siteinformation")}>Back</Button>

            <CreateAccountButton
              disabled={isButtonDisabled()}
              onClick={handleSubmit}
            >
              Create Account
            </CreateAccountButton>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`;
const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`;

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const CreateAccountButton = styled(Button)`
  min-width: 100px;
`;
