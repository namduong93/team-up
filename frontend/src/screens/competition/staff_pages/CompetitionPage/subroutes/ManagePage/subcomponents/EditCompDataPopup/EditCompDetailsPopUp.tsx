import { FC, ReactNode, useEffect, useState } from "react";
import { CompetitionInformation } from "../../../../../../../../../shared_types/Competition/CompetitionDetails";
import { useLocation } from "react-router-dom";
import { dateToUTC, formatDate } from "../../../../../creation/util/formatDate";
import { useTheme } from "styled-components";
import { StyledButtonContainer, StyledCloseButton, StyledDeleteIcon, StyledDescriptor, StyledEditorContainer, StyledLabel, StyledLocationItem, StyledLocationList, StyledModal, StyledModalOverlay, StyledRowContainer2, StyledTitle2 } from "./EditCompDataPopup.styles";
import { FaSave, FaTimes } from "react-icons/fa";
import ReactMarkdownEditorLite from "react-markdown-editor-lite";
import "react-markdown-editor-lite/lib/index.css";
// import MarkdownIt from "markdown-it";
import { defaultCompInformation } from "../../../../../../register/RegisterForm/subroutes/CompInformation/CompInformation";
import TextInput from "../../../../../../../../components/general_utility/TextInput";
import { StyledDoubleInputContainer } from "../../../../../creation/CompDataInput/CompDataInput.styles";
import TextInputLight from "../../../../../../../../components/general_utility/TextInputLight";
import SiteLocationForm from "../../../../../creation/CompDataInput/subcomponents/SiteLocationDataInput/SiteLocationForm";
import { TransparentResponsiveButton } from "../../../../../../../../components/responsive_fields/ResponsiveButton";
import MarkdownIt from "markdown-it";

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

  const otherSiteLocations = competitionInfo.otherSiteLocations || [];

  const [startDateInput, setStartDateInput] = useState<Date | undefined>();
  const [earlyRegInput, setEarlyRegInput] = useState<Date | undefined>();
  const [generalRegInput, setGeneralRegInput] = useState<Date | undefined>();

  useEffect(() => {
    const { startDate, earlyRegDeadline, generalRegDeadline } = competitionInfo;
    setStartDateInput(startDate);
    setEarlyRegInput(earlyRegDeadline);
    setGeneralRegInput(generalRegDeadline);
  }, []);

  useEffect(() => {
    if (!startDateInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      startDate: dateToUTC(startDateInput)
    }));
  }, [startDateInput]);

  useEffect(() => {
    if (!earlyRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      earlyRegDeadline: dateToUTC(earlyRegInput)
    }));
  }, [earlyRegInput]);

  useEffect(() => {
    if (!generalRegInput) {
      return;
    }
    setCompetitionInfo((p) => ({
      ...p,
      generalRegDeadline: dateToUTC(generalRegInput)
    }));
  }, [generalRegInput]);


  useEffect(() => {
    const initialDisplayList = [
      ...competitionInfo.siteLocations.map((site) => ({
        value: String(site.universityId),
        label: String(site.universityName),
        defaultSite: site.defaultSite,
      })),
      ...otherSiteLocations.map((otherSite) => ({
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
        { universityId: parseInt(option.value), defaultSite, universityName: option.label },
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
        ...prev.otherSiteLocations || [],
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
      otherSiteLocations.some(
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
        otherSiteLocations: (prev.otherSiteLocations || []).filter(
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

  const handleMarkdownChange = (text: string) => {
    setCompetitionInfo((prev) => ({
      ...prev,
      information: text,
    }));
  };

  const handleSubmit = async (): Promise<boolean> => {
    try {
      
      onSubmit(competitionInfo);
      onClose();

      return true;
    } catch (error) {
      console.error("Error saving competition details:", error);
      return false;
    }
  };

  const theme = useTheme();

  return (
    <StyledModalOverlay>
      <StyledModal>
        <StyledCloseButton onClick={onClose}>
          <FaTimes />
        </StyledCloseButton>

        <StyledTitle2>Edit Competition Details</StyledTitle2>

        <div></div>
        <StyledRowContainer2>
          <div
            style={{
              textAlign: "left",
            }}
          >
            <StyledLabel>Competition Information</StyledLabel>
            <StyledEditorContainer>
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
            </StyledEditorContainer>
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

            <StyledLabel>Competition Start</StyledLabel>

            <StyledDoubleInputContainer>
              <TextInputLight
                label="Date and Time (UTC Timezone)"
                placeholder="dd/mm/yyyy"
                type="datetime-local"
                required={false}
                value={formatDate(startDateInput)}
                onChange={(e) => setStartDateInput(new Date(e.target.value))}
                width="45%"
              />

            </StyledDoubleInputContainer>

            {competitionInfo.earlyRegDeadline && (
              <>
                <StyledLabel>Early Bird Registration Deadline</StyledLabel>
                <StyledDescriptor>
                  Please set the Date and Time of your Early Bird Registration
                  Deadline
                </StyledDescriptor>
                <StyledDoubleInputContainer>
                  <TextInputLight
                    label="Date and Time (UTC Timezone)"
                    placeholder="dd/mm/yyyy"
                    type="datetime-local"
                    required={false}
                    value={formatDate(earlyRegInput)}
                    onChange={(e) => setEarlyRegInput(new Date(e.target.value))}
                    width="45%"
                  />
                </StyledDoubleInputContainer>
              </>
            )}

            <StyledLabel>General Registration Deadline</StyledLabel>
            <StyledDescriptor>
              Please set the Date and Time of your General Registration Deadline
            </StyledDescriptor>

            <StyledDoubleInputContainer>
              <TextInputLight
                label="Date and Time (UTC Timezone)"
                placeholder="dd/mm/yyyy"
                type="datetime-local"
                required={false}
                value={formatDate(generalRegInput)}
                onChange={(e) => setGeneralRegInput(new Date(e.target.value))}
                width="45%"
              />

            </StyledDoubleInputContainer>

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

            <StyledLocationList>
              {optionDisplayList.map((displayObject, index) => {
                return (
                  <StyledLocationItem key={`${displayObject.value}${index}${displayObject.defaultSite}`}>
                    <div>{displayObject.label}</div>
                    <div>{displayObject.defaultSite}</div>
                    <StyledDeleteIcon
                      onClick={() => handleDeleteSiteLocation(displayObject)}
                    >
                      x
                    </StyledDeleteIcon>
                  </StyledLocationItem>
                );
              })}
            </StyledLocationList>
          </div>
        </StyledRowContainer2>

        <StyledButtonContainer>
          <TransparentResponsiveButton
            style={{ height: '33px', backgroundColor: theme.colours.primaryLight, maxWidth: '160px' }}
            icon={<FaSave />}
            actionType="primary"
            label="Save Changes"
            // question="Are you sure you want to change your competition details?"
            onClick={handleSubmit}
          />
        </StyledButtonContainer>
      </StyledModal>
    </StyledModalOverlay>
  );
};
