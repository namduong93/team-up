import React, { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import { sendRequest } from "../../utility/request";
import styled from "styled-components";

const CustomButton = styled.button`
  cursor: pointer;
  &:hover {
    
  }
`

export const Landing: FC = () => {

  const navigate = useNavigate();
  // defining states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await sendRequest.post('/user/login');
      navigate('/dashboard')
    } catch (error: unknown) {

    };
  }
  return (
    <FlexBackground style={{
      justifyContent: 'center',
      alignItems: 'center',
      flexWrap: 'wrap',
      
    }}>
      <div style={{
        width: '600px',
        flex: '0 1 auto'
      }}>
        <img
          src="https://sppcontests.org/wp-content/uploads/2024/02/RGB_SPCPA_Logo_24@4x-2.png"
          style={styles.image}
        />
      </div>
        <form onSubmit={handleSubmit} style={styles.formContainer}>
          <h1>Welcome</h1>

          {/* 68% to match the 65% from the input and the 3% of padding */}
          <div style={{width: '68%'}}>
            <label style={styles.inputHeading}>Email*</label>
          </div>
          <input
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                style={styles.inputBox}
                required
          />

          <div style={{ width: '68%' }}>
            <label style={styles.inputHeading}>Password*</label>
          </div>
          <input
                type='password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                style={styles.inputBox}
                required
              />
          <div style={{
            width: '68%'
          }}>
            <label style={{ textDecoration: 'underline', textAlign: 'left', display: 'block' }}>Forgot Password?</label>
          </div>

          {/*
          The onSubmit of the form should use a useNavigate() navigate function 
          to navigate to the next page rather than use Link
          because I think that the link would actually stop the form submission.
          Also ruins the sizing/styling that we might want from the prent container
          */}
          <CustomButton type="submit" style={styles.button}>Login</CustomButton>

          <div>
            <span style={{ marginRight: '5px' }}>New Here?</span>
            <Link to={'/roleregistration'}>
              <span style={styles.signUpLink}>Sign Up</span>
            </Link>
          </div>
          
        </form>
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
    width: '500px',
    height: '500px',
    flexShrink: '1',
    flexDirection: 'column',
    alignItems: 'center', 
    textAlign: 'center',
  },
  inputContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start', 
    textAlign: 'left',
    width: '100%',
    height: '100%',
  },
  image: {
    width: '100%',
    // maxWidth: '90%',
    // maxHeight: '90%',
    // objectFit: 'contain',
    // width: 'auto',
    // height: 'auto',
  }, 
  inputBox: {
    padding: '10px 1.5% 10px 1.5%',
    width: '65%',
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
    width: '30%',
    minWidth: '74px',
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