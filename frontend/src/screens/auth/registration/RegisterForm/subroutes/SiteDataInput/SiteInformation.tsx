import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { useMultiStepRegoForm } from "./RegisterForm/hooks/useMultiStepRegoForm";
import { FlexBackground } from "../../../components/general_utility/Background";
import { RegoProgressBar } from "../../../components/progress_bar/ProgressBar";
import DropdownInput from "../../../components/general_utility/DropDownInput";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import MultiRadio from "../../../components/general_utility/MultiRadio";

export const tShirtOptions = [
  { value: "", label: "Please Select" },
  { value: "MXS", label: "Mens XS" },
  { value: "MS", label: "Mens S" },
  { value: "MM", label: "Mens M" },
  { value: "ML", label: "Mens L" },
  { value: "MXL", label: "Mens XL" },
  { value: "M2XL", label: "Mens 2XL" },
  { value: "M3XL", label: "Mens 3XL" },
  { value: "N4XL", label: "Mens 4XL" },
  { value: "N5XL", label: "Mens 5XL" },
  { value: "LXS", label: "Ladies XS" },
  { value: "LS", label: "Ladies S" },
  { value: "LM", label: "Ladies M" },
  { value: "LL", label: "Ladies L" },
  { value: "LXL", label: "Ladies XL" },
  { value: "L2XL", label: "Ladies 2XL" },
  { value: "L3XL", label: "Ladies 3XL" },
];

export const dietaryOptions = [
  { value: "Vegan", label: "Vegan" },
  { value: "Vegetarian", label: "Vegetarian" },
  { value: "Gluten Free", label: "Gluten Free" },
  { value: "Halal", label: "Halal" },
  { value: "Kosher", label: "Kosher" },
];

export const SiteInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm(); // Access the form context

  const handleNext = () => {
    navigate("/institutioninformation");
  };

  return (
    <FlexBackground
      style={{
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <RegoProgressBar progressNumber={2} />
      <Container>
        <ContentContainer>
          <Title>Site Information</Title>

          <DropdownInput
            label="T-Shirt Size"
            options={tShirtOptions}
            value={formData.tShirtSize}
            required={true}
            onChange={(e) =>
              setFormData({ ...formData, tShirtSize: e.target.value })
            }
            width="100%"
            descriptor="Please refer to the Sizing Guide"
          />

          <DescriptiveTextInput
            label="Food Allergies"
            descriptor="Please let us know if you have any food allergies so that we can ensure your safety"
            placeholder="Enter a description"
            required={false}
            value={formData.foodAllergies || ""}
            onChange={(e) =>
              setFormData({ ...formData, foodAllergies: e.target.value })
            }
            width="100%"
          />

          <MultiRadio
            options={dietaryOptions}
            selectedValues={formData.dietaryRequirements || []}
            onChange={(selectedValues) =>
              setFormData({ ...formData, dietaryRequirements: selectedValues })
            }
            label="Dietary Requirements"
            descriptor="Please select one or more options, or specify 'Other' if applicable"
          />

          <DescriptiveTextInput
            label="Accessibility Requirements"
            descriptor="Please inform us of any accessibility needs you may have"
            placeholder="Enter a description"
            required={false}
            value={formData.accessibilityRequirements || ""}
            onChange={(e) =>
              setFormData({
                ...formData,
                accessibilityRequirements: e.target.value,
              })
            }
            width="100%"
          />

          <ButtonContainer>
            <Button onClick={() => navigate("/accountinformation")}>
              Back
            </Button>

            <NextButton disabled={!formData.tShirtSize} onClick={handleNext}>
              Next
            </NextButton>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
