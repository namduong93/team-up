const TeamMemberContainerDiv = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-rows: 100%;
  grid-template-columns: 20% 70% 10%;
  user-select: none;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.05);
  border-radius: 10px;
`

const StyledUserIcon = styled(FaRegUser)`
  width: 50%;
  min-width: 18px;
  margin: auto 0 auto 25%;
  pointer-events: none;
  user-select: none;
`

const CenterTextDiv = styled.div<{ $levelChar?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: ${({ theme, $levelChar }) => $levelChar &&
  ($levelChar === 'A' ? theme.teamView.levelA : theme.teamView.levelB)};

  font-weight: ${({ $levelChar }) => $levelChar && 'bold' };
`

const TeamLevelDiv = styled.div<{ $levelChar?: string }>`
  display: flex;
  flex-direction: column;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.7);
  align-items: center;
  color: ${({ theme, $levelChar: levelChar }) => levelChar === "A" ? theme.teamView.levelA : theme.teamView.levelB};
  font-weight: ${({ theme }) => theme.fonts.fontWeights.bold};
  width: 25px;
  height: 25px;
  border-radius: 50%;
  /* position: absolute; */
  margin-left: auto;
  margin-right: 5px;
  margin-bottom: auto;
  margin-top: 5px;
  top: 5px;
  right: 5px;
`;

const StyledHoverDiv = styled.div<{$isEditingStatus: boolean, $isEditingNameStatus: boolean, $isDragging: boolean, $numMembers: number}>`
  transition: transform 0.2s ease-in-out !important;
  display: flex;
  flex: 0 1 auto;
  flex-wrap: wrap;
  flex-direction: column;
  width: 100%;
  height: ${({ $isEditingStatus, $numMembers }) => {
    if ($numMembers > 3) {
      return $isEditingStatus ? '330px' : '310px';
    } else {
      return $isEditingStatus ? '280px' : '260px';
    }
  }};
  max-width: 294px;
  min-width: 140px;
  border-radius: 20px 20px 20px 20px;
  box-shadow: 0 4px 4px 0 rgba(0, 0, 0, 0.25);
  user-select: none;
  &:hover {
    ${({ $isEditingStatus, $isEditingNameStatus, $isDragging }) =>
      (!$isEditingStatus && !$isEditingNameStatus && !$isDragging) && `transform: translate(3px, 3px);`}
    cursor: pointer;
  }

  @media (max-width: 410px ) {
    &:hover {
      ${({ $isEditingStatus, $isEditingNameStatus, $isDragging }) =>
        (!$isEditingStatus && !$isEditingNameStatus && !$isDragging) && `transform: translate(0, 3px);`}
      cursor: pointer;
    }
  }
`;

const CardHeaderDiv = styled.div<{ $statusColor: string }>`
  background-color: ${(props) => props.$statusColor};
  height: 58px;
  width: 100%;
  border-radius: 20px 20px 0px 0px;
  display: flex;
  align-items: center;
  gap: 2.5%;
  /* position: relative; */
`;

const TitleSpan = styled.span`
  font-size: 1.5rem;
  margin-left: 5%;
`

const TeamMatesContainerDiv = styled.div`
  background-color: ${({ theme }) => theme.colours.cardBackground};
  flex: 1 1 auto;
  border-radius: 0px 0px 20px 20px;
  border: 1px solid rgba(0, 0, 0, 0.25);
  border-top: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
`


const RedTeamNameAlert = styled(CiCircleAlert)`
  color: red;
  min-height: 32px;
  min-width: 32px;
  margin-right: 5%;
`;

const ApproveDiv = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  column-gap: 4px;
  color: ${({ theme }) => theme.colours.confirm};
`;

const RadioCircleDiv = styled.div<{ $selected: boolean }>`
  transition: background-color 0.2s ease-in-out !important;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 1px solid ${({ theme }) => theme.colours.confirm};
  box-sizing: border-box;
  background-color: ${({ theme, $selected }) => (
      $selected ? theme.colours.confirm : theme.background
    )};
`;

const ApprovalNameDiv = styled.div`
  width: 100%;
  height: 33px;
  display: flex;
  justify-content: center;
`;

const RadioCheckIcon = styled(IoMdCheckmark)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.colours.confirm};
`;

const RadioCrossIcon = styled(LiaTimesSolid)`
  width: 23px;
  height: 23px;
  color: ${({ theme }) => theme.colours.cancel};
`;

const RadioIconDiv = styled.div`
  width: 33px;
  height: 33px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  box-sizing: border-box;
`;

const TeamNameApprovalDiv = styled.div`
  width: 100%;
  height: 100%;
  /* background-color: green; */
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const TeamMemberMotionDiv = styled(motion.div)<{ $isDraggable: boolean }>`
  border-radius: 10px;
  border: 1px solid rgb(200, 200, 200);
  width: 85.37%;
  min-height: 40px;
  background-color: ${({ theme }) => theme.background};
  /* height: 20.79%; */

  &:hover {
    ${({ $isDraggable }) => $isDraggable && `cursor: grabbing`};
  }
`;
