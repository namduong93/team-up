interface StudentStatusProps extends React.HTMLAttributes<HTMLDivElement> {
  isMatched: boolean;
}

export const StudentStatus: FC<StudentStatusProps> = ({ children, isMatched = false, style, ...props }) => {

  return (
    <div style={{
      width: '80%',
      height: '50%',
      minHeight: '25px',
      maxWidth: '160px',
      lineHeight: '1',
      backgroundColor: isMatched ? 'rgba(139, 223, 165, 54%)' : 'rgba(255, 29, 32, 28%)',
      color: isMatched ? '#63A577' : '#ED1E21',
      border: `1px solid ${isMatched ? '#63A577' :'#FF1D20'}`,
      borderRadius: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxSizing: 'border-box',
      ...style,
    }} {...props}>
      {children}
    </div>
  )
}