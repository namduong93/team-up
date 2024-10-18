import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../components/general_utility/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import DropdownInputLight from "../../components/general_utility/DropDownLight";
import { useMultiStepCompRegoForm } from "./MultiStepCompRegoForm";
import TextInputLight from "../../components/general_utility/TextInputLight";
import RadioButton from "../../components/general_utility/RadioButton";
import { sendRequest } from "../../utility/request";

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  color: ${({ theme }) => theme.fonts.colour};
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

export const Button = styled.button<{ $disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  pointer-events: ${({ $disabled: disabled }) => disabled ? 'none' : 'auto'};
  cursor: ${({ $disabled: disabled }) => (disabled ? 'not-allowed' : 'pointer' )};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  width: 100%;
`
const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
  margin-left: 5px; // Add space between label and asterisk
`
const Text = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  width: 100%;
`

interface User {
  role: "student" | "staff";
  profilePic: string;
  name: string;
  preferredName: string;
  email: string;
  affiliation: string;
  gender: "M" | "F" | "other" | "NB";
  pronouns: "She/Her" | "He/Him" | "They/Them" | "Other";
  tshirtSize: string;
  allergies: string;
  dietaryReqs: string[];
  accessibilityReqs: string;
};

export const CompetitionIndividual: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const { code } = useParams<{code?: string}>();
  
  const handleBack = () => {
    navigate(`/competition/information/${code}`);
  };

  const handleNext = () => {
    navigate(`/competition/experience/${code}`); 
  };

  const yearOptions = [
    { value: '', label: 'Please Select'},
    { value: '1', label: '1st' },
    { value: '2', label: '2nd' },
    { value: '3', label: '3rd' },
    { value: '4', label: '4th' },
    { value: '5', label: '5th' },
    { value: '6', label: '6th' },
    { value: '7', label: '7th' },
    { value: '8', label: '8th' },
    { value: '9', label: '9th' },
    { value: '10', label: '10th' },
  ];

  function isButtonDisabled(): boolean | undefined {
    const { degree, degreeYear, ICPCEligibility, competitionLevel, isRemote } = formData;
    return (
      degree === '' ||
      degreeYear === 0 ||
      ICPCEligibility === undefined ||
      competitionLevel === '' ||
      isRemote === undefined
    );
  }

  const [user, setUser] = useState<User>({
    role: "student", 
    profilePic: "",
    name: "",
    preferredName: "",
    email: "",
    affiliation: "",
    gender: "M", 
    pronouns: "Other",
    tshirtSize: "",
    allergies: "",
    dietaryReqs: [],
    accessibilityReqs: "",
  });

  useEffect(() => {
    (async () => {
      try {
        const infoResponse = await sendRequest.get<User>('/user/profile_info');
        setUser(infoResponse.data);
      } catch (error: unknown) {
        console.log('Error fetching user info:', error);
      }
    })();
  }, []);

  return (
    <FlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <CompRegistrationProgressBar progressNumber={1} />
      <Container>
        <ContentContainer>
          <Title>Individual Information</Title>

          <Label>Degree</Label>

          <div style={{ display:'flex', alignItems:'flex-start', width:'100%'}}>
            <DropdownInputLight
              label="Current Year of Study"
              options={yearOptions}
              value={formData.degreeYear?.toString()}
              required={true}
              onChange={(e) => setFormData({ ...formData, degreeYear: parseInt(e.target.value) })}
              width="45%"
            />
          </div>

          <TextInputLight
            label="Degree"
            placeholder="Please enter"
            type="text"
            required={true}
            value={formData.degree}
            onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
            width="100%" 
          />

          <RadioButton
            label="ICPC Eligibility"
            options={['Yes', 'No']}
            selectedOption={
              formData.ICPCEligibility === undefined ? '' : formData.ICPCEligibility ? 'Yes' : 'No'
            }
            onOptionChange={(e) => {
              const isICPCEligible = e.target.value === 'Yes';
              setFormData({ ...formData, ICPCEligibility: isICPCEligible });
            }}
            required={true}
            descriptor="Are you ICPC eligible?"
            width="100%"
          />

          <RadioButton
            label="Competition Level"
            options={['Level A', 'Level B', 'No Preference']}
            selectedOption={formData.competitionLevel}
            onOptionChange={(e) => {setFormData({ ...formData, competitionLevel: e.target.value })}}
            required={true}
            // descriptor="Are you ICPC eligible?"
            width="100%"
          />

          <Label>Site Attendance<Asterisk>*</Asterisk></Label>
          <Text>The default site for your Instution is:</Text>

          <div style={{display:'flex', alignContent:'center'}}>
            <Text><em>SITE LOCATION</em></Text>
          </div>
          {/* TODO: add site location */}


          <RadioButton
            // label="Site Attendance"
            options={['Attending On Site', 'Attending Remotely']}
            selectedOption={
              formData.isRemote === undefined 
                ? '' 
                : formData.isRemote 
                ? 'Attending Remotely' 
                : 'Attending On Site'
            }
            onOptionChange={(e) => {
              const isRemote = e.target.value === 'Attending Remotely';
              setFormData({ ...formData, isRemote });
            }}
            required={true}
            descriptor="Will you be attending on site or remotely?"
            width="100%"
          />

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button $disabled={isButtonDisabled()} onClick={handleNext}>Next</Button>
          </ButtonContainer>

        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
