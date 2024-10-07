import { FC } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import { useNavigate } from "react-router-dom";
import { useMultiStepRegoForm } from "./MultiStepRegoForm";

export const RoleRegistration: FC = () => {
  const navigate = useNavigate();
  const { formData, setFormData } = useMultiStepRegoForm();


  const handleRoleClick = (selectedRole: 'Student' | 'Staff') => {
    setFormData({ ...formData, role: selectedRole });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.role) {
      alert('Please select a role before proceeding');
      return;
    }

    navigate('/accountinformation');
  };
  
  return (
    <FlexBackground style={{ flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
      <form onSubmit={handleSubmit} style={styles.formContainer}>
        <h1 style={{ textAlign: 'center', fontFamily: 'Arial, Helvetica, sans-serif' }}>
          What is your role?
        </h1>

        <div style={styles.roleContainer}>
          <button 
            type='button'
            style={{
              ...styles.roleButton, 
              backgroundColor: '#BFF4BE',
              color: '#558964',
              border: formData.role === 'Student' ? '1.5px solid #558964' : '0px'
            }}
            onClick={() => handleRoleClick('Student')}
          >
            Student
          </button>

          <button
            type='button' 
            style={{
              ...styles.roleButton,
              backgroundColor: '#FEB1B1',
              color: '#AD0B0B',
              border: formData.role === 'Staff' ? '1.5px solid #AD0B0B' : '0px'
            }}
            onClick={() => handleRoleClick('Staff')}
          >
            Staff
          </button>
        </div>

        <button 
          type='submit' 
          style={{
            ...styles.button,
            backgroundColor: formData.role ? '#6688D2' : '#ccc',
            cursor: formData.role ? 'pointer' : 'not-allowed'
          }}
          disabled={!formData.role}
        >
          Next
        </button>
      </form>
    </FlexBackground>
  );
}

const styles: Record<string, React.CSSProperties> = {
  formContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  roleContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  roleButton: {
    border: '0px',
    borderRadius: '10px',
    margin: '50px',
    width: '300px',
    height: '300px',
    fontSize: '25px',
    cursor: 'pointer',
    fontFamily: 'Arial, Helvetica, sans-serif',
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
    fontFamily: 'Arial, Helvetica, sans-serif',
  },
}