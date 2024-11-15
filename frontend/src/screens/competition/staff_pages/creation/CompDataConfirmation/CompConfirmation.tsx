import { FC, useEffect, useState } from "react";
import { CompetitionInformation } from "../../../../../../shared_types/Competition/CompetitionDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../../../../utility/request";
import { FlexBackground } from "../../../../../components/general_utility/Background";
import { CompCreationProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import { Button, ButtonContainer, Container, ContentContainer, DoubleInputContainer, HalfText, Label, LocationItem, LocationList, Text, Title } from "./CompDataConfirmation.styles";

interface University {
  id: number;
  name: string;
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
