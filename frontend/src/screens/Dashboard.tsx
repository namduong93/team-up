import { FC } from "react";
import { FlexBackground } from "../components/general_utility/Background";
import { useNavigate } from "react-router-dom";

export const Dashboard: FC = () => {
  const navigate = useNavigate();

  return (
  <FlexBackground>
    <h2>Dashboard Page</h2>
    <div> 
      <button onClick={(e) => {
          e.preventDefault();
          navigate('/profile');
        }}>
          Go to profile
      </button>
    </div>
  </FlexBackground>
  );
}