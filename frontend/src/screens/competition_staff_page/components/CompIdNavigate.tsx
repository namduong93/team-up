import { FC } from "react";
import { Navigate, useLocation, useParams } from "react-router-dom";

export const CompIdNavigate: FC<{ route: string }> = ({ route }) => {
  const { compId } = useParams();
  const location = useLocation();
  return (
    <Navigate to={`${route}/${compId}`} state={location.state} />
  );
}