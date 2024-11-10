import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import { styled } from "styled-components";
import DropdownInputLight from "../../../../components/general_utility/DropDownLight";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";

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
  max-width: 450px;
  box-sizing: border-box;
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

const NumberInput = styled.input`
  width: 100%;
  padding: 10px;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  box-sizing: border-box;
`;

interface SiteCapacityPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  onSubmit: () => Promise<boolean>;
}

export const SiteCapacityPopUp: React.FC<SiteCapacityPopUpProps> = ({
  heading,
  onClose,
  onSubmit,
}) => {
  const [selectedSite, setSelectedSite] = useState("");
  const [siteCapacity, setSiteCapacity] = useState<number | "">(""); // To store the capacity input
  const isButtonDisabled = selectedSite === "" || siteCapacity === "";

  // Handle site selection change
  const handleSiteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedSite(e.target.value);
    setSiteCapacity(""); // Reset the capacity when site is changed
  };

  // Handle site capacity change
  const handleCapacityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (!value || /^\d+$/.test(value)) {
      setSiteCapacity(value ? parseInt(value) : ""); // Allow empty or numeric values only
    }
  };

  // Example options for the dropdown
  const siteOptions = [
    { value: "site1", label: "Site 1" },
    { value: "site2", label: "Site 2" },
    { value: "site3", label: "Site 3" },
  ];

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

        <DropdownInputLight
          label="Select a Site"
          options={siteOptions}
          required={true}
          value={selectedSite}
          onChange={handleSiteChange}
        />


        <div>
          <label htmlFor="site-capacity">Enter Site Capacity</label>
          <NumberInput
            id="site-capacity"
            type="number"
            value={siteCapacity === "" ? "" : siteCapacity}
            onChange={handleCapacityChange}
            placeholder="Enter a number"
          />
        </div>

        <ResponsiveActionButton 
          label={"Update Capacity"} 
          question={"Are you sure you want to change the capacity for this site?"} 
          actionType={"primary"}
          isDisabled={isButtonDisabled}
          handleSubmit={onSubmit}  
        />
      </Modal>
    </ModalOverlay>
  );
};
