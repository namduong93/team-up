import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompCreationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../../utility/request";
import { CompetitionInformation } from "../../../../shared_types/Competition/CompetitionDetails";

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
`

const DoubleInputContainer = styled.div<{ margin?: boolean }>`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
  margin-bottom: ${({ margin }) => (margin ? "20px" : "0")};
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

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
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
    console.log(competitionInfo);
    navigate("/competition/create", { state: { competitionInfo, optionDisplayList } });
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { name, earlyRegDeadline, generalRegDeadline, startDate, region, code, siteLocations, otherSiteLocations } = competitionInfo;
    const payload = {
      name,
      earlyRegDeadline,
      generalRegDeadline,
      startDate,
      region: region,
      code,
      siteLocations: siteLocations.map(location => ({
        universityId: location.universityId, 
        defaultSite: location.defaultSite, 
      })),
      otherSiteLocations: (otherSiteLocations || []).map(location => ({
        universityName: location.universityName, 
        defaultSite: location.defaultSite, 
      })),
    };
    console.log(payload)
    try {
      const response = await sendRequest.post<{competitionId: number }>('/competition/system_admin/create', payload);
      console.log("Response:", response.data);

      const compId = response.data.competitionId;
      navigate(`/competition/page/${compId}`, { state: { isSuccessPopUpOpen: true } }); 
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

          <Label>Competition Region</Label>
          <Text><em>{competitionInfo?.region}</em></Text>

          <Label>Competition Start</Label>
          <DoubleInputContainer>
            <HalfText>Date</HalfText>
            <HalfText>Time</HalfText>
          </DoubleInputContainer>

          <DoubleInputContainer margin={true}>
            <HalfText><em>{competitionInfo.startDate.toDateString()}</em></HalfText>
            <HalfText><em>{competitionInfo.startDate.toLocaleTimeString()}</em></HalfText>
          </DoubleInputContainer>

          {competitionInfo?.earlyRegDeadline && (
            <>
            <Label>Early Bird Registration Deadline</Label>

            <DoubleInputContainer>
            <HalfText>Date</HalfText>
            <HalfText>Time</HalfText>
            </DoubleInputContainer>

            <DoubleInputContainer margin={true}>
              <HalfText><em>{`${competitionInfo.earlyRegDeadline.toDateString()}`}</em></HalfText>
              <HalfText><em>{`${competitionInfo.earlyRegDeadline.toLocaleTimeString()}`}</em></HalfText>
            </DoubleInputContainer>
            </>
          )}

          <Label>General Registration Deadline</Label>

          <DoubleInputContainer>
            <HalfText>Date</HalfText>
            <HalfText>Time</HalfText>
            </DoubleInputContainer>

          <DoubleInputContainer margin={true}>
            <HalfText><em>{`${competitionInfo?.generalRegDeadline.toDateString()}`}</em></HalfText>
            <HalfText><em>{`${competitionInfo?.generalRegDeadline.toLocaleTimeString()}`}</em></HalfText>
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
