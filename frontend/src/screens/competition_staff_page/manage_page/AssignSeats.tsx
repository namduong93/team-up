// SITE COORDS CAN UPLOAD A .CSV OF AVAILABLE SEATS/ROOMS
// CAN SORT TEAMS (ASSIGN 1 SEAT PER TEAM AND SKIP 2 EACH TIME)
// SEAT ASSIGNMENT NOTIFICATION TO ALL STUDENTS UPON CLOSE OF REGISTRATION TIME

import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import RadioButton from "../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import TextInput from "../../../components/general_utility/TextInput";
import { FaBell, FaChair, FaDownload, FaTimes } from "react-icons/fa";
import { TransparentResponsiveButton } from "../../../components/responsive_fields/ResponsiveButton";
import { TeamDetails } from "../../../../shared_types/Competition/team/TeamDetails";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { sendRequest } from "../../../utility/request";
import { useParams } from "react-router-dom";

interface AssignSeatsProps {
  siteName: string;
  siteCapacity: number;
};

interface SeatAssignment {
  siteId: number; // ID of the site
  teamSite: string; // e.g. "CSE Building K17"
  teamSeat: string; // e.g. "Bongo01"
  teamId: string; // ID of team who have been assigned that seat
  teamName: string; // name of team at the assigned seat
  teamLevel: string; // level of the team
};

interface exportSeatAssignment {
  siteName: string; // e.g. "CSE Building K17"
  siteCapacity: number // e.g. 30
  teams: SeatAssignment[] // teams who have been assigned to that seat
};

interface Room {
  roomName: string;
  level: "A" | "B";
  seatCodes: string[]; // text string input of available seat codes for this room
  numSeats: number; // length of the seat codes array
};

const ManageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  max-width: 100%;
  width: 100%;
  height: 100%;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: ${({ theme }) => theme.colours.primaryDark};
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 100%;
`;

const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const SeatCount = styled.span`
  font-size: 1em;
  font-weight: bold;
  color: ${({ theme }) => theme.colours.secondaryDark};
  align-self: center;
  justify-self: center;
  flex: 1;
`;

const RoomList = styled.div`
  display: grid;
  width: 80%;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 15px;
  margin-top: 20px;
`;

const RoomItem = styled.div`
  display: contents;
  font-size: 16px;
  text-align: center;
  color: ${({ theme }) => theme.fonts.colour};
`;

const Button = styled.button`
  width: 120px;
  height: 35px;
  background-color: ${({ theme }) => theme.colours.confirm};
  color: ${({ theme }) => theme.fonts.colour};
  border: none;
  border-radius: 25px;
  cursor: pointer;
  align-self: center;

  &:disabled {
    background-color: ${({ theme }) => theme.colours.sidebarBackground};
    cursor: not-allowed;
  }
`;

const DeleteIcon = styled.span`
  cursor: pointer;
  font-size: 1rem;
  color: ${({ theme }) => theme.colours.error};

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
`;

const SeatInputSelect = styled.div`
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  height: 100%;
  margin-bottom: 10px;
  box-sizing: border-box;
  padding: 10px;
  margin-top: 10px;
`;

const AssignSeatsButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  flex: 1;
`;

const DistributeSeats = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: 80px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  width: 100%;
  height: 30%;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 300px;
  text-align: center;
  box-sizing: border-box;
`;

const DownloadButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.primaryLight};
  color: ${({ theme }) => theme.fonts.colour};
`;

const NotifyButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.secondaryLight};
  color: ${({ theme }) => theme.fonts.colour};
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 80%;
  max-height: 90px;
  gap: 10px;
  margin-left: 10%;
  box-sizing: border-box;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1.5rem;
  color: ${({ theme }) => theme.colours.error};
  display: flex;
  align-self: flex-end;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const LevelContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Levels = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 5%;
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

const InputTitleA = styled.div`
  font-size: 1rem;
  background-color: ${({ theme }) => theme.staffActions.contactBorder};
  color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const InputTitleB = styled.div`
  font-size: 1rem;
  background-color: ${({ theme }) => theme.staffActions.seatBorder};
  color: ${({ theme }) => theme.background};
  border: 1px solid ${({ theme }) => theme.colours.sidebarBackground};
  width: fit-content;
  padding: 5px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const AssignPopupText = styled.h2`
  color: ${({ theme }) => theme.fonts.colour};
`;

export const AssignSeats: FC<AssignSeatsProps> = ({ siteName, siteCapacity }) => {
  const { compId } = useParams();
  const [seatInputType, setSeatInputType] = useState<string>("Text"); // either string or inputs
  const [seatAB, setSeatAB] = useState<string>("Together"); // seat level a and b either together or separately
  const [isSeatedTogether, setIsSeatedTogether] = useState<boolean>(true); // by default, don't split level a and b
  const [isTextInput, setIsTextInput] = useState<boolean>(true);
  const [seatString, setSeatString] = useState<string>("");
  const [roomNameA, setRoomNameA] = useState<string>("");
  const [roomNameB, setRoomNameB] = useState<string>("");
  const [seatCodeInputA, setSeatCodeInputA] = useState<string>("");
  const [seatCodeInputB, setSeatCodeInputB] = useState<string>("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [error, setError] = useState<ReactNode>("");
  const [seatCount, setSeatCount] = useState<number>(0);
  const [seatModalState, setSeatModalState] = useState<boolean>(false);

  const [generatedSeats, setGeneratedSeats] = useState<string[]>([]);
  const [existingSeats, setExistingSeats] = useState<string[]>([]);
  const [teamSeatAssignments, setTeamSeatAssignments] = useState<SeatAssignment[]>([]);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { teamListState: [teamList, setTeamList], universityOption } = useCompetitionOutletContext("teams");

  // Filter by uni
  let teamListToAssign = teamList;
  if (universityOption.value) {
    teamListToAssign = teamList.filter((team: TeamDetails) => team.universityId === parseInt(universityOption.value));
  };

  // Update seat count whenever the seat string changes
  useEffect(() => {
    // Calculate total seats based on the seatString format
    const totalSeatsFromString = seatString.split(",").filter(seat => seat.trim() !== "").length;
    const calculatedSeats = Math.ceil(totalSeatsFromString / 3);
    setSeatCount(calculatedSeats);
  }, [seatString]);

  const validateRoomAndSeatCodes = (roomName: string, level: string, seatCodes: string[]) => {
    // Check for duplicate room names
    const isDuplicateRoom = rooms.some((room) => (room.roomName === roomName && room.level === level));
    if (isDuplicateRoom) {
      return { valid: false, error: "This room already exists for this level." };
    }
  
    // Check for duplicate seat codes already included
    const seatCodesInString = seatString.split(",").map(code => code.trim());
    const hasDuplicateSeats = seatCodes.some((code) =>
      seatCodesInString.includes(`${roomName}${code.trim()}`)
    );
  
    if (hasDuplicateSeats) {
      return { valid: false, error: "One or more of those seat codes have already been added." };
    }
  
    return { valid: true, error: "" };
  };
  
  const handleAddRoom = () => {
    // Validate inputs from both forms
    if ((!roomNameA || !seatCodeInputA) && (!roomNameB || !seatCodeInputB)) {
      setError(<p>Please fill all fields correctly for at least one form.</p>);
      return;
    }
  
    // Determine which form is filled and assign appropriate values
    const isFormA = roomNameA && seatCodeInputA;
    const level = isFormA ? "A" : "B";
    const roomName = (isFormA) ? roomNameA : roomNameB;
    const seatCodes = (isFormA) ? seatCodeInputA.split(',') : seatCodeInputB.split(',');
    const numSeats = seatCodes.length;
  
    // Validate room and seat codes
    const { valid, error } = validateRoomAndSeatCodes(roomName, level, seatCodes);
    if (!valid) {
      setError(<p>{error}</p>);
      if (level === "A") {
        setRoomNameA("");
        setSeatCodeInputA("");
      } else {
        setRoomNameB("");
        setSeatCodeInputB("");
      }
      return;
    }
  
    const newRoom: Room = {
      roomName,
      seatCodes,
      numSeats,
      level,
    };
  
    // Add the room to the list with seat codes
    setRooms((prev) => [...prev, newRoom]);
  
    // Clear the form inputs and reset error
    if (level === "A") {
      setRoomNameA("");
      setSeatCodeInputA("");
    } else {
      setRoomNameB("");
      setSeatCodeInputB("");
    }
    setError("");
    generateSeats();
  };

  const handleDeleteRoom = (roomToDelete: Room) => {
    // Get the seat codes for the room being deleted
    const seatsToRemove: string[] = roomToDelete.seatCodes.map((code) => 
      `${roomToDelete.roomName}${code.trim()}`
    );
    
  
    // Update the rooms state
    setRooms((prev) =>
      prev.filter((room) => 
        !(room.roomName === roomToDelete.roomName && room.level === roomToDelete.level)
      )
    );
  
    // Determine the seats that need to be removed based on the room's seat codes
    const updatedSeats = generatedSeats.filter(seat => 
      !seatsToRemove.includes(seat)
    );
  
    // Update the state with the new seat string
    setGeneratedSeats(updatedSeats);
    setSeatString(updatedSeats.join(", "));
  };

  const handleSeatStringChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatString(e.target.value);
  };

  const handleSeatCodesA = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatCodeInputA(e.target.value);
  };

  const handleSeatCodesB = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setSeatCodeInputB(e.target.value);
  };

  const generateSeats = () => {
    const newSeats: string[] = [];
    
    // Check if Form A is filled out
    if (roomNameA && seatCodeInputA) {
        const seatCodes = seatCodeInputA.split(",").map(code => code.trim());
        
        seatCodes.forEach((code) => {
          newSeats.push(`${roomNameA}${code}`);
        });
    }

    // Check if Form B is filled out
    if (roomNameB && seatCodeInputB) {
        const seatCodes = seatCodeInputB.split(",").map(code => code.trim());
        
        seatCodes.forEach((code) => {
          newSeats.push(`${roomNameB}${code}`);
        });
    }

    const updatedSeats = [...existingSeats, ...newSeats];
    setExistingSeats(updatedSeats);
    setGeneratedSeats(updatedSeats);
    setSeatString(updatedSeats.join(", "));
  };

  useEffect(() =>  {
    console.log(seatString);
  }, [seatString])


  // If not all fields are filled, disable add room button
  const cannotAddRoom = () => {
    const isFormAInvalid = !roomNameA || !seatCodeInputA;
    const isFormBInvalid = !roomNameB || !seatCodeInputB;
  
    // Cannot add a room if both forms are invalid
    return isFormAInvalid && isFormBInvalid;
  };

  const distributeSeats = async () => {
    
    // Assign one seat per team, skipping two each time
    const seatAssignments: SeatAssignment[] = [];
    const teamsToAssign = teamListToAssign;

    const levelATeams = [];
    const levelBTeams = [];

    for (const team of teamsToAssign) {
      const teamLevel = team.teamLevel; // level assumed by first student's level
      if (teamLevel === 'A') {
        levelATeams.push(team);
      } else if (teamLevel === 'B') {
        levelBTeams.push(team);
      }
    }
    
    
    // if text input provided, use this method (only need to check the seatString and distribute)
    if (isTextInput) {
      const availableSeats = seatString.split(",");
      // Group teams by level
      if (!isSeatedTogether) {
        // Combine level A and level B teams
        teamsToAssign.length = 0;
        // Append A level teams followed by B level teams
        teamsToAssign.push(...levelATeams, ...levelBTeams);
      }
      
      for (let i = 0; i < teamsToAssign.length; i++) {
        const team = teamsToAssign[i];
        const seat = availableSeats[i * 3]; // Assign a seat, skipping 2 each time
        if (seat) {
          seatAssignments.push({
            siteId: team.siteId,
            teamSite: team.teamSite,
            teamSeat: seat,
            teamId: team.teamId.toString(),
            teamName: team.teamName,
            teamLevel: team.teamLevel,
          });
        }
      }
    } else {
      // if specific room level input given, need to split based on provided room seat assignments
      const availableRooms = rooms;
      const assignedTeamIds = new Set<number>(); // To track assigned teams

      for (const room of availableRooms) {
        // Determine the appropriate teams to assign to the room
        let teamsToAssign: TeamDetails[] = [];
        
        if (room.level === "A") {
          teamsToAssign = levelATeams.filter(team => !assignedTeamIds.has(team.teamId));
        } else if (room.level === "B") {
          teamsToAssign = levelBTeams.filter(team => !assignedTeamIds.has(team.teamId));
        }

        // Assign teams to available seats in the room
        for (let i = 0; i < teamsToAssign.length; i++) {
          const team = teamsToAssign[i];
          const seatIndex = i * 3; // Calculate the seat index to skip 2 seats
          const seat = room.seatCodes[seatIndex]; // Get the seat from the room's available seats
          
          if (seat) {
            seatAssignments.push({
              siteId: team.siteId,
              teamSite: room.roomName,
              teamSeat: seat,
              teamId: team.teamId.toString(),
              teamName: team.teamName,
              teamLevel: team.teamLevel,
            });
            assignedTeamIds.add(team.teamId); // Mark this team as assigned
          }
        }
      }
    }

    try {
      // Send a request to the backend to update team seats.
      await sendRequest.put('/competition/staff/seat_assignments', { compId: compId, seatAssignments: seatAssignments });
    } catch (error) {
      console.error("Error withdrawing from the team:", error);
    }

    setTeamSeatAssignments(seatAssignments);
    setSeatModalState(true);
  };

  const handleDownload = () => {

    // Group seat assignments by site
    const formattedData: exportSeatAssignment = {
      siteName,
      siteCapacity,
      teams: teamSeatAssignments
    };

    // Prepare the CSV data and add headers
    const csvRows = [];
    csvRows.push(["Site Name", "Site Capacity", "Team Level", "Team ID", "Team Name", "Team Seat"].join(","));

    // Add data rows
    formattedData.teams.forEach(assignment => {
      const row = [
        formattedData.siteName,
        formattedData.siteCapacity,
        assignment.teamLevel,
        assignment.teamId,
        assignment.teamName,
        assignment.teamSeat
      ];
      csvRows.push(row.join(","));
    });

    // CSV blob
    const csvString = csvRows.join("\n");
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    // Tigger the download
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", "seat_assignments.csv");
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link);
  };

  const handleNotifyTeams = () => {
    // Logic for notifying teams (placeholder)
    console.log("Teams notified");
  };

  return (
    <ManageContainer>
      <Header>
        <Title>Manage Seats for CSE Building K17</Title>
        <DistributeSeats>
          <SeatCount>Team Seats Available: {seatCount}</SeatCount>
          {(seatString.length > 0 || rooms.length > 0) &&
            <AssignSeatsButton 
              actionType="secondary" 
              onClick={distributeSeats} 
              label="Assign Seats" 
              isOpen={false} 
              icon={<FaChair />}
            />
          }
        </DistributeSeats>
      </Header>

      {/* Seat Input Type Selection */}
      <SeatInputSelect>
        <RadioButton
          label="Select Seat Input Method"
          options={["Text", "Inputs"]}
          selectedOption={seatInputType}
          onOptionChange={(e) => {
            setSeatInputType(e.target.value);
            setIsTextInput(e.target.value === "Text");
            setGeneratedSeats([]);
            setSeatString("");
            setExistingSeats([]);
            setRooms([]);
          }}
          required={true}
          descriptor="Choose a method to provide the seat details for your site"
        />
        {isTextInput  && 
          <RadioButton
            label="Levels A and B Seating"
            options={["Together", "Separate"]}
            selectedOption={seatAB}
            onOptionChange={(e) => {
              setSeatAB(e.target.value);
              setIsSeatedTogether(e.target.value === "Together");
            }}
            required={true}
          />
        }
      </SeatInputSelect>

      <InputSection>
        {isTextInput && 
          <DescriptiveTextInput
            descriptor="Please enter all available seat names separated by commas"
            placeholder="e.g., Bongo00, Bongo01, ..., Brass00, Brass01..."
            required={false}
            value={seatString}
            onChange={handleSeatStringChange}
            width="100%"
          />
        }

        {!isTextInput && 
          <InputContainer>
            <Levels>
              <LevelContainer>
                <InputTitleA>Level A</InputTitleA>
                <TextInput
                  label="Room Name"
                  placeholder="Bongo"
                  type="text"
                  required={true}
                  value={roomNameA} 
                  onChange={(e) => setRoomNameA(e.target.value)}
                  width="100%" 
                  descriptor="Please enter the name of the room/lab"
                />
                <DescriptiveTextInput
                  descriptor="Please enter all available seat codes separated by commas"
                  placeholder="e.g., 00, 01, 02..."
                  required={true}
                  value={seatCodeInputA}
                  onChange={handleSeatCodesA}
                  width="100%"
                />
              </LevelContainer>
              <LevelContainer>
                <InputTitleB>Level B</InputTitleB>
                <TextInput
                  label="Room Name"
                  placeholder="Bongo"
                  type="text"
                  required={true}
                  value={roomNameB} 
                  onChange={(e) => setRoomNameB(e.target.value)}
                  width="100%" 
                  descriptor="Please enter the name of the room/lab"
                />
                <DescriptiveTextInput
                  descriptor="Please enter all available seat codes separated by commas"
                  placeholder="e.g., 00, 01, 02..."
                  required={true}
                  value={seatCodeInputB}
                  onChange={handleSeatCodesB}
                  width="100%"
                />
              </LevelContainer>
            </Levels>

            <Button type="button" onClick={handleAddRoom} disabled={cannotAddRoom()}>
              Add Room
            </Button>
            {error && <div style={{ color: "red" }}>{error}</div>}

            <RoomList>
            {rooms.map((room, index) => (
              <RoomItem key={index}>
                <span>Room {room.roomName}</span>
                <span>Level {room.level}</span>
                <span>{room.numSeats} seats</span>
                <DeleteIcon onClick={() => handleDeleteRoom(room)}>
                  <FaTimes />
                </DeleteIcon>
              </RoomItem>
            ))}
          </RoomList>
          </InputContainer>
        }
      </InputSection>

      { seatModalState && (
        <ModalOverlay>
          <ModalContainer>
            <CloseButtonContainer>
              <CloseButton onClick={() => {
                setSeatModalState(false);
                setSeatString("");
              }}>
                <FaTimes />
              </CloseButton>
            </CloseButtonContainer>
            <AssignPopupText>Seats Assigned Successfully!</AssignPopupText>
            <ButtonContainer>
              <DownloadButton 
                actionType="primary" 
                onClick={handleDownload} 
                label="Download" 
                isOpen={false} 
                icon={<FaDownload />}
              />
              <NotifyButton 
                actionType="secondary" 
                onClick={handleNotifyTeams} 
                label="Notify Teams" 
                isOpen={false} 
                icon={<FaBell />}
              />
            </ButtonContainer>
          </ModalContainer>
        </ModalOverlay>
      )}
    </ManageContainer>
  );
};