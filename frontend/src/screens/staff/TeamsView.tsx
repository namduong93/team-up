import React, { FC, MouseEventHandler, ReactNode, useState } from "react";
import { FlexBackground } from "../../components/general_utility/Background";
import styled from "styled-components";

interface TeamCardProps {
  teamDetails: {
    teamName: string;
    memberName1?: string;
    memberName2?: string;
    memberName3?: string;
    status: 'pending' | 'registered' | 'unregistered';
  }
}

const colorMap = {
  'pending': '#F48385',
  'unregistered': '#FDD386',
  'registered': '#8BDFA5',
}

export const TeamCardMember = ({ memberName }: { memberName: string }) => {

  return (
  <div style={{
    width: '100%',
    height: '100%',
    display: 'grid',
    gridTemplateRows: '100%',
    gridTemplateColumns: '20% 80%',
    userSelect: 'none',
  }} draggable='false'>
    <img style={{
      width: '50%',
      minWidth: '18px',
      margin: 'auto 0 auto 25%',
      pointerEvents: 'none',
      userSelect: 'none',
    }} src="/user.svg" draggable='false' />
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
    }}>
      {memberName}
    </div>
  </div>
  );
}

const StyledHoverDiv = styled.div`
  transition: transform 100ms;
  &:hover {
    transform: translate(2px, 2px);
  }
`

export const TeamCard = ({ teamDetails }: TeamCardProps) => {
  const [statusColor, setStatusColor] = useState(colorMap[teamDetails.status]);

  return (
    <StyledHoverDiv style={{
      display: 'flex',
      flexWrap: 'wrap',
      flexDirection: 'column',
      width: '100%',
      // height: '100%',
      minHeight: '260px',
      maxHeight: '260px',
      maxWidth: '294px',
      minWidth: '140px',
      flex: '0 1 auto', 
      borderRadius: '20px 20px 20px 20px',
      boxShadow: '0 4px 4px 0 rgba(0, 0, 0, 0.25)',
      userSelect: 'none',
    }}>
      <div style={{
        backgroundColor: statusColor,
        height: '58px',
        width: '100%',
        borderRadius: '20px 20px 0px 0px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <span style={{
          fontSize: '24px',
          marginLeft: '5%'
        }}>{teamDetails.teamName}</span>
      </div>

      <div style={{
        backgroundColor: 'white',
        flex: '1 1 auto',
        borderRadius: '0px 0px 20px 20px',
        border: '1px solid rgba(0, 0, 0, 0.25)',
        borderTop: '0',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {teamDetails.memberName1 && <div style={{
          borderRadius: '10px',
          border: '1px solid rgb(200, 200, 200)',
          width: '85.37%',
          height: '20.79%',
        }}><TeamCardMember memberName={teamDetails.memberName1} /></div>}

        {teamDetails.memberName2 && <div style={{
          borderRadius: '10px',
          border: '1px solid rgb(200, 200, 200)',
          width: '85.37%',
          height: '20.79%',
        }}><TeamCardMember memberName={teamDetails.memberName2} /></div>}

        {teamDetails.memberName3 && <div style={{
          borderRadius: '10px',
          border: '1px solid rgb(200, 200, 200)',
          width: '85.37%',
          height: '20.79%',
        }}><TeamCardMember memberName={teamDetails.memberName3} /></div>}

      </div>

    </StyledHoverDiv>
  )
}

interface ToggleSwitchProps {
  contents: Array<ReactNode>;
  callbacks: Array<CallableFunction>;
  style: React.CSSProperties;
}



// TODO: THIS PART IS REALLY MESSY and should probably be replaced with some premade component or
// more carefully constructed custom component if none suffice.
export const CustomToggleSwitch = ({ contents, callbacks, style }: ToggleSwitchProps) => {

  const [borderIndex, setBorderIndex] = useState(0);

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    const target = e.currentTarget as HTMLDivElement;
    const ind = target.getAttribute('data-index');
    setBorderIndex(Number(ind));
  }

  return (
    <div style={{
      display: 'flex',
      userSelect: 'none',
      ...style
    }}>
      {contents.map((content, index) => {
        return (
        <div onClick={handleClick} style={{
          flex: '1',
          borderWidth: `${index === borderIndex ? '2px' : '0'}`,
          borderBottom: `${index === borderIndex ? '2px' : '0'} solid black`,
          cursor: 'pointer'
        }} data-index={index} key={index}>
          {content}
        </div>);
      })}
    </div>
  )
}


export const TeamsView: FC = () => {

  return (
    
  <FlexBackground style={{
    overflowX: 'auto'
  }}>
    {/* Sidebar */}
    <div style={{
          backgroundColor: '#D9D9D9',
          width: '78px',
          minWidth: '78px',
          height: '94.92%',
          borderRadius: '20px',
          margin: 'auto 0 auto 0',
    }} />


    <div style={{
      flex: '1 1 auto',
      display: 'flex',
      justifyContent: 'center',
    }}> 
      <div style={{
        flex: '0 1 auto',
        width: '100%',
        maxWidth: '1700px',
        minHeight: '600px',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}>

        {/* Page header */}
        <div style={{
          minHeight: '172px',
          width: '100%',
        }}>
          <div style={{
            marginTop: '56px'
          }}>
            <h1 style={{
              marginBottom: '0',
              fontSize: '2.5em'
            }}>Coach Page</h1>
          </div>
          <div>
            <span style={{ color: '#525252', fontSize: '1.5em' }}>Manage Teams and Students for your Competition</span>
          </div>
        </div>

        {/* Teams-Stuednts page selection */}
        <div style={{
          minHeight: '78px',
          width: '100%',
          display: 'flex',
          borderBottom: '1px solid #D9D9D9'
        }}>
          <CustomToggleSwitch contents={[
            (<div style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}>
            <span style={{
              fontSize: '2.5em',
            }}>Teams</span>
            </div>), (<div style={{
              height: '100%',
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <span style={{ fontSize: '2.5em' }}>Students</span>
            </div>)
            ]} callbacks={[
              () => {},
              () => {}
            ]} style={{
            height: '100%',
            width: '100%',
            maxWidth: '400px',
          }} />
        </div>

        {/* Display of Teams/Students */}
        <div style={{
          flex: '1',
          backgroundColor: 'white',
          display: 'flex',
          flexWrap: 'wrap',
          alignContent: 'flex-start',
          overflow: 'auto',
          marginTop: '32px',
          gap: '32px',
        }}>
          {Array(50).fill(0).map((_, index) => (<TeamCard key={index} teamDetails={{
            teamName: 'Team Name',
            status: (index % 3) === 0 ? 'unregistered' : (index % 3) === 1 ? 'registered' : 'pending',
            memberName1: 'Team Member 1',
            memberName2: 'Team Member 2',
            memberName3: 'Team Member 3'
          }} />))}
          
        </div>
      </div>
    </div>
  </FlexBackground>
  );
}