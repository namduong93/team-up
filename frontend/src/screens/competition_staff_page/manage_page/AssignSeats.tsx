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
import { TeamDetails } from "../teams_page/components/TeamCard";

interface AssignSeatsProps {
  siteName: string;
  siteCapacity: number;
};

const mockSeatString: string = "Bongo00,Bongo01,Bongo02,Bongo03,Bongo04,Bongo05,Bongo06,Bongo07,Bongo08,Bongo09,Brass00,Brass01,Brass02,Brass03,Brass04,Brass05,Brass06,Brass07,Brass08,Brass09";
const mockRooms: Room[] = [
  {
    roomName: "Bongo",
    level: "A",
    seatCodes: ["Bongo00", "Bongo01", "Bongo02", "Bongo03", "Bongo04"],
    numSeats: 10,
  },
  {
    roomName: "Bongo",
    level: "B",
    seatCodes: ["Bongo05", "Bongo06", "Bongo07", "Bongo08", "Bongo09"],
    numSeats: 10,
  },
  {
    roomName: "Brass",
    level: "A",
    seatCodes: ["Brass00", "Brass01", "Brass02", "Brass03", "Brass04"],
    numSeats: 10,
  },
  {
    roomName: "Brass",
    level: "B",
    seatCodes: ["Brass05", "Brass06", "Brass07", "Brass08", "Brass09"],
    numSeats: 10,
  },
];

const mockTeams: TeamDetails[] = [
  {
    teamId: 1,
    universityId: 101,
    teamName: "Code Warriors",
    students: [
      {
        userId: 12345,
        name: "Alice Johnson",
        email: "alice.johnson@example.com",
        bio: "Computer Science student passionate about AI.",
        preferredContact: "email:alice.johnson@example.com",
        siteId: 1,
        ICPCEligible: true,
        level: "A",
        boersenEligible: false,
        isRemote: false,
      },
      {
        userId: 12346,
        name: "Bob Smith",
        email: "bob.smith@example.com",
        bio: "Software engineering major with a focus on backend.",
        preferredContact: "slack:bobsmith",
        siteId: 1,
        ICPCEligible: true,
        level: "A",
        boersenEligible: true,
        isRemote: false,
      },
      {
        userId: 12347,
        name: "Charlie Brown",
        email: "charlie.brown@example.com",
        bio: "Interested in cloud computing and distributed systems.",
        preferredContact: "email:charlie.brown@example.com",
        siteId: 1,
        ICPCEligible: false,
        level: "A",
        boersenEligible: false,
        isRemote: true,
      }
    ],
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "A",
    startDate: new Date(),
    coach: {
      name: "",
      email: "",
      bio: ""
    }
  },
  {
    teamId: 2,
    universityId: 102,
    teamName: "Byte Size",
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "B",
    startDate: new Date(),
    students: [
      {
        userId: 22345,
        name: "David Lee",
        email: "david.lee@example.com",
        bio: "Loves problem-solving and enjoys competitive programming.",
        preferredContact: "email:david.lee@example.com",
        siteId: 102,
        ICPCEligible: true,
        level: "B",
        boersenEligible: true,
        isRemote: false,
      },
      {
        userId: 22346,
        name: "Eva Green",
        email: "eva.green@example.com",
        bio: "Passionate about algorithms and optimization.",
        preferredContact: "slack:evagreen",
        siteId: 102,
        ICPCEligible: false,
        level: "B",
        boersenEligible: false,
        isRemote: false,
      },
      {
        userId: 22347,
        name: "Frank Wright",
        email: "frank.wright@example.com",
        bio: "Backend developer with experience in cloud technologies.",
        preferredContact: "email:frank.wright@example.com",
        siteId: 102,
        ICPCEligible: true,
        level: "B",
        boersenEligible: true,
        isRemote: true,
      },
    ],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  },
  {
    teamId: 3,
    universityId: 103,
    teamName: "Algorithm Avengers",
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "A",
    startDate: new Date(),
    students: [
      {
        userId: 32345,
        name: "Grace Taylor",
        email: "grace.taylor@example.com",
        bio: "Enjoys tackling hard algorithmic challenges.",
        preferredContact: "email:grace.taylor@example.com",
        siteId: 103,
        ICPCEligible: true,
        level: "A",
        boersenEligible: false,
        isRemote: false,
      },
      {
        userId: 32346,
        name: "Hank Cooper",
        email: "hank.cooper@example.com",
        bio: "Specializes in system design and data structures.",
        preferredContact: "slack:hankcooper",
        siteId: 103,
        ICPCEligible: true,
        level: "A",
        boersenEligible: false,
        isRemote: true,
      },
      {
        userId: 32347,
        name: "Isabella Rodriguez",
        email: "isabella.rodriguez@example.com",
        bio: "Frontend developer with a passion for design.",
        preferredContact: "email:isabella.rodriguez@example.com",
        siteId: 103,
        ICPCEligible: false,
        level: "A",
        boersenEligible: true,
        isRemote: false,
      },
    ],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  },
  {
    teamId: 4,
    universityId: 104,
    teamName: "Debugging Ninjas",
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "B",
    startDate: new Date(),
    students: [
      {
        userId: 42345,
        name: "Jack Thompson",
        email: "jack.thompson@example.com",
        bio: "Specializes in debugging complex codebases.",
        preferredContact: "slack:jackthompson",
        siteId: 104,
        ICPCEligible: true,
        level: "B",
        boersenEligible: false,
        isRemote: true,
      },
      {
        userId: 42346,
        name: "Kimberly Yang",
        email: "kimberly.yang@example.com",
        bio: "Interested in cybersecurity and network protocols.",
        preferredContact: "email:kimberly.yang@example.com",
        siteId: 104,
        ICPCEligible: true,
        level: "B",
        boersenEligible: false,
        isRemote: false,
      },
      {
        userId: 42347,
        name: "Leo Kim",
        email: "leo.kim@example.com",
        bio: "Aspires to become a data scientist.",
        preferredContact: "email:leo.kim@example.com",
        siteId: 104,
        ICPCEligible: false,
        level: "B",
        boersenEligible: false,
        isRemote: false,
      },
    ],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  },
  {
    teamId: 5,
    universityId: 105,
    teamName: "Code Breakers",
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "A",
    startDate: new Date(),
    students: [
      {
        userId: 52345,
        name: "Mia Chen",
        email: "mia.chen@example.com",
        bio: "Enjoys working with AI and machine learning.",
        preferredContact: "slack:miachen",
        siteId: 105,
        ICPCEligible: true,
        level: "A",
        boersenEligible: true,
        isRemote: false,
      },
      {
        userId: 52346,
        name: "Nathan Patel",
        email: "nathan.patel@example.com",
        bio: "Passionate about blockchain technologies.",
        preferredContact: "email:nathan.patel@example.com",
        siteId: 105,
        ICPCEligible: true,
        level: "A",
        boersenEligible: true,
        isRemote: true,
      },
      {
        userId: 52347,
        name: "Olivia Kim",
        email: "olivia.kim@example.com",
        bio: "Aspires to build impactful mobile apps.",
        preferredContact: "email:olivia.kim@example.com",
        siteId: 105,
        ICPCEligible: false,
        level: "A",
        boersenEligible: false,
        isRemote: false,
      },
    ],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  },
  {
    teamId: 6,
    universityId: 106,
    teamName: "Code Crunchers",
    status: "Registered",
    teamNameApproved: true,
    compName: "",
    teamSite: "",
    teamLevel: "B",
    startDate: new Date(),
    students: [
      {
        userId: 52345,
        name: "Ava Thompson",
        email: "ava.thompson@example.com",
        bio: "Interested in web development and UX design.",
        preferredContact: "slack:avathompson",
        siteId: 106,
        ICPCEligible: true,
        level: "B",
        boersenEligible: true,
        isRemote: false,
      },
      {
        userId: 52346,
        name: "Leo Martinez",
        email: "leo.martinez@example.com",
        bio: "Backend developer focused on scalability.",
        preferredContact: "email:leo.martinez@example.com",
        siteId: 106,
        ICPCEligible: true,
        level: "B",
        boersenEligible: true,
        isRemote: true,
      },
      {
        userId: 52347,
        name: "Mia Patel",
        email: "mia.patel@example.com",
        bio: "Loves working with databases and data analytics.",
        preferredContact: "email:mia.patel@example.com",
        siteId: 106,
        ICPCEligible: false,
        level: "B",
        boersenEligible: false,
        isRemote: false,
      },
    ],
    coach: {
      name: "",
      email: "",
      bio: "",
    },
  },
];

interface SeatAssignment {
  siteId: string; // ID of the site
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

// TODO route: send the new seat string for a team given the teamID

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

  const distributeSeats = () => {
    
    // Assign one seat per team, skipping two each time
    const seatAssignments: SeatAssignment[] = [];
    const teamsToAssign = mockTeams; // Use mock teams

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
      const availableSeats = mockSeatString.split(",");
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
            siteId: "mockSiteID", // Set this to your site ID
            teamSite: "CSE Building K17", // Set this to the correct site name
            teamSeat: seat,
            teamId: team.teamId.toString(),
            teamName: team.teamName,
            teamLevel: team.teamLevel,
          });
        }
      }
    } else {
      // if specific room level input given, need to split based on provided room seat assignments
      const availableRooms = mockRooms; // use mock room data
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
              siteId: "mockSiteID", // mock site id
              teamSite: room.roomName, // mock site name
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
    // TODO: route to update team seats based on seat assignments
    console.log("Assigned Seats:", seatAssignments);
    console.log("Seats assigned!");
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
          <AssignSeatsButton 
            actionType="secondary" 
            onClick={distributeSeats} 
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