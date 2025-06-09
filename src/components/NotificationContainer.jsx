import { useEffect } from 'react';
import { notification } from 'antd';
import { useNotifications, useAppDispatch } from '../hooks/useRedux';
import { removeNotification } from '../store/slices/uiSlice';

const NotificationContainer = () => {
  const notifications = useNotifications();
  const dispatch = useAppDispatch();

  return null

  useEffect(() => {
    notifications.forEach(notif => {
      if (!notif.displayed) {
        notification[notif.type]({
          message: notif.title || 'Notification',
          description: notif.message,
          duration: notif.autoClose ? notif.duration / 1000 : 0,
          onClose: () => {
            dispatch(removeNotification(notif.id));
          },
          style: {
            backgroundColor: 'rgba(46, 213, 115, 0.1)',
            border: '1px solid #2ed573',
            borderRadius: '8px'
          }
        });
        
        // Mark as displayed
        notif.displayed = true;
      }
    });
  }, [notifications, dispatch]);

  return null; // This component doesn't render anything visible
};

export default NotificationContainer;