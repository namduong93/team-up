import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import { useMultiStepRegoForm } from "./MultiStepRegoForm"; // Import the context
import DescriptiveTextInput from "../../components/general_utility/DescriptiveTextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import MultiRadio from "../../components/general_utility/MultiRadio";
import { RegoProgressBar } from "../../components/general_utility/ProgressBar";
import { styled } from "styled-components";

export const SiteInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm(); // Access the form context

  const handleNext = () => {
    navigate('/institutioninformation');
  }

  const tShirtOptions = [
    { value: '', label: 'Please Select' },
    { value: 'MXS', label: 'Mens XS' },
    { value: 'MS', label: 'Mens S' },
    { value: 'MM', label: 'Mens M' },
    { value: 'ML', label: 'Mens L' },
    { value: 'MXL', label: 'Mens XL' },
    { value: 'M2XL', label: 'Mens 2XL' },
    { value: 'M3XL', label: 'Mens 3XL' },
    { value: 'N4XL', label: 'Mens 4XL' },
    { value: 'N5XL', label: 'Mens 5XL' },
    { value: 'LXS', label: 'Ladies XS' },
    { value: 'LS', label: 'Ladies S' },
    { value: 'LM', label: 'Ladies M' },
    { value: 'LL', label: 'Ladies L' },
    { value: 'LXL', label: 'Ladies XL' },
    { value: 'L2XL', label: 'Ladies 2XL' },
    { value: 'L3XL', label: 'Ladies 3XL' },
  ];

  const dietaryOptions = [
    { value: 'Vegan', label: 'Vegan' },
    { value: 'Vegetarian', label: 'Vegetarian' },
    { value: 'Gluten Free', label: 'Gluten Free' },
    { value: 'Halal', label: 'Halal' },
    { value: 'Kosher', label: 'Kosher' },
  ];

  return (
    <FlexBackground style={{ justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <RegoProgressBar progressNumber={2} />
      <Container>
        <ContentContainer>
          <Title>Site Information</Title>

          <DropDownInput
            label="T-Shirt Size"
            options={tShirtOptions}
            value={formData.tShirtSize}
            required={true}
            onChange={(e) => setFormData({ ...formData, tShirtSize: e.target.value })}
            width="100%"
            descriptor="Please refer to the Sizing Guide"
          />

          <DescriptiveTextInput
            label="Food Allergies"
            descriptor="Please let us know if you have any food allergies so that we can ensure your safety"
            placeholder="Enter a description"
            required={false}
            value={formData.foodAllergies || ""}
            onChange={(e) => setFormData({ ...formData, foodAllergies: e.target.value })}
            width="100%"
          />

          <MultiRadio
            options={dietaryOptions}
            selectedValues={formData.dietaryRequirements || []}
            onChange={(selectedValues) => setFormData({ ...formData, dietaryRequirements: selectedValues })}
            label="Dietary Requirements"
            descriptor="Please select one or more options, or specify 'Other' if applicable"
          />
          {/* <p>Selected options: {formData.dietaryRequirements?.join(', ') || []}</p> */}

          <DescriptiveTextInput
            label="Accessibility Requirements"
            descriptor="Please inform us of any accessibility needs you may have"
            placeholder="Enter a description"
            required={false}
            value={formData.accessibilityRequirements || ""}
            onChange={(e) => setFormData({ ...formData, accessibilityRequirements: e.target.value })}
            width="100%"
          />

          <ButtonContainer>
            <Button onClick={() => navigate('/accountinformation')}>
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
}

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`

const ContentContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  min-width: 200px;
`
const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`

const ButtonContainer = styled.div`
  display: flex;
    width: 100%;
    justify-content: center;
    align-items: center;
    gap: 90px;
`

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#6688D2')};
  margin-top: 35px;
  margin-bottom: 40px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: Arial, Helvetica, sans-serif;
`

const NextButton = styled(Button)<{ disabled: boolean }>`
  background-color: ${({ disabled }) => (disabled ? '#ccc' : '#6688D2')};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
`;

// const styles: Record<string, React.CSSProperties> = {
//   buttonContainer: {
//     display: 'flex',
//     justifyContent: 'center',
//     alignItems: 'center',
//     width: '100%',
//     gap: '90px',
//   },
//   button: {
//     maxWidth: '150px',
//     width: '25%',
//     height: '35px',
//     border: '0px',
//     borderRadius: '30px',
//     backgroundColor: '#6688D2',
//     marginTop: '35px',
//     marginBottom: '40px',
//     color: '#ffffff',
//     fontSize: '16px',
//     fontWeight: 'bold',
//     cursor: 'pointer',
//     fontFamily: 'Arial, Helvetica, sans-serif',
//   },
// };

