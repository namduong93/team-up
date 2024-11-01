import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styled } from "styled-components";
import { FlexBackground } from "../../../components/general_utility/Background";
import DropdownInput from "../../../components/general_utility/DropDownInput";
import TextInput from "../../../components/general_utility/TextInput";
import { AdvancedDropdown } from "../../../components/AdvancedDropdown/AdvancedDropdown";
import { sendRequest } from "../../../utility/request";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import { CompetitionSite } from "../../../../shared_types/Competition/CompetitionSite";
import MultiRadio from "../../../components/general_utility/MultiRadio";

interface StaffRegistration {
  role: string[];
  capacity?: number;
  site?: string;
  institution?: string;
  competitionBio?: string;
}

interface University {
  id: string;
  name: string;
}

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
    { value: "Coach", label: "Coach" },
    { value: "Site Coordinator", label: "Site Coordinator" },
    { value: "Administrator", label: "Administrator" },
  ];

  const [staffRegistrationData, setStaffRegistrationData] =
    useState<StaffRegistration>({
      role: [],
      capacity: undefined,
      site: "",
      institution: "",
      competitionBio: "",
    });

  const [siteOptions, setSiteOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);
  const [universityOptions, setUniversityOptions] = useState<
    Array<{ value: string; label: string }>
  >([]);

  const [currentUniversityOption, setCurrentUniversityOption] = useState({
    value: "",
    label: "",
  });
  const [currentSiteOption, setCurrentSiteOption] = useState({
    value: "",
    label: "",
  });

  // adjust to site
  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>(
          "/universities/list"
        );
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: String(university.id), // String conversion needed since backend sends as number
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
      } catch (error: unknown) {}
    };

    fetchUniversities();
    fetchSites();
  }, []);

  const isButtonDisabled = () => {
    console.log(staffRegistrationData);
    const { role, capacity, site, institution } = staffRegistrationData;
    return (
      role.length === 0 ||
      (role.includes("Coach") && institution === "" && site === "") ||
      (role.includes("Site Coordinator") &&
        site === "" &&
        capacity === undefined)
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // add the site or institution
    if (
      staffRegistrationData.role.includes("Coach") ||
      staffRegistrationData.role.includes("Site Coordinator")
    ) {
      setStaffRegistrationData({
        ...staffRegistrationData,
        site: currentSiteOption.value,
      });
    }
    if (staffRegistrationData.role.includes(""))
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
          selectedValues={staffRegistrationData.role}
          onChange={(selectedValues) =>
            setStaffRegistrationData({
              ...staffRegistrationData,
              role: selectedValues,
            })
          }
          label={
            <Label>
              Role<Asterisk>*</Asterisk>
            </Label>
          }
          showOther={false}
        />

        {(staffRegistrationData.role.includes("Coach") ||
          staffRegistrationData.role.includes("Site Coordinator")) && (
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
                optionsState={[siteOptions, setSiteOptions]}
                setCurrentSelected={setCurrentSiteOption}
                style={{ width: "100%", marginBottom: 20 }}
              />
            </div>
          </>
        )}

        {staffRegistrationData.role.includes("Site Coordinator") && (
          <>
            <TextInput
              label="Capacity Constraints"
              descriptor="Please enter the capacity constraints of your selected location"
              placeholder="Please enter"
              type="numeric"
              required={true}
              value={staffRegistrationData.capacity?.toString() || ""}
              onChange={(e) => {
                const value = e.target.value;
                setStaffRegistrationData({
                  ...staffRegistrationData,
                  capacity: Number(value),
                });
              }}
              width="100%"
            />
          </>
        )}

        {staffRegistrationData.role.includes("Coach") && (
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
