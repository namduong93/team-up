import React, { FC } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import { useMultiStepRegoForm } from "./MultiStepRegoForm"; // Import the context
import DescriptiveTextInput from "../../components/general_utility/DescriptiveTextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import MultiRadio from "../../components/general_utility/MultiRadio";

// const steps = [
//   { label: 'User Type', active: false },
//   { label: 'Account Information', active: false },
//   { label: 'Site Information', active: true },
//   { label: 'Institution Information', active: false },
// ];

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
  // use flex for the other stuff
  return (
    <FlexBackground style={{ justifyContent: 'space-between', alignItems: 'flex-start', fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div style={{ flex: 1, marginLeft: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <h1 style={{ marginBottom: '20px' }}>Site Information</h1>

        <DropDownInput
          label="T-Shirt Size"
          options={tShirtOptions}
          value={formData.tShirtSize}
          required={true}
          onChange={(e) => setFormData({ ...formData, tShirtSize: e.target.value })}
          width="620px"
          descriptor="Please refer to the Sizing Guide"
        />

        <DescriptiveTextInput
          label="Food Allergies"
          descriptor="Please let us know if you have any food allergies so that we can ensure your safety"
          placeholder="Enter a description"
          required={false}
          value={formData.foodAllergies || ""}
          onChange={(e) => setFormData({ ...formData, foodAllergies: e.target.value })}
          width="600px"
        />

        <MultiRadio
          options={dietaryOptions}
          selectedValues={formData.dietaryRequirements || []}
          onChange={(selectedValues) => setFormData({ ...formData, dietaryRequirements: selectedValues })}
          label="Dietary Requirements"
          descriptor="Please select one or more options, or specify 'Other' if applicable"
        />
        <p>Selected options: {formData.dietaryRequirements?.join(', ') || []}</p>

        <DescriptiveTextInput
          label="Accessibility Requirements"
          descriptor="Please inform us of any accessibility needs you may have"
          placeholder="Enter a description"
          required={false}
          value={formData.accessibilityRequirements || ""}
          onChange={(e) => setFormData({ ...formData, accessibilityRequirements: e.target.value })}
          width="600px"
        />

        <div style={styles.buttonContainer}>
          <button
            style={styles.button}
            onClick={() => {navigate('/accountinformation')
            console.log(formData)}}
          >
            Back
          </button>

          <button
            style={{
              ...styles.button,
              backgroundColor: formData.tShirtSize ? '#6688D2' : '#ccc',
              cursor: formData.tShirtSize ? 'pointer' : 'not-allowed'
            }}
            disabled={!formData.tShirtSize}
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      </div>
    </FlexBackground>
  );
}

const styles: Record<string, React.CSSProperties> = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '90px',
  },
  button: {
    width: '150px',
    height: '35px',
    border: '0px',
    borderRadius: '30px',
    backgroundColor: '#6688D2',
    marginTop: '35px',
    marginBottom: '40px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
};

