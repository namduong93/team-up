import React, { FC, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import TextInput from "../../components/general_utility/TextInput";
import DropDownInput from "../../components/general_utility/DropDownInput";
import { useMultiStepRegoForm } from "./MultiStepRegoForm";
import { sendRequest } from "../../utility/request";
import { RegoProgressBar } from "../../components/general_utility/ProgressBar";

interface University {
  id: string;
  name: string;
}

export const InstitutionInformation: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();
  const [institutionOptions, setInstitutionOptions] = useState([{ value: '', label: 'Please Select' }]);
  const [isCustomInstitution, setIsCustomInstitution] = useState(false); 

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>('/universities/list');
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: university.id,
          label: university.name,
        }));

        const otherOption = { value: 'other', label: 'Other' };
        setInstitutionOptions([...institutionOptions, ...options, otherOption]);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedValue = e.target.value;

    if (selectedValue === 'other') {
      setIsCustomInstitution(true);
      setFormData({ ...formData, institution: '' }); 
    } else {
      setIsCustomInstitution(false);
      setFormData({ ...formData, institution: selectedValue });
    }
  };

  const isButtonDisabled = () => {
    return !formData.institution || (formData.role === 'Student' && !formData.studentId);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    try {
      const endpoint = formData.role === 'Staff' ? '/staff/register' : '/student/register';

      await sendRequest.post(endpoint, {
        name: `${formData.firstName} ${formData.lastName}`,
        password: formData.password,
        email: formData.email,
        tshirtSize: formData.tShirtSize,
        // gender: formData.gender,
        pronouns: formData.preferredPronoun,
        allergies: formData.foodAllergies,
        accessibilityReqs: formData.accessibilityRequirements,
        universityId: formData.institution,
        studentId: formData.role === 'Student' ? formData.studentId : undefined,
      });

      navigate('/dashboard');
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  return (
    <FlexBackground style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      fontFamily: 'Arial, Helvetica, sans-serif',
    }}>
      <RegoProgressBar progressNumber={3} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ flex: 1, marginLeft: '0', display: 'flex', flexDirection: 'column', alignItems: 'center', maxWidth: '600px', width: '100%', minWidth: '200px'  }}>
          <h1 style={{ marginBottom: '20px' }}>Institution Information</h1>

          <DropDownInput
            label="Institution"
            options={institutionOptions}
            value={formData.institution || (isCustomInstitution ? 'other' : '')}
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
              onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
              width="100%"
            />
          )}

          {formData.role === 'Student' && (
            <TextInput
              label="Student Identifier Number"
              placeholder="Please type"
              required={true}
              value={formData.studentId || ""}
              onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
              width="100%"
            />
          )}

          <div style={styles.buttonContainer}>
            <button
              style={{ ...styles.button }}
              onClick={() => navigate('/siteinformation')}
            >
              Back
            </button>

            <button
              style={{ ...styles.button, ...(isButtonDisabled() ? styles.buttonDisabled : {}) }}
              disabled={isButtonDisabled()}
              onClick={handleSubmit}
            >
              Create Account
            </button>
          </div>
        </div>
      </div>
    </FlexBackground>
  );
};

const styles: Record<string, React.CSSProperties> = {
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: '90px',
  },
  button: {
    maxWidth: '150px',
    width: '25%',
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
  buttonDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};
