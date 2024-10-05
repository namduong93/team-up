import { FC, useState } from "react";
import { Link } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";

export const Landing: FC = () => {
  // defining states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    setEmail(email);
    setPassword(password);
  }
  return (
    <FlexBackground>
      <div style={styles.leftHalf}>
        <img
          src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png"
          style={styles.image}
        />
      </div>

      <div style={styles.rightHalf}>
        <div style={styles.formContainer}>
          <h1>Welcome</h1>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputContainer}>
              <label style={styles.inputHeading}>Email*</label>
              <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.inputBox}
                required
              />

              <label style={styles.inputHeading}>Password*</label>
              <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.inputBox}
                required
              />

              <label style={{ textDecoration: 'underline' }}>Forgot Password?</label>
            </div>
            
            <Link to={'/login'}>
              <button type="submit" style={styles.button}>Login</button>
            </Link>
          </form>

          <div>
            <span style={{ marginRight: '5px' }}>New Here?</span>
            <Link to={'/roleregistration'}>
              <span style={styles.signUpLink}>Sign Up</span>
            </Link>
          </div>
          
        </div>
      </div>
    </FlexBackground>
  );
}

const styles: Record<string, React.CSSProperties> = {
  leftHalf: {
    flex: 1, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rightHalf: {
    flex: 1, 
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // height: '100vh',
  }, 
  formContainer: {
    display: 'flex', 
    flexDirection: 'column',
    alignItems: 'center', 
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', 
    textAlign: 'left',
  },
  image: {
    maxWidth: '90%',
    maxHeight: '90%',
    // objectFit: 'contain',
    // width: 'auto',
    // height: 'auto',
  }, 
  inputBox: {
    padding: '10px',
    width: '350px',
    border: '1px solid #ccc',
    borderRadius: '10px',
    // marginTop: '5px',
    marginBottom: '10px',
  }, 
  inputHeading: {
    display: 'block', 
    textAlign: 'left',
    marginBottom: '5px',
    marginTop: '20px'
  },
  button: {
    width: '150px',
    height: '35px',
    border: '0px',
    borderRadius: '30px',
    backgroundColor: '#6688D2',
    marginTop: '35px',
    marginBottom: '40px',
    color: '#ffffff',
    fontSize: '16px',
    fontWeight: 'bold',
  },
  // signUpContainer: {
  //   display: 'flex',
  //   justifyContent: 'center',
  //   alignItems: 'center',
  // },
  signUpLink: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#6688D2',
  }
}