import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { NumberInputLight } from "../../../../components/general_utility/NumberInputLight";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";
import { CompetitionSiteCapacity } from "../../../../../shared_types/Competition/CompetitionSite";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import { sendRequest } from "../../../../utility/request";
import { useParams } from "react-router-dom";
import { Heading } from "./StaffActionCard";
import { Text } from "../../../competition/register/CompIndividual";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  min-width: 200px;
  max-width: 500px;
  max-height: 400px;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 80%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const View = styled.div`
  width: 100%;
  height: 400px;
  display: flex;
  flex-wrap: wrap;
  overflow: hidden;
  justify-content: center;
  align-items: center;
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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  min-width: 200px;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
`;

interface EditSiteCapacityPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onSubmit: (site: {label: string, value: number}, capacity: number) => void;
};

export const EditSiteCapacityPopUp: React.FC<EditSiteCapacityPopUpProps> = ({
  heading,
  onClose,
  onSubmit,
}) => {
  const { compId } = useParams();
  const { roles, siteOptionsState: [siteOptions, setSiteOptions] } = useCompetitionOutletContext("attendees");
  const [selectedSite, setSelectedSite] = useState<{ value: string; label: string }>({label: "", value: "0"});
  const [capacity, setCapacity] = useState<number>(0);
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);

  const [siteCapacities, setSiteCapacities] = useState<CompetitionSiteCapacity[] | undefined>()

  useEffect(() => {

    const fetchSiteCapacities = async () => {

      const ids = (roles.includes(CompetitionRole.Admin) ? siteOptions.map((site) => site.value) : []);

      const response = await sendRequest.get<{ site: CompetitionSiteCapacity[] }>(
        '/competition/site/capacity',
        { compId, ids });
      
      const { site: siteCapacities } = response.data;
      setSiteCapacities(siteCapacities);
    }
    fetchSiteCapacities();
  }, []);

  useEffect(() => {
    const newCapacity = siteCapacities?.find((site) => site.id === parseInt(selectedSite.value));
    console.log(newCapacity);
    setCurrentCapacity(newCapacity?.capacity || 0);
  }, [selectedSite, siteCapacities]);

  useEffect(() => {
    setSelectedSite(siteOptions[0]);
  }, [siteOptions]);


  // const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
  //   const selected = siteOptions.find((site) => site.value === e.target.value);
  //   if (selected) {
  //     setSelectedSite(selected); // Update selectedSite state
  //   }

  //   console.log(selected?.label);
  // };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCapacity = Number(e.target.value);
    if (newCapacity >= 0) {
      setCapacity(newCapacity);
    }
  };

  const handleSubmit = async () => {
    // Call onSubmit with the site and capacity
    // onSubmit({label: selectedSite.label, value: parseInt(selectedSite.value)}, capacity);
    onClose();
    
    await sendRequest.put<{}>('/competition/site/capacity/update', { compId, siteId: parseInt(selectedSite.value), capacity });
  };

  return (
    <ModalOverlay>
      <Modal>
        <View>
          <CloseButton onClick={onClose}>
            <FaTimes />
          </CloseButton>
          <Container>
            <Heading>{heading}</Heading>
            <div style={{ display: "flex", alignContent: "center" }}>
              <Text>
                <em>Capacity is the number of participants your site can host.</em>
              </Text>
            </div>

            {roles.includes(CompetitionRole.Admin) && 
            <div style={{ width: '300px' }}>
              <AdvancedDropdown
                setCurrentSelected={setSelectedSite}
                optionsState={[siteOptions, setSiteOptions]}
                style={{ width: "100%" }}
                isExtendable={false}
                defaultSearchTerm={selectedSite.label}
              />
            </div>
            
            }
            <NumberInputLight
              label="Provide a capacity"
              value={currentCapacity}
              onChange={handleCapacityChange}
              currentCapacity={currentCapacity}
            />

            <Button onClick={handleSubmit} disabled={capacity <= 0} >Save Changes</Button>
          </Container>
        </View>
      </Modal>
    </ModalOverlay>
  );
};
