import { useEffect, useState } from "react";
import { sendRequest } from "../../../../../../../utility/request";
import { StyledAddButton, StyledAddButtonContainer, StyledContainer, StyledDoubleInputContainer, StyledTitle } from "./SiteLocationDataInput.styles";
import { StyledLabel } from "../../CompDataInput.styles";
import { AdvancedDropdown } from "../../../../../../../components/AdvancedDropdown/AdvancedDropdown";
import TextInputLight from "../../../../../../../components/general_utility/TextInputLight";


// pass the a boolean too and receive on CompDetails
interface SiteLocationFormProps {
  onAddLocation: (currentOption: {
    value: string;
    label: string;
}, defaultSite: string) => void;
}

interface University {
  id: string;
  name: string;
}
 
const SiteLocationDataInput: React.FC<SiteLocationFormProps> = ({ onAddLocation }) => {
  const [defaultSite, setDefaultSite] = useState('');
  const [institutionOptions, setInstitutionOptions] = useState<Array<{ value: string, label: string }>>([]);

  const [currentOption, setCurrentOption] = useState({ value: '', label: '' });

  const handleAddLocation = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (currentOption.label) {
      onAddLocation(currentOption, defaultSite);
    }
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>('/universities/list');
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: String(university.id), // String conversion needed since backend sends as number
          label: university.name,
        }));

        setInstitutionOptions(options);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  return (
    <StyledContainer>
      <StyledTitle>Site Locations</StyledTitle>
      <StyledDoubleInputContainer>
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <StyledLabel>
            Institution
          </StyledLabel>
          <AdvancedDropdown
            setCurrentSelected={setCurrentOption}
            optionsState={[institutionOptions, setInstitutionOptions]}
            style={{ width: '100%' }}
          />
        </div>

        <TextInputLight
          label="Default Site Location"
          placeholder="Please type"
          type="text"
          required={false}
          value={defaultSite}
          onChange={(e) => setDefaultSite(e.target.value)}
          width="45%"
        />
      </StyledDoubleInputContainer>

      <StyledAddButtonContainer>
        <StyledAddButton onClick={handleAddLocation}>+</StyledAddButton>
      </StyledAddButtonContainer>

    </StyledContainer>
  );
};

export default SiteLocationDataInput;
