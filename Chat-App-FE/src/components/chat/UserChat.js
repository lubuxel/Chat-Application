import { Stack } from 'react-bootstrap';
import { useFetchRecipientUser } from '../../hooks/useFetchRecipient';
import '../../css/UserChat.css';
import { useContext } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { unreadNotificationsFunc } from '../../utils/unreadNotifications';

import moment from 'moment';
import { useFetchLatestMessage } from '../../hooks/useFetchLatestMessage';
const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipientUser(chat, user);
  const { onlineUser, notification, markThisUserNotificationAsRead } =
    useContext(ChatContext);

  const { latestMessage } = useFetchLatestMessage(chat);

  const unreadNotification = unreadNotificationsFunc(notification);
  const thisUserNotification = unreadNotification?.filter(
    (n) => n.senderId == recipientUser?._id
  );
  const isOnline = onlineUser?.some(
    (user) => user?.userId === recipientUser?._id
  );
  const truncateText = (text) => {
    let shortText = text.substring(0, 20);

    if (text.length > 20) {
      shortText = shortText + '...';
    }
    return shortText;
  };

  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if (thisUserNotification?.length !== 0) {
          markThisUserNotificationAsRead(thisUserNotification, notification);
        }
      }}
    >
      <div className="d-flex">
        <div className="me-2">
          {/* <img src={recipientUser?.avatar} height="35px" /> */}
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.username}</div>
          <div className="text">
            {latestMessage?.text && (
              <span>{truncateText(latestMessage?.text)}</span>
            )}
          </div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">
          {moment(latestMessage?.createdAt).calendar()}
        </div>
        <div
          className={
            thisUserNotification?.length > 0 ? 'this-user-notifications' : ''
          }
        >
          {thisUserNotification?.length > 0 ? thisUserNotification?.length : ''}
        </div>
        <span className={isOnline ? 'user-online' : ''}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
