import { FC, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompCreationProgressBar } from "../../components/general_utility/ProgressBar";
import TextInput from "../../components/general_utility/TextInput";
import TextInputLight from "../../components/general_utility/TextInputLight";
import { useNavigate } from "react-router-dom";
import SiteLocationForm from "./SiteLocationForm";

const Container = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const FormContainer = styled.form`
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

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
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

const LocationList = styled.div`
  display: grid;
  width: 60%;
  grid-template-columns: 1fr 1fr auto;
  margin-top: 20px;
`;

const LocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center; 
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 18px; 
  color: #ccc;
  margin-left: 30px;

  &:hover {
    color: #ff0000; 
  }
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

export const CompetitionDetails: FC = () => {
  const navigate = useNavigate();

  const [competitionInfo, setCompetitionInfo] = useState<CompetitionInformation>({
    name: "",
    earlyBirdDate: "",
    earlyBirdTime: "",
    generalDate: "",
    generalTime: "",
    siteLocations: [],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompetitionInformation
  ) => {
    setCompetitionInfo({ ...competitionInfo, [field]: e.target.value });
  };

  const handleAddSiteLocation = (location: SiteLocation) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: [...prev.siteLocations, location],
    }));
  };

  const handleDeleteSiteLocation = (index: number) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: prev.siteLocations.filter((_, i) => i !== index),
    }));
  };

  const isButtonDisabled = () => {
    const { name, earlyBirdDate, earlyBirdTime, generalDate, generalTime, siteLocations } = competitionInfo;
    return (
      name !== '' ||
      earlyBirdDate === '' ||
      earlyBirdTime === '' ||
      generalDate === '' ||
      generalTime === '' ||
      siteLocations.length > 0
    );
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    navigate("/competitionconfirmation", {state: { competitionInfo }});
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
      <CompCreationProgressBar progressNumber={0} />
      <Container>
        <FormContainer onSubmit={handleSubmit}>
          <Title>Competition Details</Title>

          <TextInput
            label="Competition Name"
            placeholder="Please type"
            type="text"
            required={true}
            value={competitionInfo.name}
            onChange={(e) => handleChange(e, "name")}
            width="100%"
          />

          <Label>Early Bird Registration Deadline</Label>

          <DoubleInputContainer>
            <TextInputLight
              label="Date"
              placeholder="dd/mm/yyyy"
              type="date"
              required={true}
              value={competitionInfo.earlyBirdDate}
              onChange={(e) => handleChange(e, "earlyBirdDate")}
              width="45%"
            />

            <TextInputLight
              label="Time"
              placeholder="hh:mm"
              type="time"
              required={true}
              value={competitionInfo.earlyBirdTime}
              onChange={(e) => handleChange(e, "earlyBirdTime")}
              width="45%"
            />
          </DoubleInputContainer>

          <Label>General Registration Deadline</Label>

          <DoubleInputContainer>
            <TextInputLight
              label="Date"
              placeholder="dd/mm/yyyy"
              type="date"
              required={true}
              value={competitionInfo.generalDate}
              onChange={(e) => handleChange(e, "generalDate")}
              width="45%"
            />

            <TextInputLight
              label="Time"
              placeholder="hh:mm"
              type="time"
              required={true}
              value={competitionInfo.generalTime}
              onChange={(e) => handleChange(e, "generalTime")}
              width="45%"
            />
          </DoubleInputContainer>

          <SiteLocationForm onAddLocation={handleAddSiteLocation} />

          <LocationList>
            {competitionInfo.siteLocations.map((location, index) => (
              <LocationItem key={index}>
                <div>{location.university}</div>
                <div>{location.defaultSite}</div>
                <DeleteIcon onClick={() => handleDeleteSiteLocation(index)}>x</DeleteIcon> 
              </LocationItem>
            ))}
          </LocationList>

          <ButtonContainer>
            <Button onClick={() => navigate("/dashboard")}>Back</Button>
            <Button type="submit" disabled={isButtonDisabled()}>Next</Button>
          </ButtonContainer>
        </FormContainer>
      </Container>
    </FlexBackground>
  );
};
