import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import DropdownInputLight from "../../../components/general_utility/DropDownLight";
import {
  SiteLocation,
  useMultiStepCompRegoForm,
} from "./RegisterForm/hooks/useMultiStepCompRegoForm";
import TextInputLight from "../../../components/general_utility/TextInputLight";
import RadioButton from "../../../components/general_utility/RadioButton";
import { sendRequest } from "../../../utility/request";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";

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

export const Button = styled.button<{ $disabled?: boolean }>`
  max-width: 150px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ $disabled: disabled, theme }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  pointer-events: ${({ $disabled: disabled }) => (disabled ? "none" : "auto")};
  cursor: ${({ $disabled: disabled }) =>
    disabled ? "not-allowed" : "pointer"};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

export const FormLabel = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  width: 100%;
`;
const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
  margin-left: 5px; // Add space between label and asterisk
`;
export const Text = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  width: 100%;
`;

export const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`;

export const Colon = styled.span`
  align-self: center;
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
`;

export const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;

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
}

export const yearOptions = [
  { value: "", label: "Please Select" },
  { value: "1", label: "1st" },
  { value: "2", label: "2nd" },
  { value: "3", label: "3rd" },
  { value: "4", label: "4th" },
  { value: "5", label: "5th" },
  { value: "6", label: "6th" },
  { value: "7", label: "7th" },
  { value: "8", label: "8th" },
  { value: "9", label: "9th" },
  { value: "10", label: "10th" },
];

export const CompetitionIndividual: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const { code } = useParams<{ code?: string }>();

  const handleBack = () => {
    navigate(`/competition/information/${code}`);
  };

  const handleNext = () => {
    navigate(`/competition/experience/${code}`);
  };

  function isButtonDisabled(): boolean | undefined {
    const {
      degree,
      degreeYear,
      ICPCEligibility,
      competitionLevel,
      isRemote,
      competitionBio,
    } = formData;
    return (
      degree === "" ||
      degreeYear === 0 ||
      ICPCEligibility === undefined ||
      competitionLevel === "" ||
      isRemote === undefined ||
      competitionBio === ""
    );
  }

  const [, setUser] = useState<User>({
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
        const infoResponse = await sendRequest.get<User>("/user/profile_info");
        setUser(infoResponse.data);
        const siteResponse = await sendRequest.get<{ site: SiteLocation }>(
          "/competition/user/default_site",
          { code }
        );
        setFormData({ ...formData, siteLocation: siteResponse.data.site });
        console.log("Site info:", siteResponse.data.site);
      } catch (error: unknown) {
        console.log("Error fetching user info:", error);
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

          <FormLabel>Degree</FormLabel>

          <div
            style={{ display: "flex", alignItems: "flex-start", width: "100%" }}
          >
            <DropdownInputLight
              label="Current Year of Study"
              options={yearOptions}
              value={formData.degreeYear?.toString()}
              required={true}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  degreeYear: parseInt(e.target.value),
                })
              }
              width="45%"
            />
          </div>

          <TextInputLight
            label="Degree"
            placeholder="Please enter"
            type="text"
            required={true}
            value={formData.degree}
            onChange={(e) =>
              setFormData({ ...formData, degree: e.target.value })
            }
            width="100%"
          />

          <RadioButton
            label="ICPC Eligibility"
            options={["Yes", "No"]}
            selectedOption={
              formData.ICPCEligibility === undefined
                ? ""
                : formData.ICPCEligibility
                ? "Yes"
                : "No"
            }
            onOptionChange={(e) => {
              const isICPCEligible = e.target.value === "Yes";
              setFormData({ ...formData, ICPCEligibility: isICPCEligible });
            }}
            required={true}
            descriptor="Are you ICPC eligible?"
            width="100%"
          />

          <RadioButton
            label="Competition Level"
            options={["Level A", "Level B", "No Preference"]}
            selectedOption={formData.competitionLevel}
            onOptionChange={(e) => {
              setFormData({ ...formData, competitionLevel: e.target.value });
            }}
            required={true}
            // descriptor="Are you ICPC eligible?"
            width="100%"
          />

          <FormLabel>
            Site Attendance<Asterisk>*</Asterisk>
          </FormLabel>

          <div style={{ display: "flex", alignContent: "center" }}>
            <Text>
              <em>{formData.siteLocation.name}</em>
            </Text>
          </div>

          <RadioButton
            // label="Site Attendance"
            options={["Attending On Site", "Attending Remotely"]}
            selectedOption={
              formData.isRemote === undefined
                ? ""
                : formData.isRemote
                ? "Attending Remotely"
                : "Attending On Site"
            }
            onOptionChange={(e) => {
              const isRemote = e.target.value === "Attending Remotely";
              setFormData({ ...formData, isRemote });
            }}
            required={true}
            descriptor={["Will you be attending on site or remotely?"]}
            width="100%"
          />

          <DescriptiveTextInput
            label="Competition Biography"
            descriptor="Please write a short description about yourself that would help others get to know you"
            placeholder="Enter a description"
            required={true}
            value={formData.competitionBio}
            onChange={(e) =>
              setFormData({ ...formData, competitionBio: e.target.value })
            }
            width="100%"
          />

          <FormLabel>Preferred Contact Method</FormLabel>
          <Descriptor>
            Please specify your preferred contact method if you have another
            preference
          </Descriptor>
          <DoubleInputContainer>
            <TextInputLight
              label="Platform"
              placeholder="Please enter"
              type="text"
              required={false}
              value={formData.platform || ""}
              onChange={(e) =>
                setFormData({ ...formData, platform: e.target.value })
              }
              width="45%"
            />

            <Colon>:</Colon>

            <TextInputLight
              label="Handle"
              placeholder="Please enter"
              type="text"
              required={false}
              value={formData.handle || ""}
              onChange={(e) =>
                setFormData({ ...formData, handle: e.target.value })
              }
              width="45%"
            />
          </DoubleInputContainer>

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button $disabled={isButtonDisabled()} onClick={handleNext}>
              Next
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
