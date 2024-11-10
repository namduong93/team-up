import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import DropdownInputLight from "../../../../components/general_utility/DropDownLight";
import { useCompetitionOutletContext } from "../../hooks/useCompetitionOutletContext";
import { NumberInputLight } from "../../../../components/general_utility/NumberInputLight";
import { CompetitionRole } from "../../../../../shared_types/Competition/CompetitionRole";

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
  min-width: 290px;
  max-width: 800px;
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
  const { roles, siteOptionsState: [siteOptions, setSiteOptions] } = useCompetitionOutletContext("attendees");
  const [selectedSite, setSelectedSite] = useState<{ value: string; label: string }>({label: "", value: "0"});
  const [capacity, setCapacity] = useState<number>(0);
  const [currentCapacity, setCurrentCapacity] = useState<number>(0);

  let siteOptionsAllowed = siteOptions;
  
  useEffect(() => {
    console.log(roles);

    if (!roles.includes(CompetitionRole.Admin)) {
      // TODO: Backend  hook to get the site for the particular site-coord
      siteOptionsAllowed = [siteOptions[0]]

      // TODO: Backend get the current site capacity of the selected site

      setCurrentCapacity(12);
      setSelectedSite(siteOptions[0])
    } else {
      setSelectedSite(siteOptions[0])

      // TODO: Backend get the current site capacity of the first site

      setCurrentCapacity(12);
    }
  }, [])

  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = siteOptions.find((site) => site.value === e.target.value);
    if (selected) {
      setSelectedSite(selected); // Update selectedSite state
      const fetchedCapacity = parseInt(selected.value); // Dummy fetched capacity
      setCurrentCapacity(fetchedCapacity);
      setCapacity(fetchedCapacity);
    }

    console.log(selected?.label);
  };

  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newCapacity = Number(e.target.value);
    if (newCapacity >= 0) {
      setCapacity(newCapacity);
    }
  };

  const handleSubmit = () => {
    // Call onSubmit with the site and capacity
    onSubmit({label: selectedSite.label, value: parseInt(selectedSite.value)}, capacity);
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

        <DropdownInputLight
          label="Select a Site"
          options={siteOptionsAllowed}
          value={selectedSite.label}
          onChange={handleSiteChange}
          required
        />
        <NumberInputLight
          label="Provide a capacity"
          value={capacity}
          onChange={handleCapacityChange}
          currentCapacity={currentCapacity}
        />

        <Button onClick={handleSubmit} disabled={capacity <= 0} >Save Changes</Button>
      </Modal>
    </ModalOverlay>
  );
};
