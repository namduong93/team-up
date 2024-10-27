// SITE COORDS CAN UPLOAD A .CSV OF AVAILABLE SEATS/ROOMS
// CAN SORT TEAMS (ASSIGN 1 SEAT PER TEAM AND SKIP 2 EACH TIME)
// SEAT ASSIGNMENT NOTIFICATION TO ALL STUDENTS UPON CLOSE OF REGISTRATION TIME

import { FC } from "react";
import styled from "styled-components";

interface SeatMap {
  building: string; // e.g. CSE Building
  buildingCode: string; // e.g. K17
  lab: string; // e.g. "Bongo"
  capacity: number; // e.g. 30
  seat_start_code: string; // e.g. "00"
};

interface SeatAssignment {
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

// output JSON structure file:
// 

const ManageContainer = styled.div`
  display: flex;
  justify-content: space-around;
  max-width: 100%;
  width: 100%;
  height: 100%;
  max-height: 70%;
  align-items: center;
`;


export const ManageSite: FC = () => {

  return (
    <ManageContainer>
      <h3>Manage site actions</h3>
      <div>Assign seats</div>
    </ManageContainer>
  );
};
