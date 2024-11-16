import { FC, useEffect, useState } from "react";
import { CompetitionInformation } from "../../../../../../shared_types/Competition/CompetitionDetails";
import { useLocation, useNavigate } from "react-router-dom";
import { sendRequest } from "../../../../../utility/request";
import { StyledFlexBackground } from "../../../../../components/general_utility/Background";
import { CompCreationProgressBar } from "../../../../../components/progress_bar/ProgressBar";
import {
  StyledButton,
  StyledButtonContainer,
  StyledContainer,
  StyledContentContainer,
  StyledDoubleInputContainer,
  StyledHalfText,
  StyledLabel,
  StyledLocationItem,
  StyledLocationList,
  StyledText,
  StyledTitle,
} from "./CompDataConfirmation.styles";

interface University {
  id: number;
  name: string;
}

interface LocationState {
  competitionInfo: CompetitionInformation;
  optionDisplayList: Array<{
    value: string;
    label: string;
    defaultSite: string;
  }>;
}

/**
 * `CompDataConfirmation` is a React web page form component that displays a confirmation page for reviewing and finalizing
 * competition details during the creation process. It provides navigation options to edit the information or confirm
 * and submit the competition data to the backend.
 *
 * @returns JSX.Element - A styled container presenting the previously entered competition details.
 */
export const CompDataConfirmation: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { competitionInfo, optionDisplayList } =
    (location.state as LocationState) || {};
  const [institutionOptions, setInstitutionOptions] = useState<
    { value: number; label: string }[]
  >([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
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
    navigate("/competition/create", {
      state: { competitionInfo, optionDisplayList },
    });
  };

  // packages the information and sends to the backend for storage
  const handleConfirm = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    const {
      name,
      earlyRegDeadline,
      generalRegDeadline,
      startDate,
      region,
      code,
      siteLocations,
      otherSiteLocations,
    } = competitionInfo;
    const payload = {
      name,
      earlyRegDeadline,
      generalRegDeadline,
      startDate,
      region: region,
      code,
      siteLocations: siteLocations.map((location) => ({
        universityId: location.universityId,
        defaultSite: location.defaultSite,
      })),
      otherSiteLocations: (otherSiteLocations || []).map((location) => ({
        universityName: location.universityName,
        defaultSite: location.defaultSite,
      })),
    };
    try {
      const response = await sendRequest.post<{ competitionId: number }>(
        "/competition/system_admin/create",
        payload
      );
      console.log("Response:", response.data);

      const compId = response.data.competitionId;
      navigate(`/competition/page/${compId}`, {
        state: { isSuccessPopUpOpen: true },
      });
    } catch (error) {
      console.error("Error creating competition:", error);
    }
  };

  return (
    <StyledFlexBackground
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <CompCreationProgressBar progressNumber={1} />
      <StyledContainer>
        <StyledContentContainer>
          <StyledTitle>Competition Details Confirmation</StyledTitle>

          <StyledLabel>Competition Name</StyledLabel>
          <StyledText>
            <em>{competitionInfo?.name}</em>
          </StyledText>

          <StyledLabel>Competition Region</StyledLabel>
          <StyledText>
            <em>{competitionInfo?.region}</em>
          </StyledText>

          <StyledLabel>Competition Start</StyledLabel>
          <StyledDoubleInputContainer>
            <StyledHalfText>Date</StyledHalfText>
            <StyledHalfText>Time</StyledHalfText>
          </StyledDoubleInputContainer>

          <StyledDoubleInputContainer margin={true}>
            <StyledHalfText>
              <em>{competitionInfo.startDate.toDateString()}</em>
            </StyledHalfText>
            <StyledHalfText>
              <em>{competitionInfo.startDate.toLocaleTimeString()}</em>
            </StyledHalfText>
          </StyledDoubleInputContainer>

          {competitionInfo?.earlyRegDeadline && (
            <>
              <StyledLabel>Early Bird Registration Deadline</StyledLabel>

              <StyledDoubleInputContainer>
                <StyledHalfText>Date</StyledHalfText>
                <StyledHalfText>Time</StyledHalfText>
              </StyledDoubleInputContainer>

              <StyledDoubleInputContainer margin={true}>
                <StyledHalfText>
                  <em>{`${competitionInfo.earlyRegDeadline.toDateString()}`}</em>
                </StyledHalfText>
                <StyledHalfText>
                  <em>{`${competitionInfo.earlyRegDeadline.toLocaleTimeString()}`}</em>
                </StyledHalfText>
              </StyledDoubleInputContainer>
            </>
          )}

          <StyledLabel>General Registration Deadline</StyledLabel>

          <StyledDoubleInputContainer>
            <StyledHalfText>Date</StyledHalfText>
            <StyledHalfText>Time</StyledHalfText>
          </StyledDoubleInputContainer>

          <StyledDoubleInputContainer margin={true}>
            <StyledHalfText>
              <em>{`${competitionInfo?.generalRegDeadline.toDateString()}`}</em>
            </StyledHalfText>
            <StyledHalfText>
              <em>{`${competitionInfo?.generalRegDeadline.toLocaleTimeString()}`}</em>
            </StyledHalfText>
          </StyledDoubleInputContainer>

          <StyledLabel>Competition Code</StyledLabel>
          <StyledText>
            <em>{competitionInfo?.code}</em>
          </StyledText>

          <StyledLabel>Site Locations</StyledLabel>

          <StyledLocationList>
            {optionDisplayList.map((displayObject, index) => {
              console.log(institutionOptions);
              return (
                <StyledLocationItem key={index}>
                  <div>{displayObject.label}</div>
                  <div>{displayObject.defaultSite}</div>
                </StyledLocationItem>
              );
            })}
          </StyledLocationList>

          <StyledButtonContainer>
            <StyledButton onClick={handleBack}>Back</StyledButton>
            <StyledButton onClick={handleConfirm}>Confirm</StyledButton>
          </StyledButtonContainer>
        </StyledContentContainer>
      </StyledContainer>
    </StyledFlexBackground>
  );
};
