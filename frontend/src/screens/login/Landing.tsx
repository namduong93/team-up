import React, { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FlexBackground } from "../../components/general_utility/Background";
import { sendRequest } from "../../utility/request";
import styled from "styled-components";
import TextInput from "../../components/general_utility/TextInput";

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
      console.error('Login failed', error)
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
          <h1 style={{fontFamily: 'Arial, Helvetica, sans-serif', fontStyle: 'italic'}}>Welcome</h1>

          <div style={{width: '68%'}}>
          <TextInput
            label="Email"
            placeholder="email@example.com"
            type="email"
            required={true}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            width="97%" // Custom width
          />

          </div>

          <div style={{ width: '68%' }}>
            <TextInput
              label="Password"
              placeholder="Enter your password"
              type="password"
              required={true}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              width="97%" // Custom width
            />
          </div>
          <div style={{ width: '68%', textAlign: 'left', marginTop: '-16px' }}>
            <label style={{ textDecoration: 'underline', fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '12px', cursor: 'pointer' }}>
              Forgot Password?
            </label>
          </div>

          {/*
          The onSubmit of the form should use a useNavigate() navigate function 
          to navigate to the next page rather than use Link
          because I think that the link would actually stop the form submission.
          Also ruins the sizing/styling that we might want from the prent container
          */}
          <CustomButton type="submit" style={styles.button}>Login</CustomButton>

          <div>
            <span style={{ marginRight: '5px', fontFamily: 'Arial, Helvetica, sans-serif' }}>New Here?</span>
            <span
              style={styles.signUpLink}
              onClick={() => navigate('/roleregistration')}
            >
            Sign Up
            </span>
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
  signUpLink: {
    cursor: 'pointer',
    textDecoration: 'underline',
    color: '#6688D2',
    fontFamily: 'Arial, Helvetica, sans-serif'
  }
}