import { FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaDownload, FaFileCsv, FaFilePdf, FaRegCheckCircle, FaRunning, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { AdvancedDropdown } from "../../../../components/AdvancedDropdown/AdvancedDropdown";
import { sendRequest } from "../../../../utility/request";

export interface PageButtonsProps {
  filtersState: [Record<string, Array<string>>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>];
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  registeredTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
}

export const TeamPageButtons: FC<PageButtonsProps> = ({
  filtersState: [filters, setFilters],
  editingStatusState: [isEditingStatus, setIsEditingStatus],
  teamIdsState: [approveTeamIds, setApproveTeamIds],

  rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
  editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
  registeredTeamIdsState: [registeredTeamIds, setRegisteredTeamIds],
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


  const handleAlgorithmButton = async () => {

    // hook it here
    console.log('running the algorithm...');
    return true;
  }

  const [isDownloading, setIsDownloading] = useState(false);
  

  const downloadCSV = async () => {
    // get team IDs of registered teams
    console.log(registeredTeamIds)

    // from team IDs, get team details for each team

    // format the details for each team into string format
    
    // generate and download csv here
    console.log('downloading csv');
    return true;
  }

  const downloadPDF = async () => {

    // generate and download pdf here
    console.log('downloading pdf');
    return true;
  }

  const enableDownloading = () => {
    setIsDownloading(true);
    setFilters({ ...filters, Status: ['Unregistered'] });
  }

  const disableDownloading = () => {
    setIsDownloading(false);
    setFilters({});
  }

  return (
  <>
    {!isEditingStatus && !isEditingNameStatus && !isDownloading &&
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
      <TransparentResponsiveButton actionType="confirm" onClick={enableEditTeamStatus} label="Edit Team Status" isOpen={false}
        icon={<FaStamp />}
        style={{
          backgroundColor: theme.colours.confirm,
        }}
      />
    </div>}
    
    {isEditingStatus && 
    <>
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
      <TransparentResponsiveButton actionType="confirm" onClick={confirmTeams} label="Confirm Teams" isOpen={false}
        icon={<FaSave />}
        style={{
          backgroundColor: theme.colours.confirm,
        }}
      />
    </div>
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
    <TransparentResponsiveButton actionType="error" onClick={disableEditTeamStatus} label="Cancel" isOpen={false}
          icon={<GiCancel />}
          style={{
            backgroundColor: theme.colours.cancel,
          }} />
    </div>
    </>}

    {!isEditingStatus && !isEditingNameStatus && !isDownloading &&
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
      <TransparentResponsiveButton actionType="primary" onClick={enableEditNameStatus} label="Approve Names" isOpen={false}
        icon={<FaRegCheckCircle />}
        style={{
          backgroundColor: theme.colours.primaryLight,
        }}
      />
    </div>}

    {isEditingNameStatus && 
    <>
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
      <TransparentResponsiveButton actionType="primary" onClick={confirmNames} label="Confirm Names" isOpen={false}
        icon={<FaSave />}
        style={{
          backgroundColor: theme.colours.primaryLight,
        }}
      />
    </div>
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
    <TransparentResponsiveButton actionType="error" onClick={disableEditNameStatus} label="Cancel" isOpen={false}
        icon={<GiCancel />}
        style={{
          backgroundColor: theme.colours.cancel,
        }}
      />
    </div>
    </>}

    {!isEditingStatus && !isEditingNameStatus && !isDownloading &&
    <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
      <ResponsiveActionButton actionType="primary" label="Run Algorithm"
        icon={<FaRunning />}
        question="Run the Algorithm?"
        handleSubmit={handleAlgorithmButton}
      />

    </div>
    }

    {!isEditingStatus && !isEditingNameStatus && !isDownloading &&
      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <TransparentResponsiveButton actionType="primary"
          label="Download"
          icon={<FaDownload />}
          style={{ backgroundColor: theme.colours.primaryLight }}
          onClick={enableDownloading} isOpen={false}
        />

      </div>
    }

    {isDownloading &&
    <>
      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <TransparentResponsiveButton actionType="error"
          onClick={disableDownloading} label="Cancel" isOpen={false}
          icon={<GiCancel />}
          style={{
            backgroundColor: theme.colours.cancel,
        }} />
      </div>
      
      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <ResponsiveActionButton actionType="secondary"
          label="Download CSV"
          question="Are you sure you would like to register these teams?"
          icon={<FaFileCsv />}
          style={{ backgroundColor: theme.colours.secondaryLight }}
          handleSubmit={downloadCSV}
        />
      </div>

      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <ResponsiveActionButton actionType="primary"
          label="Download PDF"
          question="Are you sure you would like to register these teams?"
          icon={<FaFilePdf />}
          style={{ backgroundColor: theme.colours.primaryLight }}
          handleSubmit={downloadPDF}
        />
      </div>

    </>
    }
  </>
  );
}
