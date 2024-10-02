import { FC, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { useNavigate } from "react-router-dom";

export const SignUp: FC = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setName(name);
    alert(`Welcome ${name}`);
    navigate('/dashboard');
  }
  return (
  <FlexBackground>
    <h2>Sign Up Page</h2>
    <div> 
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="john smith" value={name}/>
        <button type="submit">Login</button>
        <button onClick={(e) => {
          e.preventDefault();
          navigate('/signup');
        }}>
          Create Account
        </button>
      </form>
    </div>
  </FlexBackground>
  );
}