import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { FlexBackground } from "../../../components/general_utility/Background";
import TextInput from "../../../components/general_utility/TextInput";
import { AdvancedDropdown } from "../../../components/AdvancedDropdown/AdvancedDropdown";
import { sendRequest } from "../../../utility/request";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import { CompetitionSite } from "../../../../shared_types/Competition/CompetitionSite";
import MultiRadio from "../../../components/general_utility/MultiRadio";
import { StaffRegistration, University } from "../../../../shared_types/Competition/registration/StaffRegistration";
import { CompetitionRole } from "../../../../shared_types/Competition/CompetitionRole";

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

const Asterisk = styled.span`
  color: ${({ theme }) => theme.colours.error};
`;

export const StaffRoleRegistration: FC = () => {
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
  const [universityOptions, setUniversityOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [currentSiteOption, setCurrentSiteOption] = useState({ value: "", label: "" });
  const [currentUniversityOption, setCurrentUniversityOption] = useState({ value: "", label: "" });

  // Use useEffect to watch for changes in currentSiteOption
  useEffect(() => {
    if (currentSiteOption.value) {
      setStaffRegistrationData(prev => ({
        ...prev,
        site: {
          id: currentSiteOption.value !== "" ? Number(currentSiteOption.value) : 0,
          name: currentSiteOption.label,
        }
      }));
    }
  }, [currentSiteOption]);

  // Use useEffect to watch for changes in currentUniversityOption
  useEffect(() => {
    if (currentUniversityOption.value) {
      setStaffRegistrationData(prev => ({
        ...prev,
        institution: {
          id: currentUniversityOption.value !== "" ? Number(currentUniversityOption.value) : 0,
          name: currentUniversityOption.label,
        }
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
    const { roles: role, competitionBio, site: site, institution: institution } = staffRegistrationData;
    console.log(staffRegistrationData);
    if (role.length === 0) {
      return true;
    }

    if (role.includes(CompetitionRole.Coach)) {
      if (
        institution?.id === 0 ||
        site?.id === 0 ||
        competitionBio === ""
      ) {
        return true;
      }
    }

    if (role.includes(CompetitionRole.SiteCoordinator)) {
      if (staffRegistrationData.site?.id === 0 || 
        site?.capacity === 0) {
        return true;
      }
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    //TO-DO: send staffRegistrationData to backend where request will be sent
    // to admin to grant privileges
    try {
      sendRequest.post("/competition/staff/join", {
        code,
        staffRegistrationData,
      });
    }
    catch (error: unknown) {
      console.error("Error submitting staff registration:", error);
    }

    navigate("/dashboard", { state: { isStaffRegoPopUpOpen: true } });
  };

  return (
    <FlexBackground
      style={{
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <FormContainer onSubmit={handleSubmit}>
        <Title>Staff Registration</Title>
        <MultiRadio
          options={staffOptions}
          selectedValues={staffRegistrationData.roles}
          onChange={(selectedValues) =>
            setStaffRegistrationData({
              ...staffRegistrationData,
              roles: selectedValues as CompetitionRole[],
            })
          }
          label={
            <Label>
              Role<Asterisk>*</Asterisk>
            </Label>
          }
          showOther={false}
        />

        {(staffRegistrationData.roles.includes(CompetitionRole.Coach) ||
          staffRegistrationData.roles.includes(
            CompetitionRole.SiteCoordinator
          )) && (
          <>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Label>
                Site Overseeing<Asterisk>*</Asterisk>
              </Label>
              <AdvancedDropdown
                isExtendable={false}
                optionsState={[siteOptions, setSiteOptions]}
                setCurrentSelected={setCurrentSiteOption}
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>
          </>
        )}

        {staffRegistrationData.roles.includes(
          CompetitionRole.SiteCoordinator
        ) && (
          <>
            <TextInput
              label="Capacity Constraints"
              descriptor="Please enter the capacity constraints of your selected location"
              placeholder="Please enter"
              type="numeric"
              required={true}
              value={staffRegistrationData.site?.capacity?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setStaffRegistrationData(prev => ({
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
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "100%",
              }}
            >
              <Label>
                Institution<Asterisk>*</Asterisk>
              </Label>
              <AdvancedDropdown
                isExtendable={false}
                optionsState={[universityOptions, setUniversityOptions]}
                setCurrentSelected={setCurrentUniversityOption}
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>

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

        <ButtonContainer>
          <Button onClick={() => navigate("/dashboard")}>Back</Button>
          <Button type="submit" disabled={isButtonDisabled()}>
            Register
          </Button>
        </ButtonContainer>
      </FormContainer>
    </FlexBackground>
  );
};

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 600px;
  width: 100%;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Title = styled.h1`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Button = styled.button`
  max-width: 150px;
  min-width: 100px;
  width: 25%;
  height: 35px;
  border: 0px;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) =>
    disabled ? theme.colours.optionUnselected : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: bold;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  gap: 90px;
`;
