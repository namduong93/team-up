import { FC } from "react";
import { useTheme } from "styled-components";
import { ResponsiveButton, TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaRegCheckCircle, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

export interface PageButtonsProps {
  filtersState: [Record<string, Array<string>>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>];
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
}

export const TeamPageButtons: FC<PageButtonsProps> = ({
  filtersState: [filters, setFilters],
  editingStatusState: [isEditingStatus, setIsEditingStatus],
  teamIdsState: [approveTeamIds, setApproveTeamIds],

  rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
  editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus]
}) => {
  
  const theme = useTheme();

  const enableEditTeamStatus = () => {
    setIsEditingStatus(true);
    setFilters({ ...filters, Status: ['Pending'] });
  };
  const disableEditTeamStatus = () => {
    setIsEditingStatus(false);
    setFilters({});
    setApproveTeamIds([]);
  }
  const confirmTeams = () => {
    // do something with the approveTeamIds:
    console.log('accepted', approveTeamIds);

    disableEditTeamStatus();
  }

  const enableEditNameStatus = () => {
    setIsEditingNameStatus(true);
    setFilters({ ...filters, "Team Name Approval": ['Unapproved'] });
  }
  const disableEditNameStatus = () => {
    setIsEditingNameStatus(false);
    setFilters({});
    setApproveTeamIds([]);
    setRejectedTeamIds([]);
  }
  const confirmNames = () => {
    // do something with the approveTeamIds and rejectedteamIds:
    console.log('accepted', approveTeamIds);
    console.log('rejected', rejectedTeamIds);

    disableEditNameStatus();
  }

  return (
  <>
    {!isEditingStatus && !isEditingNameStatus &&
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
      <TransparentResponsiveButton actionType="confirm" onClick={enableEditTeamStatus} label="Edit Team Status" isOpen={false}
        icon={<FaStamp style={{ color: theme.fonts.colour}} />}
        style={{
          backgroundColor: theme.colours.confirm,
          color: theme.background,
          border: '0'
        }}
      />
    </div>}
    
    {isEditingStatus && 
    <>
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
      <TransparentResponsiveButton actionType="confirm" onClick={confirmTeams} label="Confirm Teams" isOpen={false}
        icon={<FaSave style={{ color: theme.fonts.colour}} />}
        style={{
          backgroundColor: theme.colours.confirm,
          color: theme.background,
          border: '0'
        }}
      />
    </div>
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
    <TransparentResponsiveButton actionType="error" onClick={disableEditTeamStatus} label="Cancel" isOpen={false}
          icon={<GiCancel style={{ color: theme.fonts.colour }} />}
          style={{
            backgroundColor: theme.colours.cancel,
            color: theme.background,
            border: '0'
          }} />
    </div>
    </>}

    {!isEditingStatus && !isEditingNameStatus &&
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
      <TransparentResponsiveButton actionType="primary" onClick={enableEditNameStatus} label="Approve Names" isOpen={false}
        icon={<FaRegCheckCircle style={{ color: theme.fonts.colour}} />}
        style={{
          backgroundColor: theme.colours.primaryLight,
          color: theme.background,
          border: '0'
        }}
      />
    </div>}

    {isEditingNameStatus && 
    <>
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
      <TransparentResponsiveButton actionType="primary" onClick={confirmNames} label="Confirm Names" isOpen={false}
        icon={<FaSave style={{ color: theme.fonts.colour}} />}
        style={{
          backgroundColor: theme.colours.primaryLight,
          color: theme.background,
          border: '0'
        }}
      />
    </div>
    <div style={{ maxWidth: '150px', width: '100%', height: '33px' }}>
    <TransparentResponsiveButton actionType="error" onClick={disableEditNameStatus} label="Cancel" isOpen={false}
        icon={<GiCancel style={{ color: theme.fonts.colour}} />}
        style={{
          backgroundColor: theme.colours.cancel,
          color: theme.background,
          border: '0'
        }}
      />
    </div>
    </>}

  </>
  );
}
