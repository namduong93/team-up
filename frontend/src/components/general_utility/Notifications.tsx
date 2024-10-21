import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { sendRequest } from '../../utility/request';
import { 
  FaTimes, FaUserMinus, FaCalendarAlt, FaUsers, FaMapMarkerAlt, 
  FaUserEdit, FaThumbsUp, FaUserPlus, FaClipboardList, 
  FaTrophy, FaHandshake, 
  FaBell
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { AlertButton } from '../../screens/Dashboard/Dashboard';

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
  createdAt: Date;
  competitionId?: string;
  competitionName?: string;
  decision?: 'substitution' | 'replacement';
  teamName?: string;
  studentName?: string;
  newTeamName?: string;
  siteLocation?: string;
}

const NotificationsContainer = styled.div`
  position: absolute;
  top: calc(100% + 10px);
  right: 0;
  background-color: ${({ theme }) => theme.colours.sidebarBackground};
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  width: 70vw;
  z-index: 1005;
  max-width: 450px;
  min-width: 250px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 1000;

  /* @media (max-width: 768px) {
    width: 80%;
    right: 10px;
  }

  @media (max-width: 480px) {
    width: 95%;
    top: 10px;
    right: 5px;
  } */
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

const NotificationButtonContainer = styled.div`
  position: relative;
  height: 33px;
  width: 33px;
  min-width: 33px;
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

function cleanNotificationType(type: string): string {
  return type.replace(/[{}]/g, ''); // Removes { or }
}

export const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isStaff, setIsStaff] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
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
    (async () => {
      try {
        // Fetch notifications from the backend
        const notifResponse = await sendRequest.get<Notification[]>('/user/notifications');

        // Transform the backend response to match the frontend Notification structure
        const transformedNotifications = notifResponse.data.map((notif) => ({
          id: notif.id?.toString() || '',  // Convert id to string
          type: cleanNotificationType(notif.type) as Notification['type'],  // Convert type to string
          message: notif.message,
          createdAt: new Date(notif.createdAt),  // Use createdAt as date
          competitionId: notif.competitionId,  // Convert competitionId to compId and string
          competitionName: notif.competitionName,
          decision: notif.decision,
          teamName: notif.teamName,
          studentName: notif.studentName,
          newTeamName: notif.newTeamName,
          siteLocation: notif.siteLocation,
        }));
  
        setNotifications(transformedNotifications); // Set transformed data
      } catch (error: unknown) {
        console.log('Error fetching notifications:', error);
      }
    })();
  }, [isStaff]);

  const handleNavigate = (notification: Notification) => {
    const { type, decision, studentName, teamName, competitionId } = notification;

    if (isStaff) {
      if (type === 'withdrawal') {
        if (decision === 'substitution') {
          navigate(`/coach/page/students/${competitionId}/${studentName}`);
        } else {
          navigate(`/coach/page/teams/${competitionId}/${teamName}`);
        }
      } else if (type === 'name' || type === 'site' || type === 'teamStatus') {
        navigate(`/coach/page/teams/${teamName}`);
      } else if (type === 'deadline' || type === 'welcomeCompetition') {
        navigate(`/coach/page/teams/`);
      } else if (type === 'welcomeAccount') {
        navigate('/dashboard');
      }
    } else {
      navigate(`/competition/participant/${competitionId}`);
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
  <NotificationButtonContainer>
    <AlertButton onClick={() => setIsNotificationsVisible(prev => !prev)}>
        <FaBell size={15} />
    </AlertButton>
    {isNotificationsVisible && <NotificationsContainer>
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
            <NotificationDate>{formatDate(notification.createdAt)}</NotificationDate>
          </NotificationMsg>
          <CloseButton
            onClick={(e) => {
              e.stopPropagation();
              handleRemoveNotification(notification.id);
            }}
          />
        </NotificationItem>
      ))}
    </NotificationsContainer>}
  </NotificationButtonContainer>
  );
};
