/* eslint-disable no-irregular-whitespace */
import { FC, useEffect, useState } from "react";
import { FlexBackground } from "../../../components/general_utility/Background";
import { styled } from "styled-components";
import { CompRegistrationProgressBar } from "../../../components/progress_bar/ProgressBar";
import { useNavigate, useParams } from "react-router-dom";
import { MarkdownDisplay } from "../../student/MarkdownDisplay";
import {
  SiteLocation,
  OtherSiteLocation,
} from "../creation/CompDetails";
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

export interface CompetitionDetails {
  id?: number;
  name: string;
  teamSize?: number;
  createdDate: EpochTimeStamp;
  earlyRegDeadline: EpochTimeStamp;
  startDate: EpochTimeStamp;
  generalRegDeadline: EpochTimeStamp;
  siteLocations?: SiteLocation[];
  otherSiteLocations?: OtherSiteLocation[];
  code?: string;
  region: string;
  information: string;
}

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

export const CompetitionInformation: FC = () => {
  const navigate = useNavigate();
  const { code } = useParams<{ code?: string }>();
  const [compInformation, setCompInformation] = useState<string>("");

  useEffect(() => {
    const fetchCompInformation = async () => {
      try {
        const response = await sendRequest.get<{
          competition: CompetitionDetails;
        }>("/competition/details", { compId: code });
        const { competition } = response.data;
        setCompInformation(competition.information);
      } catch (err: unknown) {
        console.error(err);
      }
    }

    fetchCompInformation();
  })

  const handleBack = () => {
    navigate("/dashboard");
  };

  const handleNext = () => {
    navigate(`/competition/individual/${code}`);
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
      <CompRegistrationProgressBar progressNumber={0} />
      <Container>
        <ContentContainer>
          <Title>Competition Information</Title>
          <MarkdownDisplay content={compInformation} />
          <ButtonContainer>
            <Button onClick={handleBack}>Back</Button>
            <Button onClick={handleNext}>Next</Button>
          </ButtonContainer>
        </ContentContainer>
      </Container>
    </FlexBackground>
  );
};
