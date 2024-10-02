import { FC, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { useNavigate } from "react-router-dom";

export const Login: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setName(name);
    alert(`Welcome ${name}`);
    navigate('../Dashboard.tsx');
  }
  return (
  <FlexBackground>
    <h2>Login Page</h2>
    <div> 
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="john smith" value={name}/>
        <button type="submit">Login</button>
        <button onClick={(e) => {
          e.preventDefault();
          navigate('./SignUp.tsx');
        }}>
          Create Account
        </button>
      </form>
    </div>
  </FlexBackground>
  );
}