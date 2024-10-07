import React from 'react';

// Define the type for the props
interface Step {
  label: string;
  active: boolean;
}

interface ProgressBarProps {
  steps: Step[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ steps }) => {
  return (
    <div style={styles.container}>
      {steps.map((step, index) => (
        <div key={index} style={styles.stepContainer}>
          <div
            style={{
              ...styles.circle,
              backgroundColor: step.active ? '#8DA4F2' : '#FFFFFF',
              border: step.active ? 'none' : '1px solid #C4C4C4',
            }}
          />
          <div style={styles.label}>{step.label}</div>
          {index < steps.length - 1 && <div style={styles.line} />}
        </div>
      ))}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E5E5E5',
    padding: '20px',
    borderRadius: '8px',
    width: '300px',
    // height: 'calc(100vh - 40px)', // Use full height of the viewport minus the top/bottom padding
    margin: '20px', 
  },
  stepContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  circle: {
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    marginBottom: '10px',
  },
  label: {
    fontSize: '14px',
    textAlign: 'center',
  },
  line: {
    width: '2px',
    height: '30px',
    backgroundColor: '#C4C4C4',
    margin: '10px 0',
  },
};

export default ProgressBar;
