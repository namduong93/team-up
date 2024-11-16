import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "../../hooks/useMultiStepRegoForm";
import { University } from "../../../../../../shared_types/Competition/registration/StaffRegistration";
import { sendRequest } from "../../../../../utility/request";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import { StyledButton, StyledButtonContainer, StyledContainer, StyledContentContainer, StyledCreateAccountButton, StyledTitle } from "./InstitutionDataInput.styles";
import DropdownInput from "../../../../../components/general_utility/DropDownInput";
import TextInput from "../../../../../components/general_utility/TextInput";

export const InstitutionDataInput: FC = () => {
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
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
      data-test-id="institution-data-input--StyledFlexBackground-0">
      <RegoProgressBar progressNumber={3} />
      <StyledContainer data-test-id="institution-data-input--StyledContainer-0">
        <StyledContentContainer data-test-id="institution-data-input--StyledContentContainer-0">
          <StyledTitle data-test-id="institution-data-input--StyledTitle-0">Institution Information</StyledTitle>
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
          <StyledButtonContainer data-test-id="institution-data-input--StyledButtonContainer-0">
            <StyledButton
              onClick={() => navigate("/siteinformation")}
              data-test-id="institution-data-input--StyledButton-0">Back</StyledButton>
            <StyledCreateAccountButton
              disabled={isButtonDisabled()}
              onClick={handleSubmit}
              data-test-id="institution-data-input--StyledCreateAccountButton-0">Create Account</StyledCreateAccountButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
