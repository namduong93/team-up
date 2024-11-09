import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { useMultiStepCompRegoForm } from "./hooks/useMultiStepCompRegoForm";
import MultiRadio from "../../../components/general_utility/MultiRadio";
import TextInput from "../../../components/general_utility/TextInput";
import RadioButton from "../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import { sendRequest } from "../../../utility/request";
import { Course, CourseCategory } from "../../../../shared_types/University/Course";
import { EditRego } from "../../../../shared_types/Competition/staff/Edit";
import { DEFAULT_REGO_FIELDS } from "../../competition_staff_page/manage_page/components/StaffActionCard";

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

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
  margin-left: 5px; // Add space between label and asterisk
`;

export const CompetitionExperience: FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const [hasNationalPrize, setHasNationalPrize] = useState<boolean | undefined>(
    undefined
  );
  const [hasInternationalPrize, setHasInternationalPrize] = useState<
    boolean | undefined
  >(undefined);

  const handleBack = () => {
    navigate(`/competition/individual/${code}`);
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      degreeYear,
      degree,
      ICPCEligibility,
      isRemote,
      competitionLevel,
      siteLocation,
      boersenEligible,
      codeforce,
      nationalPrizes,
      internationalPrizes,
      courses,
      pastRegional,
      platform,
      handle,
      competitionBio,
    } = formData;

    const competitionUser = {
      ICPCEligible: ICPCEligibility,
      competitionLevel: competitionLevel,
      siteLocation: siteLocation,
      boersenEligible: boersenEligible,
      degreeYear: degreeYear,
      degree: degree,
      isRemote: isRemote,
      nationalPrizes: nationalPrizes,
      internationalPrizes: internationalPrizes,
      codeforcesRating: codeforce,
      universityCourses: courses,
      pastRegional: pastRegional,
      competitionBio: competitionBio,
      preferredContact: `${platform}:${handle}`,
    };

    const payload = {
      code: code,
      competitionUser,
    };

    try {
      console.log(payload);
      const allFieldsFalse = Object.values(editRego).every(
        (value) => value === false
      );

      // TO-DO: uncomment when the other API is confirmed

      // const apiEndpoint = allFieldsFalse
      //   ? "/competition/student/join"
      //   : "NEW_ONE"; // change when the other API is done

      // const response = await sendRequest.post(apiEndpoint, payload);
      
      const response = await sendRequest.post('/competition/student/join', payload);
      console.log("Response:", response.data);
      

      navigate("/dashboard", {
        state: {
          isRegoSuccessPopUpOpen: true,
        },
      });
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  const [courseOptions, setCourseOptions] = useState([
    { value: CourseCategory.Introduction, label: 'Introduction to Programming / Programming Fundamentals (and any advanced versions' },
    { value: CourseCategory.DataStructures, label: 'Data Structures and Algorithms (and any advanced versions)' },
    { value: CourseCategory.AlgorithmDesign, label: 'Algorithm Design and Analysis (and any advanced versions' },
    { value: CourseCategory.ProgrammingChallenges, label: 'Programming Challenges and Problems (and any advanced versions' },
  ]);

  useEffect(() => {
    const fetchCourses = async () => {
      const response = await sendRequest.get<{ courses: Array<Course> }>('/university/courses');
      const { courses } = response.data;

      setCourseOptions(courses.map((course) => ({ value: course.category, label: course.courseName })));
    }

    fetchCourses();
  }, []);

    
  const courseOptions = [
    {
      value: "Introduction to Programming / Programming Fundamentals",
      label:
        "Introduction to Programming / Programming Fundamentals (and any advanced versions)",
    },
    {
      value: "Data Structures and Algorithms",
      label: "Data Structures and Algorithms (and any advanced versions)",
    },
    {
      value: "Algorithm Design and Analysis",
      label: "Algorithm Design and Analysis (and any advanced versions)",
    },
    {
      value: "Programming Challenges and Problems",
      label: "Programming Challenges and Problems (and any advanced versions)",
    },
  ];

  function isButtonDisabled(): boolean | undefined {
    const {
      courses,
      nationalPrizes,
      internationalPrizes,
      pastRegional,
      degreeYear,
    } = formData;
    if (formData.competitionLevel === "Level B") {
      return courses.length === 0;
    } else {
      return (
        courses.length === 0 ||
        (editRego.enableNationalPrizesField && hasNationalPrize === undefined) ||
        (hasNationalPrize && nationalPrizes === "") ||
        (editRego.enableInternationalPrizesField &&
          hasInternationalPrize === undefined) ||
        (hasInternationalPrize && internationalPrizes === "") ||
        (editRego.enableRegionalParticipationField &&
          degreeYear !== 1 &&
          pastRegional === undefined)
      );
    }
  }

  // TO-DO: call the EditRego interface for the competition from backend
  const [editRego, setEditRego] = useState<EditRego>({
    enableCodeforcesField: false,
    enableNationalPrizesField: false,
    enableInternationalPrizesField: false,
    enableRegionalParticipationField: false,
  });

  useEffect(() => {
    const fetchEditRego = async () => {
      const response = await sendRequest.get<{ regoFields: EditRego }>(
        '/competition/students/rego_toggles', { code });
      const { regoFields } = response.data;
      setEditRego(regoFields || DEFAULT_REGO_FIELDS);
    }
    fetchEditRego();
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
      <CompRegistrationProgressBar progressNumber={2} />
      <Container>
        <ContentContainer>
          <Title>Competitive Experience</Title>

          <MultiRadio
            options={courseOptions}
            selectedValues={formData.courses}
            onChange={(selectedValues) =>
              setFormData({ ...formData, courses: selectedValues })
            }
            label={
              <>
                University Courses Completed
                <Asterisk>*</Asterisk>
              </>
            }
            descriptor="Please select the courses you have completed"
            showOther={false}
          />

          {editRego.enableCodeforcesField && formData.competitionLevel !== "Level B" && (
            <TextInput
              label="Codeforces Score"
              placeholder="Please enter"
              type="numeric"
              required={false}
              value={formData.codeforce?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setFormData({ ...formData, codeforce: Number(value) });
              }}
              width="100%"
              descriptor="Please enter your current Codeforce score if applicable"
            />
          )}

          {editRego.enableRegionalParticipationField &&
            formData.degreeYear.toString() !== "1" &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="ICPC Regional Participation"
                options={["Yes", "No"]}
                selectedOption={
                  formData.pastRegional === undefined
                    ? ""
                    : formData.pastRegional
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const pastRegional = e.target.value === "Yes";
                  setFormData({ ...formData, pastRegional: pastRegional });
                }}
                required={true}
                descriptor="Have you ever competed in a regional ICPC round?"
                width="100%"
              />
            )}

          {editRego.enableNationalPrizesField &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="National Olympiad Prizes in Mathematics or Informatics"
                options={["Yes", "No"]}
                selectedOption={
                  hasNationalPrize === undefined
                    ? ""
                    : hasNationalPrize
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const nationalPrize = e.target.value === "Yes";
                  setHasNationalPrize(nationalPrize);
                }}
                required={true}
                descriptor="Have you ever won any related National Olympiad in Mathematics or Informatics prizes?"
                width="100%"
              />
            )}

          {hasNationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related National Olympiad prizes you may have (NOI, AIO, VNOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.nationalPrizes || ""}
              onChange={(e) =>
                setFormData({ ...formData, nationalPrizes: e.target.value })
              }
              width="100%"
            />
          )}

          {editRego.enableInternationalPrizesField &&
            formData.competitionLevel !== "Level B" && (
              <RadioButton
                label="International Olympiad Prizes in Mathematics or Informatics"
                options={["Yes", "No"]}
                selectedOption={
                  hasInternationalPrize === undefined
                    ? ""
                    : hasInternationalPrize
                    ? "Yes"
                    : "No"
                }
                onOptionChange={(e) => {
                  const internationalPrize = e.target.value === "Yes";
                  setHasInternationalPrize(internationalPrize);
                }}
                required={true}
                descriptor="Have you ever won any related International Olympiad prizes?"
                width="100%"
              />
            )}

          {hasInternationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related International Olympiad prizes you may have (IOI, APIO, CEOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.internationalPrizes || ""}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  internationalPrizes: e.target.value,
                })
              }
              width="100%"
            />
          )}

          {formData.competitionLevel !== "Level B" && (
            <RadioButton
              label="Boersen Prize Eligibility"
              options={["Yes", "No"]}
              selectedOption={
                formData.boersenEligible === undefined
                  ? ""
                  : formData.boersenEligible
                  ? "Yes"
                  : "No"
              }
              onOptionChange={(e) => {
                const isBoersenEligible = e.target.value === "Yes";
                setFormData({
                  ...formData,
                  boersenEligible: isBoersenEligible,
                });
              }}
              required={false}
              descriptor={[
                "This prize celebrates the work of Ms. Raewyn Boersen, previous South Pacific Director, Founder, and recipient of the Mark Measures Distinguished Service Award.",
                "The prize is awarded to the top team of all women or non-binary students. If this team places in the top half of level A, then they qualify to the Regional Finals.",
                "",
                "Please select 'Yes' if you are female or non-binary and would like to compete for the Boersen Prize, or 'No' otherwise.",
              ]}
              width="100%"
            />
          )}

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button $disabled={isButtonDisabled()} onClick={handleRegister}>
              Register
            </Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
