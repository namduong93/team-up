const StandardContainerDiv = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
  box-sizing: border-box;
`;

const ActionsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  gap: 10px;
  justify-content: flex-start;
`;

const ActionCard = styled.button<ActionCardProps>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1 1 auto;
  max-width: 280px;
  height: 100%;
  width: 100%;
  aspect-ratio: 1;
  box-sizing: border-box;
  background-color: ${({ theme, $actionType }) =>
    theme.staffActions[$actionType]};
  border: ${({ theme, $actionType }) =>
    `1px solid ${theme.staffActions[`${$actionType}Border`]}`};
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s;

  &:hover {
    transform: translate(2px, 2px);
  }
`;

const CardIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const CardText = styled.p`
  font-size: 1.5rem;
  color: ${({ theme }) => theme.fonts.colour};
  margin: 0;
`;

const BackButton = styled.button`
  color: ${({ theme }) => theme.colours.primaryDark};
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
  font-size: 1rem;
  display: flex;
  align-self: flex-start;
  gap: 5px;
  margin: 10px;

  &:hover {
    color: ${({ theme }) => theme.colours.secondaryDark};
  }
`;

const AssignSeatsPage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow: hidden;
`;

const ManageContainer = styled.div`
  width: 100%;
  height: 70%;
`;

const Code = styled.div`
  font-size: 1rem;
  font-style: ${({ theme }) => theme.fonts.style};
  color: ${({ theme }) => theme.fonts.descriptor};
  background: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 12px;
  width: 80%;
  max-width: 400px;
  height: 15%;
  max-height: 25px;
  text-align: center;
  word-wrap: break-word;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
`;
const CopyCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  flex: 1 1 auto;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  padding: 5px;
`;
export const Heading = styled.h2`
  font-size: ${({ theme }) => theme.fonts.fontSizes.large};
  margin-top: 40px;
  color: ${({ theme }) => theme.colours.notifDark};
  white-space: pre-wrap;
  word-break: break-word;
`;

const CodeCardText = styled(CardText)`
  font-size: 1.25rem;
`;

// const Title2 = styled.h2`
//   margin-top: 40px;
//   margin-bottom: 20px;
//   font-size: 22px;
//   white-space: pre-wrap;
//   word-break: break-word;
// `;

const Title2 = styled.h2`
  margin-top: 40px;
  margin-bottom: 20px;
  font-size: 22px;
  white-space: pre-wrap;
  word-break: break-word;
`;