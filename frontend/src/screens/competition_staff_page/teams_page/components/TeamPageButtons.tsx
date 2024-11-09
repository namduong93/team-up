import { FC, useState } from "react";
import { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaRegCheckCircle, FaRunning, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../../utility/request";
import { TeamDetails } from "../../../../../shared_types/Competition/team/TeamDetails";
import { CompetitionDetails, fetchTeams } from "../../CompetitionPage";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { DownloadButtons } from "../../components/DownloadButtons";
import { SiteDetails } from "../../../../../shared_types/Competition/CompetitionSite";

export interface PageButtonsProps {
  filtersState: [Record<string, Array<string>>, React.Dispatch<React.SetStateAction<Record<string, string[]>>>];
  editingStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  teamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  editingNameStatusState: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  rejectedTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  registeredTeamIdsState: [Array<number>, React.Dispatch<React.SetStateAction<Array<number>>>];
  teamListState: [Array<TeamDetails>, React.Dispatch<React.SetStateAction<Array<TeamDetails>>>];
  universityOption: { value: string, label: string };
  compDetails: CompetitionDetails;
};

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
  editingNameStatusState: [isEditingNameStatus, setIsEditingNameStatus],
  registeredTeamIdsState: [registeredTeamIds, setRegisteredTeamIds],
  teamListState: [teamList, setTeamList],
  compDetails,
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
  const confirmTeams = async () => {
    if (approveTeamIds.length === 0) {
      return;
    }
    try {
      await sendRequest.put('/competition/coach/team_assignment_approve', { compId, approveIds: approveTeamIds });
      await fetchTeams(compId, setTeamList);
    } catch (error: unknown) {

    }
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
  const confirmNames = async () => {
    if (approveTeamIds.length === 0 && rejectedTeamIds.length === 0) {
      return;
    }

    try {
      await sendRequest.put('/competition/coach/team_name_approve',
        {compId, approveIds: approveTeamIds, rejectIds: rejectedTeamIds });
      await fetchTeams(compId, setTeamList);
    } catch (error: unknown) {

    }

    disableEditNameStatus();
  }

  const handleAlgorithmButton = async () => {
    const response = await sendRequest.post<{ algorithm: string }>('/competition/algorithm', { compId });
    await fetchTeams(compId, setTeamList);
    console.log(response.data.algorithm);
    return true;
  };

  const [isDownloading, setIsDownloading] = useState(false);

  const mapToTitle = (sex: string): string => {
    switch (sex) {
      case "M":
        return "Mr";
      case "F":
        return "Ms";
      case "NB":
        return "None";
      default:
        return "None";
    }
  };

  const downloadCSV = async () => {
    // Filter only 'Unregistered' teams
    let unregisteredTeams = teamList.filter((team: TeamDetails) => team.status === 'Unregistered');
    if (universityOption.value) {
      unregisteredTeams = teamList.filter((team: TeamDetails) => team.universityId === parseInt(universityOption.value));
    };

    // Group teams by site location and level
    const teamsPerSite = unregisteredTeams.reduce((acc: SiteDetails[], team: TeamDetails) => {
      const existingSite = acc.find((site) => site.name === team.teamSite);
  
      if (existingSite) {
          const existingLevelGroup = existingSite.levelGroups.find(levelGroup => levelGroup.level === team.teamLevel);
  
          if (existingLevelGroup) {
              existingLevelGroup.teams.push(team);
          } else {
              existingSite.levelGroups.push({ level: team.teamLevel, teams: [team] });
          }
      } else {
          acc.push({
            id: team.siteId,
            name: team.teamSite,
            levelGroups: [{ level: team.teamLevel, teams: [team] }]
          });
      }
      return acc;
    }, [] as SiteDetails[]);

    // Sort levels by A then B
    teamsPerSite.forEach((site: SiteDetails) => {
        site.levelGroups.sort((a, b) => a.level.localeCompare(b.level));
    });

    // Generate CSV
    let csvContent = "Site Location,Team Level,Team Name,Member Name,Member Email,Title,Sex,Preferred Name\n";

    teamsPerSite.forEach((site: SiteDetails) => {
        site.levelGroups.forEach(({ level, teams }) => {
            teams.forEach((team) => {
                const teamName = team.teamName.split(',')[0];
                team.students.forEach((student) => {
                    csvContent += `${site.name},${level},${teamName},${student.name},${student.email},${mapToTitle(student.sex)},${student.sex},${student.preferredName}\n`;
                });
            });
        });
    });

    // Create Blob and trigger CSV download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `unregistered_teams_${compDetails.name}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  };

  const downloadPDF = async () => {
    // Filter only 'Unregistered' teams
    let unregisteredTeams = teamList.filter((team: TeamDetails) => team.status === 'Unregistered');
    if (universityOption.value) {
      unregisteredTeams = teamList.filter((team: TeamDetails) => team.universityId === parseInt(universityOption.value));
    };


    // Group teams by site location and level
    const teamsPerSite = unregisteredTeams.reduce((acc: SiteDetails[], team: TeamDetails) => {
      const existingSite = acc.find((site) => site.name === team.teamSite);
  
      if (existingSite) {
          const existingLevelGroup = existingSite.levelGroups.find(levelGroup => levelGroup.level === team.teamLevel);
  
          if (existingLevelGroup) {
              existingLevelGroup.teams.push(team);
          } else {
              existingSite.levelGroups.push({ level: team.teamLevel, teams: [team] });
          }
      } else {
          acc.push({
            id: team.siteId,
            name: team.teamSite,
            levelGroups: [{ level: team.teamLevel, teams: [team] }]
          });
      }
      return acc;
    }, [] as SiteDetails[]);

    // Sort levels by A then B
    teamsPerSite.forEach((site: SiteDetails) => {
      site.levelGroups.sort((a, b) => a.level.localeCompare(b.level));
  });

    // Initialize jsPDF
const doc = new jsPDF();
let yPos = 10;

// Add title to the PDF
doc.setFontSize(16);
doc.text("Team Registration Data Report", 10, yPos);
yPos += 10;

teamsPerSite.forEach((site: SiteDetails) => {
  // Add site location header
  doc.setFontSize(12);
  doc.text(`Site location: ${site.name}`, 10, yPos);
  yPos += 10;

  site.levelGroups.forEach(({ level, teams }) => {
    // Add level header
    doc.setFontSize(12);
    doc.text(`Level: ${level}`, 10, yPos);
    yPos += 5;

    teams.forEach((team) => {
      // Add a new table for each team
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (doc as any).autoTable({
        startY: yPos,
        head: [
          [
            { content: 'Team Name:', styles: { halign: 'left', fillColor: [188, 207, 248], textColor: [0, 0, 0] } },
            { content: team.teamName, colSpan: 4, styles: { halign: 'left', fillColor: [188, 207, 248], textColor: [0, 0, 0] } }
          ],
          [
            'Student Name',
            'Student email',
            'Student Title',
            'Student sex',
            'Student preferred name'
          ]
        ],
        body: team.students.map((student) => [
          student.name,
          student.email,
          mapToTitle(student.sex),
          student.sex,
          student.preferredName
        ]),
        theme: 'grid',
        styles: {
          fontSize: 10,
          cellPadding: 2
        },
        columnStyles: {
          0: { cellWidth: 'auto' },
          1: { cellWidth: 'auto' },
          2: { cellWidth: 'auto' },
          3: { cellWidth: 'auto' },
          4: { cellWidth: 'auto' }
        },
        headStyles: {
          fillColor: [102, 136, 210],
          textColor: [255, 255, 255],
          fontSize: 10
        },
        margin: { left: 10, right: 10 }
      });

      // Update Y position for next content
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      yPos = (doc as any).lastAutoTable.finalY + 10;

      // Add new page if needed
      if (yPos + 20 > doc.internal.pageSize.height) {
        doc.addPage();
        yPos = 10;
      }
    });
    yPos += 10;
  });
  yPos += 20;
});
  

    // Save the PDF
    doc.save(`unregistered_teams_report_${compDetails.name}.pdf`);
    console.log("PDF generated successfully.");
    return true;
  };

  const handleEnableDownloading = () => {
    setFilters({ ...filters, Status: ['Unregistered'] });
  }

  const handleDisableDownloading = () => {
    setFilters({});
  }

  const updateTeamStatus = async () => {
    // TODO: hook to update team status from unregistered to registered
    return true;
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

    <DownloadButtons
      isEditingStatus={isEditingStatus}
      isEditingNameStatus={isEditingNameStatus}
      isDownloadingState={[isDownloading, setIsDownloading]}
      handleEnable={handleEnableDownloading}
      handleDisable={handleDisableDownloading}
      downloadCSV={downloadCSV}
      downloadPDF={downloadPDF}
      updateTeamStatus={updateTeamStatus}
      downloadQuestion="Are you sure you would like to register these teams?"
      isSiteDownload={false}
    />
    
  </>
  );
}
