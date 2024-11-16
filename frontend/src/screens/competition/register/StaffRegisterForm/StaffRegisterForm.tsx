/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";
import { StaffRegistration, University } from "../../../../../shared_types/Competition/registration/StaffRegistration";
import { sendRequest } from "../../../../utility/request";
import { CompetitionSite } from "../../../../../shared_types/Competition/CompetitionSite";
import { StyledFlexBackground } from "../../../../components/general_utility/Background";
import { StyledAsterisk, StyledButton, StyledButtonContainer, StyledFormContainer, StyledLabel, StyledTitle } from "./StaffRegisterForm.styles";
import MultiRadio from "../../../../components/general_utility/MultiRadio";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import TextInput from "../../../../components/general_utility/TextInput";
import DescriptiveTextInput from "../../../../components/general_utility/DescriptiveTextInput";

export const StaffRegisterForm: FC = () => {
  const { code } = useParams();
  const navigate = useNavigate();

  const staffOptions = [
    { value: CompetitionRole.Coach, label: "Coach" },
    { value: CompetitionRole.SiteCoordinator, label: "Site Coordinator" },
    { value: CompetitionRole.Admin, label: "Administrator" },
  ];

  const [staffRegistrationData, setStaffRegistrationData] =
    useState<StaffRegistration>({
      roles: [],
      site: {
        id: 0,
        name: "",
        capacity: undefined,
      },
      institution: {
        id: 0,
        name: "",
      },
      competitionBio: "",
    });

  const [siteOptions, setSiteOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [, setUniversityOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [currentSiteOption, setCurrentSiteOption] = useState({
    value: "",
    label: "",
  });
  const [currentUniversityOption] = useState({
    value: "",
    label: "",
  });

  // Use useEffect to watch for changes in currentSiteOption
  useEffect(() => {
    if (currentSiteOption.label) {
      setStaffRegistrationData((prev) => ({
        ...prev,
        site: {
          id:
            currentSiteOption.label === ""
              ? 0
              : currentSiteOption.value === ""
              ? -1
              : Number(currentSiteOption.value),
          name: currentSiteOption.label,
        },
      }));
    }
  }, [currentSiteOption]);

  // Use useEffect to watch for changes in currentUniversityOption
  useEffect(() => {
    if (currentUniversityOption.value) {
      setStaffRegistrationData((prev) => ({
        ...prev,
        institution: {
          id:
            currentUniversityOption.value !== ""
              ? Number(currentUniversityOption.value)
              : 0,
          name: currentUniversityOption.label,
        },
      }));
    }
  }, [currentUniversityOption]);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: String(university.id),
          label: university.name,
        }));

        setUniversityOptions(options);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    const fetchSites = async () => {
      try {
        const response = await sendRequest.get<{
          sites: Array<CompetitionSite>;
        }>("/competition/sites_code", { code });
        const { sites } = response.data;
        setSiteOptions(
          sites.map((site) => ({ value: String(site.id), label: site.name }))
        );
      } catch (error: unknown) {
        console.error("Error fetching sites:", error);
      }
    };

    fetchUniversities();
    fetchSites();
  }, []);

  const isButtonDisabled = () => {
    console.log(staffRegistrationData);
    const { roles: role, competitionBio, site: site } = staffRegistrationData;
    if (role.length === 0) {
      return true;
    }

    if (role.includes(CompetitionRole.Coach)) {
      if (competitionBio === "") {
        return true;
      }
    }

    if (role.includes(CompetitionRole.SiteCoordinator)) {
      if (
        staffRegistrationData.site?.id === 0 ||
        site?.capacity === 0 ||
        site?.capacity === undefined
      ) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      sendRequest.post("/competition/staff/join", {
        code,
        staffRegistrationData,
      });
    } catch (error: unknown) {
      console.error("Error submitting staff registration:", error);
    }

    navigate("/dashboard", { state: { isStaffRegoPopUpOpen: true } });
  };

  return (
    <StyledFlexBackground
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
      data-test-id="staff-register-form--StyledFlexBackground-0">
      <StyledFormContainer
        onSubmit={handleSubmit}
        data-test-id="staff-register-form--StyledFormContainer-0">
        <StyledTitle data-test-id="staff-register-form--StyledTitle-0">Staff Registration</StyledTitle>
        <MultiRadio
          options={staffOptions}
          selectedValues={staffRegistrationData.roles}
          onChange={(selectedValues) => {
            setStaffRegistrationData((prevData) => {
              const updatedData = {
                ...prevData,
                roles: selectedValues as CompetitionRole[],
              };

              if (!selectedValues.includes(CompetitionRole.Coach)) {
                updatedData.competitionBio = "";
              }

              if (!selectedValues.includes(CompetitionRole.SiteCoordinator)) {
                updatedData.site = { id: 0, name: "", capacity: undefined };
              }

              return updatedData;
            });
          }}
          label={
            <StyledLabel data-test-id="staff-register-form--StyledLabel-0">Role<StyledAsterisk data-test-id="staff-register-form--StyledAsterisk-0">*</StyledAsterisk>
            </StyledLabel>
          }
          showOther={false}
        />
        {staffRegistrationData.roles.includes(
          CompetitionRole.SiteCoordinator
        ) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <StyledLabel data-test-id="staff-register-form--StyledLabel-1">Site Overseeing<StyledAsterisk data-test-id="staff-register-form--StyledAsterisk-1">*</StyledAsterisk>
              </StyledLabel>
              <AdvancedDropdown
                isExtendable={true}
                optionsState={[siteOptions, setSiteOptions]}
                setCurrentSelected={setCurrentSiteOption}
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>

            <TextInput
              label="Capacity Constraints"
              descriptor="Please enter the capacity constraints of your selected location"
              placeholder="Please enter"
              type="numeric"
              required={true}
              value={staffRegistrationData.site?.capacity?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setStaffRegistrationData((prev) => ({
                  ...prev,
                  site: {
                    ...prev.site,
                    id: prev.site?.id || 0,
                    name: prev.site?.name || "",
                    capacity: value === "" ? 0 : Number(value),
                  },
                }));
              }}
              width="100%"
            />
          </>
        )}
        {staffRegistrationData.roles.includes(CompetitionRole.Coach) && (
          <>
            <DescriptiveTextInput
              label="Competition Biography"
              descriptor="Please write a short description about yourself that would help participants get to know you"
              placeholder="Enter a description"
              required={true}
              value={staffRegistrationData.competitionBio || ""}
              onChange={(e) =>
                setStaffRegistrationData({
                  ...staffRegistrationData,
                  competitionBio: e.target.value,
                })
              }
              width="100%"
            />
          </>
        )}
        <StyledButtonContainer data-test-id="staff-register-form--StyledButtonContainer-0">
          <StyledButton
            onClick={() => navigate("/dashboard")}
            data-test-id="staff-register-form--StyledButton-0">Back</StyledButton>
          <StyledButton
            type="submit"
            disabled={isButtonDisabled()}
            data-test-id="staff-register-form--StyledButton-1">Register</StyledButton>
        </StyledButtonContainer>
      </StyledFormContainer>
    </StyledFlexBackground>
  );
};
