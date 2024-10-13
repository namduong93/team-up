import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import TextInputLight from '../../components/general_utility/TextInputLight';
import DropDownInputLight from '../../components/general_utility/DropDownLight';
import { sendRequest } from '../../utility/request';

const Container = styled.div`
  /* padding: 20px; */
  max-width: 600px;
  width: 100%;
  font-family: Arial, Helvetica, sans-serif;
`;

const Title = styled.h2`
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 0.5rem;
`;

const AddButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 10px;
`;

const AddButton = styled.button`
  border: 2px solid #ccc;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-weight: bold;
  color: #ccc;

  &:hover {
    background-color: #6688D2;
    color: white;
    border-color: #6688D2;
  }
`;

// const CenteredListContainer = styled.div`
//   display: flex;
//   justify-content: center;
//   margin-top: 20px;
// `;

// const LocationList = styled.ul`
//   list-style-type: none;
//   padding: 0;
//   text-align: center; /* Optional to align text in the center */
// `;

// const LocationItem = styled.li`
//   padding: 5px 0;
//   font-size: 16px;
// `;

const DoubleInputContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  gap: 0.8%;
`;

interface SiteLocationFormProps {
  onAddLocation: (location: { university: string; defaultSite: string }) => void;
}

interface University {
  id: string;
  name: string;
}


const SiteLocationForm: React.FC<SiteLocationFormProps> = ({ onAddLocation }) => {
  const [university, setUniversity] = useState('');
  const [defaultSite, setDefaultSite] = useState('');
  const [institutionOptions, setInstitutionOptions] = useState([{ value: '', label: 'Please Select' }]);

  const handleAddLocation = () => {
    if (university && defaultSite) {
      onAddLocation({ university, defaultSite });
      setUniversity("");
      setDefaultSite("");
    }
  };

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const response = await sendRequest.get<{ universities: University[] }>('/universities/list');
        const universities = response.data;

        const options = universities.universities.map((university) => ({
          value: university.id,
          label: university.name,
        }));

        const otherOption = { value: 'other', label: 'Other' };
        setInstitutionOptions([...institutionOptions, ...options, otherOption]);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };

    fetchUniversities();
  }, []);

  // const universityOptions = [
  //   { value: '', label: 'Please Select' },
  //   { value: 'MXS', label: 'Mens XS' },
  //   { value: 'MS', label: 'Mens S' },
  //   { value: 'MM', label: 'Mens M' },
  //   { value: 'ML', label: 'Mens L' },
  // ];

  return (
    <Container>
      <Title>Site Locations</Title>
      <DoubleInputContainer>
        <DropDownInputLight
          label="Institution"
          options={institutionOptions}
          value={university}
          required={true}
          onChange={(e) => setUniversity(e.target.value)}
          width="45%"
        />

        <TextInputLight
          label="Competition Name"
          placeholder="Please type"
          type="text"
          required={true}
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
