// SITE COORDS CAN UPLOAD A .CSV OF AVAILABLE SEATS/ROOMS
// CAN SORT TEAMS (ASSIGN 1 SEAT PER TEAM AND SKIP 2 EACH TIME)
// SEAT ASSIGNMENT NOTIFICATION TO ALL STUDENTS UPON CLOSE OF REGISTRATION TIME

import { ChangeEvent, FC, ReactNode, useEffect, useState } from "react";
import styled from "styled-components";
import RadioButton from "../../../components/general_utility/RadioButton";
import DescriptiveTextInput from "../../../components/general_utility/DescriptiveTextInput";
import TextInput from "../../../components/general_utility/TextInput";
import { FaBell, FaChair, FaDownload, FaFileCsv, FaTimes } from "react-icons/fa";
import { TransparentResponsiveButton } from "../../../components/responsive_fields/ResponsiveButton";
import { TeamDetails } from "../teams_page/components/TeamCard";

interface SeatAssignment {
  siteId: string; // ID of the site
  teamSite: string; // e.g. "CSE Building K17"
  teamSeat: string; // e.g. "Bongo01"
  teamId: string; // ID of team who have been assigned that seat
  teamName: string; // name of team at the assigned seat
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

// route: send the new seat string for a team given the teamID


// output JSON structure file:
// "Bongo00, Bongo01, Bongo02"

// user inputs:
// RoomName: "Brass"
// Number of Seats: 16
// Start seat code: 774 || "A"


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
`;

interface AssignSeatsProps {
  siteName: string;
  siteId: string;
};

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

  &:hover {
    background-color: ${({ theme }) => theme.colours.confirmDark};
    color: ${({ theme }) => theme.background};
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
  background-color: ${({ theme }) => theme.background};
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
`;

const NotifyButton = styled(TransparentResponsiveButton)`
  background-color: ${({ theme }) => theme.colours.secondaryLight};
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

// export const AssignSeats: FC<AssignSeatsProps> = ({ siteName, siteId }) => {
  export const AssignSeats: FC = () => {
  const [seatInputType, setSeatInputType] = useState<string>("Text"); // either string or inputs
  const [seatAB, setSeatAB] = useState<string>("Together"); // seat level a and b either together or separately
  const [isSeatedTogether, setIsSeatedTogether] = useState<boolean>(false);
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

  // TODO: for the seat string input, need to sort by team levels a and b
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

  const assignSeats = () => {
    // Logic to assign seats based on the teams and rooms
    console.log("Seats assigned!"); // Placeholder for actual logic
    setSeatModalState(true);
  };

  const handleDownload = () => {
    // Logic for downloading the seat assignment (placeholder)
    console.log("Download seats data");
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
          <AssignSeatsButton 
            actionType="secondary" 
            onClick={assignSeats} 
            label="Assign Seats" 
            isOpen={false} 
            icon={<FaChair />}
          />
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
              <CloseButton onClick={() => setSeatModalState(false)}>
                <FaTimes />
              </CloseButton>
            </CloseButtonContainer>
            <h2>Seats Assigned Successfully!</h2>
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