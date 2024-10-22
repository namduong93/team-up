import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompCreationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../../utility/request";

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
`

const Title = styled.h1`
  margin-bottom: 20px;
  margin-top: 30px;
`;

const Label = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 18px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  width: 100%;
`;

const HalfText = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.regular};
  width: 45%;
`;

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`;

const Text = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 20px;
  margin-top: 10px;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  width: 100%;
`;


const LocationList = styled.div`
  display: grid;
  width: 60%;
  grid-template-columns: repeat(2, 1fr);
  margin-top: 20px;
  gap: 10px;
`;

const LocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center; 
  font-style: ${({ theme }) => theme.fonts.style};
  margin-top: 20px;
  margin-bottom: 20px;
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
  min-width: 80px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight)};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

interface University {
  id: number;
  name: string;
}

interface SiteLocation {
  universityId: number;
  defaultSite: string;
}

interface OtherSiteLocation {
  universityName: string;
  defaultSite: string;
}

interface CompetitionInformation {
  name: string;
  earlyBirdDate: string;
  earlyBirdTime: string;
  generalDate: string;
  generalTime: string;
  code: string;
  siteLocations: SiteLocation[];
  otherSiteLocations: OtherSiteLocation[];
}

interface LocationState {
  competitionInfo: CompetitionInformation;
  optionDisplayList: Array<{ value: string, label: string, defaultSite: string }>;
}

export const CompetitionConfirmation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { competitionInfo, optionDisplayList } = location.state as LocationState|| {};
  const [institutionOptions, setInstitutionOptions] = useState<{ value: number; label: string; }[]>([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>('/universities/list');
        const universities = response.data;
  
        const options = universities.universities.map((university) => ({
          value: university.id,
          label: university.name,
        }));
  
        setInstitutionOptions(options); 
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
  
    fetchUniversities();
  }, []);

  const handleBack = () => {
    navigate("/competition/create", { state: { competitionInfo, optionDisplayList } });
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { name, earlyBirdDate, earlyBirdTime, generalDate, generalTime, code, siteLocations, otherSiteLocations } = competitionInfo;
    const payload = {
      name,
      earlyRegDeadline: `${earlyBirdDate}T${earlyBirdTime}:00`,
      generalRegDeadline: `${generalDate}T${generalTime}:00`,
      code,
      siteLocations: siteLocations.map(location => ({
        universityId: location.universityId, 
        name: location.defaultSite, 
      })),
      otherSiteLocations: otherSiteLocations.map(location => ({
        universityName: location.universityName, 
        name: location.defaultSite, 
      })),
    };

    try {
      const response = await sendRequest.post<{competitionId: number }>('/competition/system_admin/create', payload);
      console.log("Response:", response.data);

      const compId = response.data.competitionId;
      navigate(`/competition/page/${compId}`); 

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

  return (
    <FlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <CompCreationProgressBar progressNumber={1} />
      <Container>
        <ContentContainer>
          <Title>Competition Details Confirmation</Title>

          <Label>Competition Name</Label>
          <Text><em>{competitionInfo?.name}</em></Text>

          <Label>Early Bird Registration Deadline</Label>

          <DoubleInputContainer>
            <HalfText>Date</HalfText>
            <HalfText>Time</HalfText>
          </DoubleInputContainer>

          <DoubleInputContainer>
            <HalfText><em>{competitionInfo?.earlyBirdDate}</em></HalfText>
            <HalfText><em>{competitionInfo?.earlyBirdTime}</em></HalfText>
          </DoubleInputContainer>

          <Label>General Registration Deadline</Label>

          <DoubleInputContainer>
            <HalfText>Date</HalfText>
            <HalfText>Time</HalfText>
          </DoubleInputContainer>

          <DoubleInputContainer>
            <HalfText><em>{competitionInfo?.generalDate}</em></HalfText>
            <HalfText><em>{competitionInfo?.generalTime}</em></HalfText>
          </DoubleInputContainer>

          <Label>Competition Code</Label>
          <Text><em>{competitionInfo?.code}</em></Text>

          <Label>Site Locations</Label>

          <LocationList>
            {optionDisplayList.map((displayObject, index) => {
              console.log(institutionOptions)
              return (
                <LocationItem key={index}>
                  <div>{displayObject.label}</div>
                  <div>{displayObject.defaultSite}</div>
                </LocationItem>
              );
            })}
          </LocationList>

          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </ButtonContainer>

        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
