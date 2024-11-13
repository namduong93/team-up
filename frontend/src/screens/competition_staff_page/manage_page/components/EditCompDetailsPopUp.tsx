import { FC, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import { DoubleInputContainer } from "../../../competition/register/CompIndividual";
import { FaTimes } from "react-icons/fa";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import TextInput from "../../../../components/general_utility/TextInput";
import DropdownInput from "../../../../components/general_utility/DropDownInput";
import moment from "moment-timezone";
import TextInputLight from "../../../../components/general_utility/TextInputLight";
import SiteLocationForm from "../../../competition/creation/components/SiteLocationForm";
import { useLocation } from "react-router-dom";
import {
  CompetitionInformation,
  SiteLocation,
  OtherSiteLocation,
} from "../../../../../shared_types/Competition/CompetitionDetails";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
import MarkdownIt from "markdown-it";
import { defaultCompInformation } from "../../../competition/register/CompInformation";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 5;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 290px;
  max-width: 1100px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: scroll;
  height: 80%;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  position: absolute;
  top: 10px;
  right: 10px;
  font-size: 26px;
  color: #d9534f;
  transition: color 0.2s;

  &:hover {
    color: #c9302c;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60px;
  width: 100%;
`;

const Button = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 50%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};

  &:hover {
    color: ${({ theme, disabled }) =>
      disabled ? theme.fonts.colour : theme.background};
    font-weight: ${({ theme, disabled }) =>
      disabled
        ? theme.fonts.fontWeights.regular
        : theme.fonts.fontWeights.bold};
    background-color: ${({ theme, disabled }) =>
      disabled ? theme.colours.sidebarBackground : theme.colours.primaryDark};
  }
`;

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const RowContainer2 = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: start;
  justify-content: center;
  gap: 60px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 95%;
`;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
  text-align: center;
`;

const Descriptor = styled.div`
  margin-bottom: 5px;
  font-size: 14px;
  color: ${({ theme }) => theme.colours.filterText};
  width: 100%;
`;

const LocationList = styled.div`
  display: grid;
  width: 65%;
  grid-template-columns: 1fr 1fr auto;
  margin-top: 20px;
  gap: 25px;
`;

const LocationItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center;
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
  margin-left: 30px;

  &:hover {
    color: ${({ theme }) => theme.colours.error};
  }
`;

const EditorContainer = styled.div`
  position: relative;
  width: 100%;
  max-height: 800px;
  overflow: auto;
  background-color: ${({ theme }) => theme.background};
  margin-top: 10px;
  margin-bottom: 55px;
  align-self: stretch;
`;

const createTimezoneOptions = () => {
  const timezones = moment.tz.names().map((tz) => ({
    value: tz,
    label: tz.replace(/_/g, " ").replace(/\/(.+)/, " - $1"), // Format label for better readability
  }));

  return [{ value: "", label: "Please Select" }, ...timezones];
};

interface EditCompDetailsProps {
  onClose: () => void;
  competitionInfo: CompetitionInformation;
  setCompetitionInfo: React.Dispatch<
    React.SetStateAction<CompetitionInformation>
  >;
  onSubmit: (competitionInfo: CompetitionInformation) => void;
}

export const EditCompDetailsPopUp: FC<EditCompDetailsProps> = ({
  onClose,
  competitionInfo,
  setCompetitionInfo,
  onSubmit,
}) => {
  const location = useLocation();
  const [locationError, setLocationError] = useState<ReactNode>("");

  const [optionDisplayList, setOptionDisplayList] = useState<
    Array<{ value: string; label: string; defaultSite: string }>
  >([]);

  useEffect(() => {
    const initialDisplayList = [
      ...competitionInfo.siteLocations.map((site) => ({
        value: String(site.universityId),
        label: String(site.universityId),
        defaultSite: site.defaultSite,
      })),
      ...competitionInfo.otherSiteLocations.map((otherSite) => ({
        value: "", // Use empty value for custom sites
        label: otherSite.universityName,
        defaultSite: otherSite.defaultSite,
      })),
    ];

    setOptionDisplayList(initialDisplayList);
  }, [competitionInfo.siteLocations, competitionInfo.otherSiteLocations]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof CompetitionInformation
  ) => {
    setCompetitionInfo({ ...competitionInfo, [field]: e.target.value });
  };

  const addSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: [
        ...prev.siteLocations,
        { universityId: parseInt(option.value), defaultSite },
      ],
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const addOtherSite = (
    option: { value: string; label: string },
    defaultSite: string
  ) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      otherSiteLocations: [
        ...prev.otherSiteLocations,
        { universityName: option.label, defaultSite },
      ],
    }));

    setOptionDisplayList((prev) => [
      ...prev,
      { value: option.value, label: option.label, defaultSite },
    ]);
  };

  const handleAddSiteLocation = (
    currentOption: { value: string; label: string },
    defaultSite: string
  ) => {
    if (!defaultSite) {
      setLocationError(<p>No site name provided</p>);
      return;
    }

    if (
      competitionInfo.siteLocations.some(
        (site) => String(site.universityId) === currentOption.value
      ) ||
      competitionInfo.otherSiteLocations.some(
        (otherSite) => otherSite.universityName === currentOption.label
      )
    ) {
      setLocationError(
        <p>
          You have already entered a default site location for this institution
          <br />
          Please delete your previous entry or select a different institution
        </p>
      );
      return;
    }

    setLocationError("");

    // if currentOptions value is empty which will be the case when it's a custom option.
    if (!currentOption.value) {
      addOtherSite(currentOption, defaultSite);

      return;
    }

    addSite(currentOption, defaultSite);
  };

  const handleDeleteSiteLocation = (deleteObject: {
    value: string;
    label: string;
    defaultSite: string;
  }) => {
    setOptionDisplayList((prev) => [
      ...prev.filter(
        (elem) =>
          !(
            elem.value === deleteObject.value &&
            elem.label === deleteObject.label
          )
      ),
    ]);

    if (!deleteObject.value) {
      setCompetitionInfo((prev) => ({
        ...prev,
        otherSiteLocations: prev.otherSiteLocations.filter(
          (elem) => elem.universityName !== deleteObject.label
        ),
      }));

      return;
    }

    setCompetitionInfo((prev) => ({
      ...prev,
      siteLocations: prev.siteLocations.filter(
        (elem) => elem.universityId !== Number(deleteObject.value)
      ),
    }));
  };

  const handleTimeZoneChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCompetitionInfo({ ...competitionInfo, timeZone: e.target.value });
  };

  const convertToTimezone = (date: string, time: string, timezone: string) => {
    if (!date || !time || !timezone) return "";

    const dateTimeString = `${date} ${time}`;
    return moment.tz(dateTimeString, timezone).format();
  };

  const handleMarkdownChange = (text: string) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      information: text,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      const {
        startDate,
        startTime,
        earlyBirdDate,
        earlyBirdTime,
        generalDate,
        generalTime,
      } = competitionInfo;

      const start = convertToTimezone(
        startDate,
        startTime,
        competitionInfo.timeZone
      );
      const early =
        earlyBirdDate && earlyBirdTime
          ? convertToTimezone(
              earlyBirdDate,
              earlyBirdTime,
              competitionInfo.timeZone
            )
          : "";

      const general = convertToTimezone(
        generalDate,
        generalTime,
        competitionInfo.timeZone
      );

      const updatedCompetitionInfo = {
        ...competitionInfo,
        start,
        early,
        general,
      };

      onSubmit(updatedCompetitionInfo);
      onClose();

      return true;
    } catch (error) {
      console.error("Error saving competition details:", error);
      return false;
    }
  };

  const timezoneOptions = createTimezoneOptions();

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title2>Edit Competition Details</Title2>

        <div></div>
        <RowContainer2>
          <div
            style={{
              textAlign: "left",
            }}
          >
            <Label>Competition Information</Label>
            <EditorContainer>
              <ReactMarkdownEditorLite
                value={competitionInfo.information !== null ? competitionInfo.information : defaultCompInformation}
                onChange={({ text }) => handleMarkdownChange(text)}
                style={{ height: "800px" }}
                renderHTML={(text: string) => MarkdownIt().render(text)}
                config={{
                  placeholder: "Edit your Competition Information here...",
                  toolbar: [
                    "bold",
                    "italic",
                    "strikethrough",
                    "header",
                    "|",
                    "unordered-list",
                    "ordered-list",
                    "quote",
                    "|",
                    "link",
                    "image",
                    "|",
                    "preview",
                    "undo",
                    "redo",
                  ],
                }}
              />
            </EditorContainer>
          </div>

          <div
            style={{
              textAlign: "left",
            }}
          >
            <TextInput
              label="Competition Name"
              placeholder="Please type"
              type="text"
              required={false}
              value={competitionInfo.name}
              onChange={(e) => handleChange(e, "name")}
              width="100%"
            />

            <TextInput
              label="Competition Region"
              placeholder="Please type"
              type="text"
              required={false}
              value={competitionInfo.region}
              onChange={(e) => handleChange(e, "region")}
              width="100%"
              descriptor="Please specify the region your Competition will be held in"
            />

            <DropdownInput
              label="Competition Timezone"
              options={timezoneOptions}
              required={false}
              value={competitionInfo.timeZone}
              onChange={handleTimeZoneChange}
              width="100%"
              descriptor="Please select the timezone for the Competition"
            />
            <Label>Competition Start</Label>

            <DoubleInputContainer>
              <TextInputLight
                label="Date"
                placeholder="dd/mm/yyyy"
                type="date"
                required={false}
                value={competitionInfo.startDate}
                onChange={(e) => handleChange(e, "startDate")}
                width="45%"
              />

              <TextInputLight
                label="Time"
                placeholder="hh:mm"
                type="time"
                required={false}
                value={competitionInfo.startTime}
                onChange={(e) => handleChange(e, "startTime")}
                width="45%"
              />
            </DoubleInputContainer>

            {competitionInfo.earlyBird && (
              <>
                <Label>Early Bird Registration Deadline</Label>
                <Descriptor>
                  Please set the Date and Time of your Early Bird Registration
                  Deadline
                </Descriptor>
                <DoubleInputContainer>
                  <TextInputLight
                    label="Date"
                    placeholder="dd/mm/yyyy"
                    type="date"
                    required={false}
                    value={competitionInfo.earlyBirdDate || ""}
                    onChange={(e) => handleChange(e, "earlyBirdDate")}
                    width="45%"
                  />

                  <TextInputLight
                    label="Time"
                    placeholder="hh:mm"
                    type="time"
                    required={false}
                    value={competitionInfo.earlyBirdTime || ""}
                    onChange={(e) => handleChange(e, "earlyBirdTime")}
                    width="45%"
                  />
                </DoubleInputContainer>
              </>
            )}

            <Label>General Registration Deadline</Label>
            <Descriptor>
              Please set the Date and Time of your General Registration Deadline
            </Descriptor>

            <DoubleInputContainer>
              <TextInputLight
                label="Date"
                placeholder="dd/mm/yyyy"
                type="date"
                required={false}
                value={competitionInfo.generalDate}
                onChange={(e) => handleChange(e, "generalDate")}
                width="45%"
              />

              <TextInputLight
                label="Time"
                placeholder="hh:mm"
                type="time"
                required={false}
                value={competitionInfo.generalTime}
                onChange={(e) => handleChange(e, "generalTime")}
                width="45%"
              />
            </DoubleInputContainer>

            <TextInput
              label="Competition Code"
              placeholder="COMP1234"
              type="text"
              required={false}
              value={competitionInfo.code}
              onChange={(e) => handleChange(e, "code")}
              width="100%"
              descriptor="Please type a unique code that will be used to identify your Competition"
            />

            <SiteLocationForm onAddLocation={handleAddSiteLocation} />

            {locationError && (
              <div
                style={{ color: "red", marginTop: "30px", textAlign: "center" }}
              >
                {locationError}
              </div>
            )}

            <LocationList>
              {optionDisplayList.map((displayObject, index) => {
                return (
                  <LocationItem key={index}>
                    <div>{displayObject.label}</div>
                    <div>{displayObject.defaultSite}</div>
                    <DeleteIcon
                      onClick={() => handleDeleteSiteLocation(displayObject)}
                    >
                      x
                    </DeleteIcon>
                  </LocationItem>
                );
              })}
            </LocationList>
          </div>
        </RowContainer2>

        <ButtonContainer>
          <ResponsiveActionButton
            actionType="primary"
            label="Save Changes"
            question="Are you sure you want to change your competition details?"
            handleSubmit={handleSubmit}
          />
        </ButtonContainer>
      </Modal>
    </ModalOverlay>
  );
};
