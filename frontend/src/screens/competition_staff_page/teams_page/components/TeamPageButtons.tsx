import { FC, SetStateAction, useEffect, useState } from "react";
import { useTheme } from "styled-components";
import { TransparentResponsiveButton } from "../../../../components/responsive_fields/ResponsiveButton";
import { FaDownload, FaRegCheckCircle, FaRunning, FaSave, FaStamp } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { ResponsiveActionButton } from "../../../../components/responsive_fields/action_buttons/ResponsiveActionButton";
import { useParams } from "react-router-dom";
import { sendRequest } from "../../../../utility/request";
import { TeamDetails } from "./TeamCard";
import { GrDocumentCsv, GrDocumentPdf } from "react-icons/gr";
import { CompetitionDetails, fetchTeams } from "../../CompetitionPage";
import jsPDF from "jspdf";
import "jspdf-autotable";

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


    console.log('accepted', approveTeamIds);
    console.log('rejected', rejectedTeamIds);

    disableEditNameStatus();
  }

  const handleAlgorithmButton = async () => {
    // hook it here
    const response = await sendRequest.post<{ algorithm: string }>('/competition/algorithm', { compId });
    console.log(response.data.algorithm);
    return true;
  }

  const [isDownloading, setIsDownloading] = useState(false);
  
  const downloadCSV = async () => {
    console.log(teamList);
    // Filter only 'Unregistered' teams
    const unregisteredTeams = teamList.filter((team) => team.status === 'Unregistered');
    // const unregisteredTeams = teamList;

    // Group teams by site location and level
    const teamsPerSite = unregisteredTeams.reduce((acc, team) => {
        const siteName = team.teamSite || "Unknown Site"; // Default to 'Unknown Site' if missing
        const teamLevel = team.teamLevel || "Unknown Level"; // Default to 'Unknown Level' if missing
        const existingSite = acc.find((site) => site.siteName === siteName);

        const mappedTeam = {
            teamName: team.teamName,
            level: teamLevel,
            students: team.students.map(({ name, email }) => ({ name, email })),
        };

        if (existingSite) {
            const existingLevelGroup = existingSite.levelGroups.find(levelGroup => levelGroup.level === teamLevel);
            
            if (existingLevelGroup) {
                existingLevelGroup.teams.push(mappedTeam);
            } else {
                existingSite.levelGroups.push({ level: teamLevel, teams: [mappedTeam] });
            }
        } else {
            acc.push({
                siteName,
                levelGroups: [{ level: teamLevel, teams: [mappedTeam] }]
            });
        }
        return acc;
    }, [] as Array<{
        siteName: string;
        levelGroups: { level: string; teams: { teamName: string; students: { name: string; email: string }[] }[] }[]
    }>);

    // Sort levels by A then B
    teamsPerSite.forEach(site => {
        site.levelGroups.sort((a, b) => a.level.localeCompare(b.level));
    });

    // Generate CSV
    let csvContent = "Site Location,Team Level,Team Name,Member Name,Member Email\n";

    teamsPerSite.forEach(({ siteName, levelGroups }) => {
        levelGroups.forEach(({ level, teams }) => {
            teams.forEach((team) => {
                const teamName = team.teamName.split(',')[0];
                team.students.forEach((student) => {
                    csvContent += `${siteName},${level},${teamName},${student.name},${student.email}\n`;
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
    console.log(teamList);
    // Filter only 'Unregistered' teams
    const unregisteredTeams = teamList.filter((team) => team.status === 'Unregistered');
    // const unregisteredTeams = teamList; // Use all teams for now

    // Grouping teams by site location and level
    const teamsPerSite = unregisteredTeams.reduce((acc, team) => {
        const siteName = team.teamSite || "Unknown Site";
        const teamLevel = team.teamLevel || "Unknown Level"; // Assuming 'teamLevel' is a property in your team object
        const existingSite = acc.find((site) => site.siteName === siteName);

        const mappedTeam = {
            teamName: team.teamName,
            level: teamLevel,
            students: team.students.map(({ name, email }) => ({ name, email })),
        };

        if (existingSite) {
            const existingLevelGroup = existingSite.levelGroups.find(levelGroup => levelGroup.level === teamLevel);

            if (existingLevelGroup) {
                existingLevelGroup.teams.push(mappedTeam);
            } else {
                existingSite.levelGroups.push({ level: teamLevel, teams: [mappedTeam] });
            }
        } else {
            acc.push({
                siteName,
                levelGroups: [{ level: teamLevel, teams: [mappedTeam] }]
            });
        }
        return acc;
    }, [] as Array<{
        siteName: string;
        levelGroups: { level: string; teams: { teamName: string; students: { name: string; email: string }[] }[] }[]
    }>);

    // Sort levels to display Level A first and then Level B
    teamsPerSite.forEach(site => {
        site.levelGroups.sort((a, b) => {
            if (a.level === "Level A" && b.level !== "Level A") return -1;
            if (a.level === "Level B" && b.level === "Level A") return 1;
            return 0; // If both are the same or not Level A or B, maintain original order
        });
    });

    // Initialize jsPDF
    const doc = new jsPDF();
    let yPos = 10;

    // Add title to the PDF
    doc.setFontSize(16);
    doc.text("Team Registration Data Report", 10, yPos);
    yPos += 10;

    teamsPerSite.forEach(({ siteName, levelGroups }) => {
        // Add site location header
        doc.setFontSize(12);
        doc.text(`Site location: ${siteName}`, 10, yPos);
        yPos += 10;

        levelGroups.forEach(({ level, teams }) => {
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
                        [{ content: `Team name:`, styles: { halign: 'left' } }, { content: team.teamName, styles: { halign: 'right' } }]
                    ],
                    body: team.students.map((student) => [
                        { content: `${student.name}`, styles: { halign: 'left' } },
                        { content: `${student.email}`, styles: { halign: 'right' } },
                    ]),
                    theme: "grid",
                    styles: { fontSize: 10 },
                    columnStyles: {
                        0: { cellWidth: 'auto' },
                        1: { cellWidth: 'auto' }
                    },
                    headStyles: {
                      fillColor: [102, 136, 210],
                      textColor: [255, 255, 255],
                      fontSize: 12
                    },
                    margin: { left: 10, right: 10 },
                });

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                yPos = (doc as any).lastAutoTable.finalY + 10;
                if (yPos + 20 > doc.internal.pageSize.height) {
                    doc.addPage();
                    yPos = 10; // Reset Y position for the new page
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
          icon={<GrDocumentCsv />}
          handleSubmit={downloadCSV}
        />
      </div>

      <div style={{ maxWidth: '150px', width: '100%', height: '35px' }}>
        <ResponsiveActionButton actionType="primary"
          label="Download PDF"
          question="Are you sure you would like to register these teams?"
          icon={<GrDocumentPdf />}
          handleSubmit={downloadPDF}
        />
      </div>

    </>
    }
  </>
  );
}
