// SITE COORDS CAN UPLOAD A .CSV OF AVAILABLE SEATS/ROOMS
// CAN SORT TEAMS (ASSIGN 1 SEAT PER TEAM AND SKIP 2 EACH TIME)
// SEAT ASSIGNMENT NOTIFICATION TO ALL STUDENTS UPON CLOSE OF REGISTRATION TIME

import { FC } from "react";
import styled from "styled-components";

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
