import { FC, useEffect, useState } from "react";
import styled from "styled-components";
import { StaffActionCard } from "./components/StaffActionCard";
import { sendRequest } from "../../../utility/request";
import { useParams } from "react-router-dom";
import { useCompetitionOutletContext } from "../hooks/useCompetitionOutletContext";
import { CompetitionRole } from "../../../../shared_types/Competition/CompetitionRole";

const ManageContainer = styled.div`
  width: 100%;
  height: 70%;
`;

export const StaffManage: FC = () => {
  const { compId } = useParams();
  const [roles, setRoles] = useState<Array<CompetitionRole>>([]);
  const { compDetails, universityOption  } = useCompetitionOutletContext('manage'); 

  const compCode = compDetails.code ?? "COMP1234";

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
      <StaffActionCard universityOption={universityOption} staffRoles={roles} compCode={compCode}/>

    </ManageContainer>
  );
};
