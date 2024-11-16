import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { sendRequest } from '../../../utility/request';
import { 
  FaTimes, FaUserMinus, FaCalendarAlt, FaUsers, FaMapMarkerAlt, 
  FaUserEdit, FaThumbsUp, FaUserPlus, FaClipboardList, 
  FaTrophy, FaHandshake, FaBell, FaAddressCard, FaIdBadge,
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { StyledAlertButton } from '../../../screens/dashboard/Dashboard.styles';

interface Notification {
  id: number;
  type:
    | 'withdrawal'
    | 'name'
    | 'site'
    | 'deadline'
    | 'teamStatus'
    | 'cheer'
    | 'invite'
    | 'welcomeAccount'
    | 'welcomeCompetition'
    | 'update'
    | 'staffAccount';
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

const StyledNotificationsContainer = styled.div`
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
`;

const StyledNotificationItem = styled.div`
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

const StyledNotificationMsg = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5%;
`;

const StyledCloseButton = styled(FaTimes)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.cancel};
  margin-left: auto;

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const StyledNotificationIcon = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;

  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

const StyledNotificationDate = styled.small`
  color: ${({ theme }) => theme.colours.notifDate};
  font-size: 0.85rem;
`;

const StyledNotificationButtonContainer = styled.div`
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
    case 'update':
      return <FaAddressCard />;
    case 'staffAccount':
      return <FaIdBadge />;
    default:
      return <FaClipboardList />;
  }
};

export const NotificationButton: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isNotificationsVisible, setIsNotificationsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      try {
        const typeResponse = await sendRequest.get<{ type: string }>('/user/type');
        setIsStaff(typeResponse.data.type !== 'student');
        setIsAdmin(typeResponse.data.type === "system_admin");
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
          id: notif.id,
          type: notif.type as Notification['type'],
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
      } else if (isAdmin && type === 'staffAccount') {
        navigate('/staffAccounts');
      }
    } else {
      if (type === 'update') {
        navigate(`/account`);
      } else {
        navigate(`/competition/participant/${competitionId}`);
      }
    }
  };

  const handleRemoveNotification = async(notificationId: number) => {
    try {
      await sendRequest.delete<{}>('/notification', { notificationId });
      setNotifications((prev) => prev.filter((notif) => notif.id !== notificationId));
    } catch (error: unknown) {
      console.log('Error fetching notifications:', error);
    }
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
    <StyledNotificationButtonContainer data-test-id="notification-button--StyledNotificationButtonContainer-0">
      <StyledAlertButton
        onClick={() => setIsNotificationsVisible(prev => !prev)}
        data-test-id="notification-button--StyledAlertButton-0">
        <FaBell size={15} />
      </StyledAlertButton>
      {isNotificationsVisible && <StyledNotificationsContainer data-test-id="notification-button--StyledNotificationsContainer-0">
        {notifications.map((notification) => (
          <StyledNotificationItem
            key={notification.id}
            onClick={() => handleNavigate(notification)}
            data-test-id="notification-button--StyledNotificationItem-0">
            <StyledNotificationIcon data-test-id="notification-button--StyledNotificationIcon-0">{getNotificationIcon(notification.type)}</StyledNotificationIcon>
            <StyledNotificationMsg data-test-id="notification-button--StyledNotificationMsg-0">
              <div>{notification.message}</div>
              {notification.type === 'withdrawal' && notification.decision && (
                <small>Decision: {notification.decision}</small>
              )}
              <StyledNotificationDate data-test-id="notification-button--StyledNotificationDate-0">{formatDate(notification.createdAt)}</StyledNotificationDate>
            </StyledNotificationMsg>
            <StyledCloseButton
              onClick={(e) => {
                e.stopPropagation();
                handleRemoveNotification(notification.id);
              }}
              data-test-id="notification-button--StyledCloseButton-0" />
          </StyledNotificationItem>
        ))}
      </StyledNotificationsContainer>}
    </StyledNotificationButtonContainer>
  );
};
