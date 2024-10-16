import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { sendRequest } from '../../utility/request';
import {
  FaTimes,
  FaUserMinus,
  FaCalendarAlt,
  FaUsers,
  FaMapMarkerAlt,
  FaUserEdit,
} from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'withdrawal' | 'name' | 'site' | 'deadline' | 'teamStatus';
  message: string;
  decision?: 'substitution' | 'replacement';
  date: Date;
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

// For each type of notification, use to correct icon
const iconMap: { [key in Notification['type']]: JSX.Element } = {
  withdrawal: <FaUserMinus />,
  name: <FaUserEdit />,
  site: <FaMapMarkerAlt />,
  deadline: <FaCalendarAlt />,
  teamStatus: <FaUsers />,
};

export const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Mock notification data
    const fetchedNotifications: Notification[] = [
      {
        id: '1',
        type: 'withdrawal',
        message: 'John Doe has withdrawn from the ICPC competition.',
        decision: 'replacement',
        date: new Date('2024-10-15T10:00:00Z'),
      },
      {
        id: '2',
        type: 'name',
        message: 'Your team name has been approved.',
        date: new Date('2024-10-14T09:30:00Z'),
      },
      {
        id: '3',
        type: 'site',
        message: 'The competition will take place at Sydney University.',
        date: new Date('2024-10-16T08:00:00Z'),
      },
      {
        id: '4',
        type: 'deadline',
        message: 'The registration deadline is on 24th October.',
        date: new Date('2024-10-13T12:00:00Z'),
      },
      {
        id: '5',
        type: 'teamStatus',
        message: 'Your team has been successfully formed!',
        date: new Date('2024-10-16T11:45:00Z'),
      },
    ];

    setNotifications(fetchedNotifications);
  }, []);

  // stub to requestion notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await sendRequest.get<{ notifications: Notification[] }>('/user/notifications');
        const notifications = response.data;

        const notifs = notifications.notifications.map((notif) => ({
          id: notif.id,
          type: notif.type,
          message: notif.message,
          date: notif.date,
        }));

        setNotifications(notifs);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

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
        <NotificationItem key={notification.id}>
          <NotificationIcon>{iconMap[notification.type]}</NotificationIcon>
          <NotificationMsg>
            <div>{notification.message}</div>
            {notification.type === 'withdrawal' && notification.decision && (
              <small>Decision: {notification.decision}</small>
            )}
            <NotificationDate>{formatDate(notification.date)}</NotificationDate>
          </NotificationMsg>
          <CloseButton onClick={() => handleRemoveNotification(notification.id)} />
        </NotificationItem>
      ))}
    </NotificationsContainer>
  );
};
