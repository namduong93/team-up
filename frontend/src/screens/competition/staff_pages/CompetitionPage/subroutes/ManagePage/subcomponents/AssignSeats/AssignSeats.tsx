// SITE COORDS CAN UPLOAD A .CSV OF AVAILABLE SEATS/ROOMS
// CAN SORT TEAMS (ASSIGN 1 SEAT PER TEAM AND SKIP 2 EACH TIME)
// SEAT ASSIGNMENT NOTIFICATION TO ALL STUDENTS UPON CLOSE OF REGISTRATION TIME

import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { TeamDetails } from "../../../../../../../../../shared_types/Competition/team/TeamDetails";
import { sendRequest } from "../../../../../../../../utility/request";
import { Alert, AssignPopupText, AssignSeatsButton, Button, ButtonContainer, CloseButton, CloseButtonContainer, DeleteIcon, DistributeSeats, DownloadButton, Header, InputContainer, InputSection, InputTitleA, InputTitleB, LevelContainer, Levels, ManageContainer, ModalContainer, ModalOverlay, NotifyButton, RoomItem, RoomList, SeatCount, SeatInputSelect, TeamCount, Title } from "./AssignSeats.styles";
import { FaBell, FaChair, FaDownload, FaTimes } from "react-icons/fa";
import RadioButton from "../../../../../../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../../../../../../components/general_utility/DescriptiveTextInput";
import TextInput from "../../../../../../../../components/general_utility/TextInput";

interface AssignSeatsProps {
  siteName: string;
  siteCapacity: number;
  teamListState: any;
  siteOptionState: any;
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
  level: "Level A" | "Level B";
  seatCodes: string[]; // text string input of available seat codes for this room
  numSeats: number; // length of the seat codes array
};


export const AssignSeats: FC<AssignSeatsProps> = ({ siteName, siteCapacity, teamListState: [teamList, setTeamList], siteOptionState: [siteOption, setSiteOption] }) => {
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
  const [enoughSeats, setEnoughSeats] = useState<boolean>(false);

  // Filter by site
  let teamListToAssign = teamList;
  if (siteOption.value) {
    teamListToAssign = teamList.filter((team: TeamDetails) => team.siteId === parseInt(siteOption.value));
  };

  const numATeamsToAssign = teamListToAssign.filter((team: TeamDetails) => team.teamLevel === "Level A").length;
  const numBTeamsToAssign = teamListToAssign.filter((team: TeamDetails) => team.teamLevel !== "Level A").length;

  // Check if enough seats provided


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
    const level = isFormA ? "Level A" : "Level B";
    const roomName = (isFormA) ? roomNameA : roomNameB;
    const seatCodes = (isFormA) ? seatCodeInputA.split(',') : seatCodeInputB.split(',');
    const numSeats = seatCodes.length;
  
    // Validate room and seat codes
    const { valid, error } = validateRoomAndSeatCodes(roomName, level, seatCodes);
    if (!valid) {
      setError(<p>{error}</p>);
      if (level === "Level A") {
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
    if (level === "Level A") {
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

  // If not all fields are filled, disable add room button
  const cannotAddRoom = () => {
    const isFormAInvalid = !roomNameA || !seatCodeInputA;
    const isFormBInvalid = !roomNameB || !seatCodeInputB;
  
    // Cannot add a room if both forms are invalid
    return isFormAInvalid && isFormBInvalid;
  };

  const distributeSeats = async () => {
    const seatAssignments: SeatAssignment[] = [];
    const teamsToAssign = teamListToAssign;
    const levelATeams = [];
    const levelBTeams = [];
  
    for (const team of teamsToAssign) {
      const teamLevel = team.teamLevel;
      if (teamLevel === 'Level A') {
        levelATeams.push(team);
      } else if (teamLevel === 'Level B') {
        levelBTeams.push(team);
      }
    }
  
    if (isTextInput) {
      const availableSeats = seatString.split(",");
      if (!isSeatedTogether) {
        teamsToAssign.length = 0;
        teamsToAssign.push(...levelATeams, ...levelBTeams);
      }
  
      for (let i = 0; i < teamsToAssign.length; i++) {
        const seat = availableSeats[i * 3]; // Assign a seat, skipping 2 each time
        if (!seat) {
          console.warn("Not enough seats available for all teams.");
          break; // Stop assigning if there aren't enough seats
        }
  
        const team = teamsToAssign[i];
        seatAssignments.push({
          siteId: team.siteId,
          teamSite: team.teamSite,
          teamSeat: seat,
          teamId: team.teamId.toString(),
          teamName: team.teamName,
          teamLevel: team.teamLevel,
        });
      }
    } else {
      const availableRooms = rooms;
      const assignedTeamIds = new Set<number>();
  
      for (const room of availableRooms) {
        let teamsToAssign: TeamDetails[] = [];
        
        if (room.level === "Level A") {
          teamsToAssign = levelATeams.filter(team => !assignedTeamIds.has(team.teamId));
        } else if (room.level === "Level B") {
          teamsToAssign = levelBTeams.filter(team => !assignedTeamIds.has(team.teamId));
        }
  
        for (let i = 0; i < teamsToAssign.length; i++) {
          const seatIndex = i * 3;
          if (seatIndex >= room.seatCodes.length) {
            // console.warn(`Not enough seats available in room ${room.roomName} for all teams.`);
            console.log("not enough seats");
            break; // Stop assigning if there aren't enough seats
          }
  
          const team = teamsToAssign[i];
          const seat = room.roomName + room.seatCodes[seatIndex];
  
          if (!seat) {
            break; // Stop assigning if seat is undefined or no more seats left
          }
  
          seatAssignments.push({
            siteId: team.siteId,
            teamSite: room.roomName,
            teamSeat: seat,
            teamId: team.teamId.toString(),
            teamName: team.teamName,
            teamLevel: team.teamLevel,
          });
          assignedTeamIds.add(team.teamId);
        }
      }
    }
  
    setEnoughSeats(true);
      try {
        await sendRequest.put('/competition/staff/seat_assignments', { compId: compId, seatAssignments: seatAssignments });
      } catch (error) {
        console.error("Error withdrawing from the team:", error);
      }
    
      setTeamSeatAssignments(seatAssignments);
      setSeatString("");
      setRooms([]);
      setSeatModalState(true);
  };
  
  useEffect(() => {
    const seatToTeams = teamListToAssign.length;
    setEnoughSeats(seatCount < seatToTeams);
  }, [rooms, seatString, seatCount, teamListToAssign.length])

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
        siteName,
        siteCapacity,
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
    link.setAttribute("download", `seat_assignments_${siteOption.label}.csv`);
    document.body.appendChild(link);
    link.click(); // Trigger download
    document.body.removeChild(link);
  };

  const handleNotifyTeams = async() => {
    try {
      await sendRequest.post('/notification/team_seat_assignments', { compId: compId, seatAssignments: teamSeatAssignments });
    } catch (error) {
      console.error("Error notifying teams:", error);
    }
  };

  return (
    <ManageContainer>
      <Header>
        <div>
          <Title>Manage Seats for {siteOption.label}</Title>
          {enoughSeats && 
            <Alert>Warning! You do not have enough seats for your teams!</Alert>
          }
        </div>
        <DistributeSeats>
          <TeamCount $level="Level A">A Teams to Assign: {numATeamsToAssign}</TeamCount>
          <TeamCount $level="Level B">B Teams to Assign: {numBTeamsToAssign}</TeamCount>
          <SeatCount>Team Seats Available: {seatCount}</SeatCount>
          {(seatString.length > 0 || rooms.length > 0) && teamListToAssign.length > 0 && enoughSeats &&
            <AssignSeatsButton 
              actionType="secondary" 
              onClick={distributeSeats} 
              label="Assign Seats" 
              isOpen={false} 
              icon={<FaChair />}
              $disabled={!enoughSeats}
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