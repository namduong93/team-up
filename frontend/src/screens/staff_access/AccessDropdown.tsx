import { FC, useState } from "react";
import styled from "styled-components";
import { StaffAccess } from "../../../shared_types/Competition/staff/StaffInfo";

interface AccessDropdownProps {
  staffId: number;
  currentAccess: StaffAccess;
  onChange: (newAccess: StaffAccess) => void;
}

const StyledDropdown = styled.select<{ $access: StaffAccess }>`
  width: 80%;
  height: 50%;
  min-height: 25px;
  max-width: 160px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  background-color: ${({ theme, $access }) =>
    $access === StaffAccess.Accepted
      ? theme.access.acceptedBackground
      : $access === StaffAccess.Pending
      ? theme.access.pendingBackground
      : theme.access.rejectedBackground};

  border: 1px solid ${({ theme, $access }) =>
    $access === StaffAccess.Accepted
      ? theme.access.acceptedText
      : $access === StaffAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};

  color: ${({ theme, $access }) =>
    $access === StaffAccess.Accepted
      ? theme.access.acceptedText
      : $access === StaffAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};

  cursor: pointer;
  padding: 5px;
  outline: none;

  option {
    background-color: ${({ theme }) => theme.background};
    color: ${({ theme }) => theme.text};
  }
`;

const Option = styled.option<{ $access: StaffAccess }>`
  color: ${({ theme, $access }) =>
    $access === StaffAccess.Accepted
      ? theme.access.acceptedText
      : $access === StaffAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};
`;

export const AccessDropdown: FC<AccessDropdownProps> = ({ staffId, currentAccess, onChange }) => {
  const [selectedAccess, setSelectedAccess] = useState<StaffAccess>(currentAccess);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccess = event.target.value as StaffAccess;
    setSelectedAccess(newAccess);
    onChange(newAccess);

    // TODO: Backend hook to update the individual staff access level
    console.log("updating access level for staff: ", staffId);
  };

  return (
    <StyledDropdown $access={selectedAccess} value={selectedAccess} onChange={handleChange}>
      <Option $access={StaffAccess.Accepted} value={StaffAccess.Accepted}>
        Accepted
      </Option>
      <Option $access={StaffAccess.Pending} value={StaffAccess.Pending}>
        Pending
      </Option>
      <Option $access={StaffAccess.Rejected} value={StaffAccess.Rejected}>
        Rejected
      </Option>
    </StyledDropdown>
  );
};
