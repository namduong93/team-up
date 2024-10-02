import { FC } from "react";
import { Link } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";

export const Landing: FC = () => {
  return (
    <FlexBackground>
      <div>
        <h1>This is the landing page</h1>
        
        <Link to={'/login'}>
          <button>Login</button>
        </Link>

        <Link to={'/signup'}>
          <button>Sign Up</button>
        </Link>
      </div>
    </FlexBackground>
  );
}