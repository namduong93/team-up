import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../components/general_utility/ProgressBar";
import { useNavigate } from "react-router-dom";
import { useMultiStepCompRegoForm } from "./MultiStepCompRegoForm";
import MultiRadio from "../../components/general_utility/MultiRadio";
import TextInput from "../../components/general_utility/TextInput";
import RadioButton from "../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../components/general_utility/DescriptiveTextInput";
import axios from "axios";
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
// const Text = styled.label`
//   display: block;
//   text-align: left;
//   margin-bottom: 20px;
//   margin-top: 10px;
//   font-family: ${({ theme }) => theme.fonts.fontFamily};
//   font-size: 16px;
//   width: 100%;
// `

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`

export const CompetitionExperience: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepCompRegoForm();
  const [hasNationalPrize, setHasNationalPrize] = useState<boolean | undefined>(undefined)
  const [hasInternationalPrize, setHasInternationalPrize] = useState<boolean | undefined>(undefined)
  // const [courseOptions, setCourseOptions] = useState<Array<{ value: string; label: string }>>([]);

  const handleBack = () => {
    navigate("/competition/individual");
  };

  const handleRegister = async (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault();

    const { degreeYear, degree, ICPCEligibility, isRemote, competitionLevel, boersenEligible, codeforce, nationalPrizes, internationalPrizes, courses, regional } = formData;
    const competitionUser = {
      ICPCEligible: ICPCEligibility,
      competitionLevel: competitionLevel,
      boersenEligible: boersenEligible,
      degreeYear: degreeYear,
      degree: degree, 
      isRemote: isRemote,
      nationalPrizes: nationalPrizes,
      internationalPrizes: internationalPrizes,
      codeforcesRating: codeforce,
      universityCourses: courses,
      regional: regional,
    }

    const payload = {
      code: "TSTC1",
      competitionUser,
    }

    try {
      // const response = await sendRequest.post('/competition/student/join ', payload);
      // console.log("Response:", response.data);

      navigate("/dashboard"); 

      // TO-DO: uncomment when pop-up is implemented on Admin Page
      // navigate("/competition/page", { 
      //   state: { 
      //     showPopUp: true, 
      //     message: "You have created a new Competition", 
      //     code: "COMP_12345"
      //   }
      // }); 
    } catch (error) {
      console.error("Error creating competition:", error);
    }

  };

  const courseOptions = [
    { value: '1511', label: 'COMP1511  Porgramming Fundamentals' },
    { value: '2521', label: 'COMP2521  Data Structures and Algorithms' },
    { value: '3121', label: 'COMP3121  Algorithm Design and Analysis' },
    { value: '3821', label: 'COMP3821  Extended Algorithm Design and Analysis' },
    { value: '4128', label: 'COMP4128  Programming Challenges' },
  ];

  // useEffect(() => {
  //   const fetchCourses = async () => {
  //     try {
  //       const response = await axios.get<{ courses: Array<{ courseName: string; courseId: number }> }>(
  //         "/user_institution/courses",
  //         { withCredentials: true } // Send session cookie
  //       );
  //       const options = response.data.courses.map((course) => ({
  //         value: course.courseId.toString(),
  //         label: course.courseName,
  //       }));
  //       setCourseOptions(options);
  //     } catch (error) {
  //       console.error("Failed to fetch courses:", error);
  //     }
  //   };

  //   fetchCourses();
  // }, []);


  function isButtonDisabled(): boolean | undefined {
    const { courses, nationalPrizes, internationalPrizes, regional, degreeYear } = formData;
    console.log(hasNationalPrize)
    console.log(nationalPrizes)
    return (
      courses.length === 0 ||
      hasNationalPrize === undefined ||
      (hasNationalPrize && nationalPrizes === "") ||
      hasInternationalPrize === undefined ||
      (hasInternationalPrize && internationalPrizes === "") ||
      (degreeYear !== 1 && regional === undefined)
    );
  }

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
            onChange={(selectedValues) => setFormData({ ...formData, courses: selectedValues })}
            label={
              <>
                University Courses Completed
                <Asterisk>*</Asterisk>
              </>
            }
            descriptor="Please select the courses you have completed"
            showOther={false}
          />

          <TextInput
            label="Codeforces Score"
            placeholder="Please enter"
            type="numeric"
            required={false}
            value={formData.codeforce?.toString() || ''} 
            onChange={(e) => {
              const value = e.target.value;
              setFormData({ ...formData, codeforce: Number(value)});
            }}
            width="100%" 
            descriptor="Please enter your current Codeforce score if applicable"
          />

          {formData.degreeYear.toString() !== "1" && (
            <RadioButton
            label="ICPC Regional Participation"
            options={['Yes', 'No']}
            selectedOption={
              formData.regional === undefined ? '' : formData.regional ? 'Yes' : 'No'
            }
            onOptionChange={(e) => {
              const regional = e.target.value === 'Yes';
              setFormData({ ...formData, regional: regional });
            }}
            required={true}
            descriptor="Have you ever competed in a regional ICPC round?"
            width="100%"
           />
          )}

          <RadioButton
            label="National Olympiad Prizes in Mathematics or Informatics"
            options={['Yes', 'No']}
            selectedOption={
              hasNationalPrize === undefined ? '' : hasNationalPrize ? 'Yes' : 'No'
            }
            onOptionChange={(e) => {
              const nationalPrize = e.target.value === 'Yes';
              setHasNationalPrize(nationalPrize);
            }}
            required={true}
            descriptor="Have you ever won any related National Olympiad in Mathematics or Informatics prizes?"
            width="100%"
          />

          {hasNationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related National Olympiad prizes you may have (NOI, AIO, VNOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.nationalPrizes || ""}
              onChange={(e) => setFormData({ ...formData, nationalPrizes: e.target.value })}
              width="100%"
            />
          )}

          <RadioButton
            label="International Olympiad Prizes in Mathematics or Informatics"
            options={['Yes', 'No']}
            selectedOption={
              hasInternationalPrize === undefined ? '' : hasInternationalPrize ? 'Yes' : 'No'
            }
            onOptionChange={(e) => {
              const internationalPrize = e.target.value === 'Yes';
              setHasInternationalPrize(internationalPrize);
            }}
            required={true}
            descriptor="Have you ever won any related International Olympiad prizes?"
            width="100%"
          />

          {hasInternationalPrize && (
            <DescriptiveTextInput
              descriptor="Please enter any related International Olympiad prizes you may have (IOI, APIO, CEOI, etc) separated by commas"
              placeholder="Please type"
              required={false}
              value={formData.internationalPrizes || ""}
              onChange={(e) => setFormData({ ...formData, internationalPrizes: e.target.value })}
              width="100%"
            />
          )}

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button $disabled={isButtonDisabled()} onClick={handleRegister}>Register</Button>
          </ButtonContainer>

        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
