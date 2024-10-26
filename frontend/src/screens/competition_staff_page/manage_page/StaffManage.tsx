// should be able to edit competition details (APPLIES TO ALL UNIS - ADMIN ONLY)

// should be able to edit rego form (APPLIES TO 1 UNI - COACH)
// should be able to assign seats (APPLIES TO 1 UNI - SITE COORD)

// COACHES CAN UDPATE THEIR REGISTRATION FORM FOR THIS COMP
// COACHES CAN UPDATE THEIR COMP BLURB FOR THIS COMP

// SITE COORD ACTION BUTTON LEADS TO MANAGE SITE

import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { StaffActionCard } from "./components/StaffActionCard";
import { sendRequest } from "../../../utility/request";
import { useParams } from "react-router-dom";
import { CompetitionRole } from "../CompetitionPage";

const ManageContainer = styled.div`
  width: 100%;
  height: 70%;
`;

export const StaffManage: FC = () => {
  const { compId } = useParams();
  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);

  // Fetch the user type and set the state accordingly
  useEffect(() => {
    const fetchRoles = async () => {
      const roleResponse = await sendRequest.get<{ roles: Array<CompetitionRole> }>('/competition/roles', { compId });
      const { roles } = roleResponse.data;
      setRoles(roles);
    }
    fetchRoles();
  }, [])

  return (
    <ManageContainer>
      <StaffActionCard staffRoles={roles} />
    </ManageContainer>
  );
};
