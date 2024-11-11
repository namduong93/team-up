import { FC, useState } from "react";
import styled from "styled-components";
import { UserAccess } from "../../../shared_types/User/User";

interface AccessDropdownProps {
  staffId: number | undefined;
  currentAccess: UserAccess;
  onChange: (newAccess: UserAccess) => void;
}

const StyledDropdown = styled.select<{ $access: UserAccess }>`
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
    $access === UserAccess.Accepted
      ? theme.access.acceptedBackground
      : $access === UserAccess.Pending
      ? theme.access.pendingBackground
      : theme.access.rejectedBackground};

  border: 1px solid ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedText
      : $access === UserAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};

  color: ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedText
      : $access === UserAccess.Pending
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

const Option = styled.option<{ $access: UserAccess }>`
  color: ${({ theme, $access }) =>
    $access === UserAccess.Accepted
      ? theme.access.acceptedText
      : $access === UserAccess.Pending
      ? theme.access.pendingText
      : theme.access.rejectedText};
`;

export const AccessDropdown: FC<AccessDropdownProps> = ({ staffId, currentAccess, onChange }) => {
  const [selectedAccess, setSelectedAccess] = useState<UserAccess>(currentAccess);

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newAccess = event.target.value as UserAccess;
    setSelectedAccess(newAccess);
    onChange(newAccess);

    // TODO: Backend hook to update the individual staff access level
    console.log("updating access level for staff: ", staffId);
  };

  return (
    <StyledDropdown $access={selectedAccess} value={selectedAccess} onChange={handleChange}>
      <Option $access={UserAccess.Accepted} value={UserAccess.Accepted}>
        Accepted
      </Option>
      <Option $access={UserAccess.Pending} value={UserAccess.Pending}>
        Pending
      </Option>
      <Option $access={UserAccess.Rejected} value={UserAccess.Rejected}>
        Rejected
      </Option>
    </StyledDropdown>
  );
};
