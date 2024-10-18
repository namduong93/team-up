import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { sendRequest } from '../../utility/request';
import { 
  FaTimes, FaUserMinus, FaCalendarAlt, FaUsers, FaMapMarkerAlt, 
  FaUserEdit, FaThumbsUp, FaUserPlus, FaClipboardList, 
  FaTrophy, FaHandshake 
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

interface Notification {
  id: string;
  type:
    | 'withdrawal'
    | 'name'
    | 'site'
    | 'deadline'
    | 'teamStatus'
    | 'cheer'
    | 'invite'
    | 'welcomeAccount'
    | 'welcomeCompetition';
  message: string;
  date: Date;
  compId?: string;
  competitionName?: string;
  decision?: 'substitution' | 'replacement';
  teamName?: string;
  studentName?: string;
  newTeamName?: string;
  siteLocation?: string;
}

const NotificationsContainer = styled.div`
  position: absolute;
  top: 58px;
  right: 30px;
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 40%;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;

  @media (max-width: 768px) {
    width: 80%;
    right: 10px;
  }

  @media (max-width: 480px) {
    width: 95%;
    top: 10px;
    right: 5px;
  }
`;

const NotificationItem = styled.div`
  padding: 10px 5%;
  border-bottom: 1px solid ${({ theme }) => theme.background};
  display: flex;
  gap: 5%;
  flex-wrap: wrap;
  align-items: flex-start;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: ${({ theme }) => theme.fonts.fontSizes.small};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.background};
  }
`;

const NotificationMsg = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5%;
`;

const CloseButton = styled(FaTimes)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.cancel};
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const NotificationIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const NotificationDate = styled.small`
  color: ${({ theme }) => theme.colours.notifDate};
  font-size: 0.85rem;
`;

const getNotificationIcon = (type: Notification['type']) => {
  switch (type) {
    case 'withdrawal':
      return <FaUserMinus />;
    case 'name':
      return <FaUserEdit />;
    case 'site':
      return <FaMapMarkerAlt />;
    case 'deadline':
      return <FaCalendarAlt />;
    case 'teamStatus':
      return <FaUsers />;
    case 'cheer':
      return <FaThumbsUp />;
    case 'invite':
      return <FaUserPlus />;
    case 'welcomeAccount':
      return <FaHandshake />;
    case 'welcomeCompetition':
      return <FaTrophy />;
    default:
      return <FaClipboardList />;
  }
};

export const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isStaff, setIsStaff] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const typeResponse = await sendRequest.get<{ type: string }>('/user/type');
        setIsStaff(typeResponse.data.type !== 'student');
      } catch (error: unknown) {
        sendRequest.handleErrorStatus(error, [403], () => {
          navigate('/');
          console.log('Notification Error: ', error);
        });
      }
    })();
  }, [navigate]);

  useEffect(() => {
    const fetchedNotifications: Notification[] = [
      {
        id: '1',
        type: 'withdrawal',
        message: 'John Doe from team Team A has withdrawn from competition ICPC 2024. They have opted for: substitution.',
        decision: 'substitution',
        studentName: 'John Doe',
        teamName: 'Team A',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-15T10:00:00Z'),
      },
      {
        id: '2',
        type: 'name',
        message: 'Your coach has approved your team name change to New Team Name for competition ICPC 2024.',
        newTeamName: 'New Team Name',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-14T09:30:00Z'),
      },
      {
        id: '3',
        type: 'site',
        message: 'Competition ICPC 2024 will take place at Sydney University.',
        siteLocation: 'Sydney University',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-16T08:00:00Z'),
      },
      {
        id: '4',
        type: 'deadline',
        message: 'The early registration deadline for competition ICPC 2024 is closing soon on 24th October. Register now!',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-13T12:00:00Z'),
      },
      {
        id: '5',
        type: 'teamStatus',
        message: 'Your team has been successfully formed!',
        date: new Date('2024-10-16T11:45:00Z'),
      },
      {
        id: '6',
        type: 'invite',
        message: 'Welcome to ICPC 2024! Start inviting your friends or join an existing team via the team code.',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-16T11:45:00Z'),
      },
      {
        id: '7',
        type: 'cheer',
        message: 'Good luck in ICPC 2024 Team A!',
        teamName: 'Team A',
        competitionName: 'ICPC 2024',
        date: new Date('2024-10-16T11:45:00Z'),
      },
      {
        id: '8',
        type: 'welcomeAccount',
        message: isStaff
          ? 'Welcome to TeamUP! Start managing competitions and teams.'
          : 'Welcome to TeamUP! Start joining competitions and forming your teams.',
        date: new Date(),
      },
      {
        id: '9',
        type: 'welcomeCompetition',
        message: isStaff
          ? 'Welcome to ICPC 2024! Prepare to manage your teams effectively.'
          : 'Welcome to ICPC 2024! Start preparing and building your team.',
        competitionName: 'ICPC 2024',
        date: new Date(),
      },
    ];

    setNotifications(fetchedNotifications);
  }, [isStaff]);

  const handleNavigate = (notification: Notification) => {
    const { type, decision, studentName, teamName, compId } = notification;

    if (isStaff) {
      if (type === 'withdrawal') {
        if (decision === 'substitution') {
          navigate(`/coach/page/students/${compId}/${studentName}`);
        } else {
          navigate(`/coach/page/teams/${compId}/${teamName}`);
        }
      } else if (type === 'name' || type === 'site' || type === 'teamStatus') {
        navigate(`/coach/page/teams/${teamName}`);
      } else if (type === 'deadline' || type === 'welcomeCompetition') {
        navigate(`/coach/page/teams/`);
      } else if (type === 'welcomeAccount') {
        navigate('/dashboard');
      }
    } else {
      navigate(`/competition/participant/${compId}`);
    }
  };

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleString(undefined, {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          onClick={() => handleNavigate(notification)}
        >
          <NotificationIcon>{getNotificationIcon(notification.type)}</NotificationIcon>
          <NotificationMsg>
            <div>{notification.message}</div>
            {notification.type === 'withdrawal' && notification.decision && (
              <small>Decision: {notification.decision}</small>
            )}
            <NotificationDate>{formatDate(notification.date)}</NotificationDate>
          </NotificationMsg>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveNotification(notification.id);
            }}
          />
        </NotificationItem>
      ))}
    </NotificationsContainer>
  );
};
