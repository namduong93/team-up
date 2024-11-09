import React from "react";
import { FaTimes } from "react-icons/fa";
import styled from "styled-components";
import { ToggleButton } from "./ToggleButton";
import { EditRego } from "../../../../../shared_types/Competition/staff/Edit";

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

const Label = styled.label`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  font-size: 18px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Text = styled.span`
  font-family: ${({ theme }) => theme.fonts.fontFamily};
  font-size: 16px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const RowContainer = styled.div`
  display: grid;
  grid-template-columns: 75% 25%;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 10px;
  margin-bottom: 30px;
  width: 85%;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  text-align: left;
  gap: 10px;
  padding: 5px;
`;

interface EditCompRegoPopUpProps {
  heading: React.ReactNode;
  onClose: () => void;
  regoFields: EditRego;
  setRegoFields: React.Dispatch<React.SetStateAction<EditRego>>;
  onSubmit: (regoFields: EditRego) => void;
}

export const EditCompRegoPopUp: React.FC<EditCompRegoPopUpProps> = ({
  heading,
  onClose,
  regoFields,
  setRegoFields,
  onSubmit,
}) => {
  const handleToggle = (field: keyof EditRego) => {
    setRegoFields((prevFields) => ({
      ...prevFields,
      [field]: !prevFields[field],
    }));
  };

  const handleSubmit = () => {
    onSubmit(regoFields);
    onClose();
  };

  return (
    <ModalOverlay>
      <Modal>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>
        <div>{heading}</div>

        <RowContainer>
          <Column>
            <Label>Codeforces</Label>
            <Text>Students enter their current Codeforces score</Text>
          </Column>
          <Column>
            <ToggleButton
              isOn={regoFields.codeforces}
              onToggle={() => handleToggle("codeforces")}
            />
          </Column>
        </RowContainer>

        <RowContainer>
          <Column>
            <Label>ICPC Regional Participation</Label>
            <Text>
              Students specify if they have ever competed in a regional ICPC
              round
            </Text>
          </Column>
          <Column>
            <ToggleButton
              isOn={regoFields.regionalParticipation}
              onToggle={() => handleToggle("regionalParticipation")}
            />
          </Column>
        </RowContainer>

        <RowContainer>
          <Column>
            <Label>National Olympiad Prizes</Label>
            <Text>
              Students specify if they have ever won any related National
              Olympiad Prizes in Mathematics or Informatics
            </Text>
          </Column>
          <Column>
            <ToggleButton
              isOn={regoFields.nationalOlympiad}
              onToggle={() => handleToggle("nationalOlympiad")}
            />
          </Column>
        </RowContainer>

        <RowContainer>
          <Column>
            <Label>International Olympiad Prizes</Label>
            <Text>
              Students specify if they have ever won any related International
              Olympiad Prizes in Mathematics or Informatics
            </Text>
          </Column>
          <Column>
            <ToggleButton
              isOn={regoFields.internationalOlympiad}
              onToggle={() => handleToggle("internationalOlympiad")}
            />
          </Column>
        </RowContainer>

        <Button onClick={handleSubmit}>Save Changes</Button>
      </Modal>
    </ModalOverlay>
  );
};
