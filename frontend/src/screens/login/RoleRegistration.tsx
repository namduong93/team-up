import { FC, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { useNavigate } from "react-router-dom";

export const RoleRegistration: FC = () => {
  // const navigate = useNavigate();
  // const [name, setName] = useState("");

  // const handleSubmit = async (e: { preventDefault: () => void; }) => {
  //   e.preventDefault();
  //   setName(name);
  //   alert(`Welcome ${name}`);
  //   navigate('/dashboard');
  // }

  const [role, setRole] = useState<'Student' | 'Staff' | null>(null);

  const handleRoleClick = (selectedRole: 'Student' | 'Staff') => {
    setRole(selectedRole);
  };
  
  return (
  <FlexBackground style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
    <h1 style={{ textAlign: 'center' }}>
      What is your role?
    </h1>

    <div style={styles.roleContainer}>
      <button 
      style={{
        ...styles.studentButton, 
      border: role === 'Student' ? '1.5px solid #558964' : '0px'}}
      onClick={() => handleRoleClick('Student')}
      >
        Student
      </button>


      <button style={{
        ...styles.staffButton,
        border: role === 'Staff' ? '1.5px solid #AD0B0B' : '0px'}}
        onClick={() => handleRoleClick('Staff')}
      >
        Staff
      </button>
    </div>

    <button style={styles.button}>Next</button>

  </FlexBackground>
  );
}

const styles = {
  roleContainer: {
    display: 'flex',
    justifyContent: 'center',
  },
  studentButton: {
    // border: '1.5px solid #558964',
    border: '0px',
    borderRadius: '10px',
    margin: '50px',
    width: '300px',
    height: '300px',
    fontSize: '25px',
    backgroundColor: '#BFF4BE',
    color: '#558964',
    cursor: 'pointer',
  },
  staffButton: {
    // border: '1.5px solid #AD0B0B',
    border: '0px',
    borderRadius: '10px',
    margin: '50px',
    width: '300px',
    height: '300px',
    fontSize: '25px',
    backgroundColor: '#FEB1B1',
    color: '#AD0B0B',
    cursor: 'pointer',
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
    cursor: 'pointer',
  },
}