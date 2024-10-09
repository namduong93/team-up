import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import { FaTimes, FaUserMinus, FaCheckCircle, FaCalendarAlt } from 'react-icons/fa';

interface Notification {
  id: string;
  type: 'withdrawal' | 'approval' | 'deadline';
  message: string;
  timestamp: string;
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
`;

const NotificationItem = styled.div`
  padding: 15px 20px;
  border-bottom: 1px solid ${({ theme }) => theme.background};
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  color: ${({ theme }) => theme.fonts.colour};
`;

const NotificationMsg = styled.div`
  flex: 1;
`;

const CloseButton = styled(FaTimes)`
  width: 1.5rem;
  height: 1.5rem;
  cursor: pointer;
  color: ${({ theme }) => theme.colours.cancel};

  &:hover {
    color: ${({ theme }) => theme.colours.cancelDark};
  }
`;

const NotificationIcon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.fonts.colour};
  font-size: 20px;
`;

const iconMap: { [key in Notification['type']]: JSX.Element } = {
  withdrawal: <FaUserMinus />,
  approval: <FaCheckCircle />,
  deadline: <FaCalendarAlt />,
};

export const Notifications: FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // TODO: fetching notifications
    const fetchedNotifications: Notification[] = [
      {
        id: '1',
        type: 'withdrawal',
        message: 'John Doe has withdrawn from the ICPC competition.',
        timestamp: new Date().toISOString(),
      },
      {
        id: '2',
        type: 'approval',
        message: 'Your team name has been approved for ICPC!',
        timestamp: new Date().toISOString(),
      },
      {
        id: '3',
        type: 'deadline',
        message: 'The deadline for the upcoming ICPC competition is on 24th October.',
        timestamp: new Date().toISOString(),
      },
    ];

    setNotifications(fetchedNotifications);
  }, []);

  const handleRemoveNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id));
  };

  return (
    <NotificationsContainer>
      {notifications.map((notification) => (
        <NotificationItem key={notification.id}>
          <NotificationIcon>
            {iconMap[notification.type]}
          </NotificationIcon>
          <NotificationMsg>{notification.message}</NotificationMsg>
          <CloseButton onClick={() => handleRemoveNotification(notification.id)} />
        </NotificationItem>
      ))}
    </NotificationsContainer>
  );
};
