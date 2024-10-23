import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextInputLight, { Label } from '../../../../components/general_utility/TextInputLight';
// import DropDownInputLight from '../../components/general_utility/DropDownLight';
import { sendRequest } from '../../../../utility/request';
import { AdvancedDropdown } from '../../../../components/AdvancedDropdown/AdvancedDropdown';

const Container = styled.div`
  /* padding: 20px; */
  max-width: 600px;
  width: 100%;
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

const Title = styled.h2`
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  margin-bottom: 0.5rem;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const AddButton = styled.button`
  border: 2px solid ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 50%;
  width: 35px;
  height: 35px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  color: ${({ theme }) => theme.background};
  background-color: ${({ theme }) => theme.fonts.colour};

  &:hover {
    background-color: ${({ theme }) => theme.colours.primaryLight};
    color: ${({ theme }) => theme.fonts.colour};
    border-color: ${({ theme }) => theme.colours.primaryLight};
  }
`;

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
  
`;

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
 
const SiteLocationForm: React.FC<SiteLocationFormProps> = ({ onAddLocation }) => {
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
    <Container>
      <Title>Site Locations</Title>
      <DoubleInputContainer>
        {/* <DropDownInputLight
          label="Institution"
          options={institutionOptions}
          value={university}
          required={false}
          onChange={(e) => setUniversity(e.target.value)}
          width="45%"
        /> */}
        <div style={{ display: 'flex', flexDirection: 'column', width: '45%' }}>
          <Label>
            Institution
          </Label>
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
      </DoubleInputContainer>

      <AddButtonContainer>
        <AddButton onClick={handleAddLocation}>+</AddButton>
      </AddButtonContainer>

    </Container>
  );
};

export default SiteLocationForm;
