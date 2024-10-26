import { FC, useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import { styled } from 'styled-components';
import TextInputLight from '../../../../components/general_utility/TextInputLight';

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  width: 25%;
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

const Button = styled.button<{ disabled?: boolean }>`
  max-width: 150px;
  width: 50%;
  height: 35px;
  border: none;
  border-radius: 30px;
  background-color: ${({ theme, disabled }) => 
    disabled ? theme.colours.sidebarBackground : theme.colours.primaryLight};
  margin-top: 35px;
  margin-bottom: 40px;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 16px;
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  font-family: ${({ theme }) => theme.fonts.fontFamily};
`;

interface UpdateBioPopUpProps {
  onClose: () => void;
  onSave: (newBio: string) => void;
  initialBio?: string;
}

export const UpdateBioPopUp: FC<UpdateBioPopUpProps> = ({ 
  onClose, 
  onSave, 
  initialBio = "" 
}) => {
  const [bio, setBio] = useState(initialBio);

  const isButtonDisabled = () => bio.trim() === "";

  return (
    <Modal>
      <CloseButton onClick={onClose}>
        <FaTimes />
      </CloseButton>

      <h2>Update Your Contact Bio</h2>

      <TextInputLight
        label=""
        placeholder="Enter your new contact bio"
        required={false}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        width="80%"
      />

      <Button 
        disabled={isButtonDisabled()} 
        onClick={() => onSave(bio)}
      >
        Save
      </Button>
    </Modal>
  );
};
