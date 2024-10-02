import { FC } from "react";
import { FlexBackground } from "../components/general_utility/Background";
import { useNavigate } from "react-router-dom";

export const Profile: FC = () => {
  const navigate = useNavigate();

  return (
  <FlexBackground>
    <h2>Profile Page</h2>
    <div> 
      <button onClick={(e) => {
            e.preventDefault();
            navigate('/dashboard');
          }}>
            Go back to dashboard
          </button>
    </div>
  </FlexBackground>
  );
}