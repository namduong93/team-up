import { FC } from "react";
import { Navigate, useParams } from "react-router-dom";

export const CompIdNavigate: FC<{ route: string }> = ({ route }) => {
  const { compId } = useParams();
  return (
    <Navigate to={`${route}/${compId}`} />
  );
}