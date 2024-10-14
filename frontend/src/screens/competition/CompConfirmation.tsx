import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompCreationProgressBar } from "../../components/general_utility/ProgressBar";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../utility/request";

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
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
  font-family: Arial, Helvetica, sans-serif;
  font-size: 18px;
  font-weight: bold;
  width: 100%;
`;

const HalfText = styled.label`
  display: block;
  text-align: left;
  margin-bottom: 0.5rem;
  margin-top: 10px;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: normal;
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
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  width: 100%;
`;


const LocationList = styled.div`
  display: grid;
  width: 60%;
  grid-template-columns: 1fr 1fr auto;
  margin-top: 20px;
  gap: 10px;
`;

const LocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center; 
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
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ disabled }) => (disabled ? "#ccc" : "#6688D2")};
  margin-top: 35px;
  margin-bottom: 40px;
  color: #ffffff;
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: Arial, Helvetica, sans-serif;
`;

interface University {
  id: string;
  name: string;
}

interface SiteLocation {
  university: string;
  defaultSite: string;
}

interface CompetitionInformation {
  name: string;
  earlyBirdDate: string;
  earlyBirdTime: string;
  generalDate: string;
  generalTime: string;
  siteLocations: SiteLocation[];
}

interface LocationState {
  competitionInfo: CompetitionInformation;
}

export const CompetitionConfirmation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const { competitionInfo } = location.state as LocationState|| {};
  const [institutionOptions, setInstitutionOptions] = useState<{ value: string; label: string; }[]>([]);

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
    navigate("/competition/create", { state: { competitionInfo } });
  };

  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const { name, earlyBirdDate, earlyBirdTime, generalDate, generalTime, siteLocations } = competitionInfo;

    const payload = {
        name,
        earlyRegDeadline: `${earlyBirdDate}T${earlyBirdTime}:00`,
        generalRegDeadline: `${generalDate}T${generalTime}:00`, 
        siteLocations: siteLocations.map(location => ({
          universityId: location.university, 
          name: location.defaultSite, 
        })),
    };

    try {
      const response = await sendRequest.post('/competition/system_admin/create', payload);
      console.log("Response:", response.data);

      navigate("/admin/page"); 

      // TO-DO: uncomment when pop-up is implemented on Admin Page
      // navigate("/admin/page", { 
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

          <Label>Site Locations</Label>

          <LocationList>
            {competitionInfo?.siteLocations.map((location, index) => {
              const universityName = institutionOptions.find(option => option.value.toString() === location.university)?.label || 'Unknown';
              return (
                <LocationItem key={index}>
                  <div><em>{universityName}</em></div>
                  <div><em>{location.defaultSite}</em></div>
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
