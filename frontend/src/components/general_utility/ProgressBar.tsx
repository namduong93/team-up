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

// put everything dots, text and lines in a div container that is also a flex
// box that centers it and has enough width to fit the contents
// might
// circles and lines in one container div -> flex box
// centers horizontally column flex direction
// text in another div --> column flex direction
// make sure that the heights line up so that the text is next to the circles
// put multiple different divs containing text 
// both of those should be wrapped in one big div to the container 
// big div is horizontally
// having a div as a wrapper works fine
// need actual sidebar to justify left to arrange left (mkae flex, flex start, might work automatically)
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
