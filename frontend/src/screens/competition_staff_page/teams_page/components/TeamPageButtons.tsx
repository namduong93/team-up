import { FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaDownload, FaFileCsv, FaFilePdf, FaRegCheckCircle, FaRunning, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../../utility/request";
import { GrDocumentPdf } from "react-icons/gr";


export interface PageButtonsProps {
  filtersState: [Record<string, Array<string>>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>];
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  universityOption: { value: string, label: string };
}

// interface TeamsPerSiteData {
//   siteName: string; // e.g. "CSE Building K17"
//   teams: TeamDetails[]; // details of each team attending this site. need: {teamName, members: {name, email}}.
// };

// interface TeamsDownload {
//   format: "PDF" | "CSV"; // format of the downloaded content
//   teamsToRegister: TeamsPerSiteData[]; // for each site, list the team details
// };

// interface tShirtData {
//   gender: "Male" | "Female" | "Unisex"; // cut of the t-shirt
//   size: "XS" | "S" | "M" | "L" | "XL"; // size of the t-shirt
//   quantity: number; // how many of this type of t-shirt required
// };

// interface dietaryDetails {
//   name: string; // e.g. "John Smith"
//   email: string; // e.g. "testemail@example.com"
//   affiliation: string; // e.g. "UNSW"
//   details: string; // e.g. "No cheese"
// };

// interface dietaryData {
//   requirement: string; // e.g. "dairy", "gluten-free" etc.
//   attendees: dietaryDetails[]; // list of details of all the attendees that have this dietary requirement
//   quantity: number; // number of attendees with this type of dietary requirement
// };

// interface accessibilityDetails {
//   name: string; // e.g. "John Smith"
//   email: string; // e.g. "testemail@example.com"
//   affiliation: string; // e.g. "UNSW"
//   details: string; // e.g. "Needs ramp"
// };

// interface accessibilityData {
//   requirement: string; // e.g. "wheelchair access" etc.
//   attendees: accessibilityDetails[]; // list of details of all the attendees that have this accessibility requirement
//   quantity: number; // number of attendees with this type of accessibility requirement
// };

// interface SiteDownload {
//   format: "PDF" | "CSV"; // format of the downloaded content
//   siteName: string; // e.g. "CSE Building K17"
//   siteCapacity: number // e.g. 30 (computers/seats)
//   tShirtQuantities: tShirtData[]; // data for each type of t-shirt required by attendees for this site
//   dietaryQuantities: dietaryData[]; // data for each type of dietary requiremnent by attendees for this site
//   accessibilityQuantities: accessibilityData[]; // data for each type of accessibility requiremnent by attendees for this site
// };

export const TeamPageButtons: FC<PageButtonsProps> = ({
  filtersState: [filters, setFilters],
  editingStatusState: [isEditingStatus, setIsEditingStatus],
  teamIdsState: [approveTeamIds, setApproveTeamIds],
  universityOption,

  rejectedTeamIdsState: [rejectedTeamIds, setRejectedTeamIds],
  editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus]
}) => {
  
  const theme = useTheme();
  const { compId } = useParams<{ compId: string }>();
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
    sendRequest.post('/competition/algorithm', { compId });
    return true;
  }

  const [isDownloading, setIsDownloading] = useState(false);
  

  const downloadCSV = async () => {

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
        question={`Run the Algorithm for ${universityOption.label} ?`}
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
          handleSubmit={downloadCSV}
        />
      </div>

      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <ResponsiveActionButton actionType="primary"
          label="Download PDF"
          question="Are you sure you would like to register these teams?"
          icon={<GrDocumentPdf />}
          style={{ backgroundColor: theme.colours.confirm }}
          handleSubmit={downloadPDF}
        />
      </div>

    </>
    }
  </>
  );
}
