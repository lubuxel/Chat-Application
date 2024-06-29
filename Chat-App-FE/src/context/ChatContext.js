import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl } from '../utils/services';
import axios from 'axios';
import { io } from 'socket.io-client';

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  const [userChats, setUserChats] = useState(null);
  const [allUsers, setAllUsers] = useState([]);

  const [isUserChatsLoading, setIsUserChatsLoading] = useState(false);
  const [userChatsErrors, setUserChatsError] = useState(null);
  const [potentialChats, setPotentialChats] = useState([]);
  const [currentChat, setCurrentChat] = useState(null);

  const [messages, setMessages] = useState(null);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendTextMessageError, setSendTextMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);

  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [notification, setNotification] = useState([]);

  console.log('pchat', potentialChats);
  useEffect(() => {
    const newSocket = io('http://localhost:2304');
    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online users status
  useEffect(() => {
    if (socket === null) return;
    socket.emit('addNewUser', user?._id);
    socket.on('getOnlineUser', (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket.off('getOnlineUser');
    };
  }, [socket]);

  //send message socket
  useEffect(() => {
    if (socket === null) return;

    const recipientId = currentChat?.members?.find((id) => id !== user?._id);

    socket.emit('sendMessage', { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message  and notifi socket
  useEffect(() => {
    if (socket === null) return;
    socket.on('getMessage', (res) => {
      if (currentChat?._id !== res.chatId) return;

      setMessages((prev) => [...prev, res]);
    });

    socket.on('getNotification', (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.senderId);

      if (isChatOpen) {
        setNotification((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });
    return () => {
      socket.off('getMessage');
      socket.off('getNotification');
    };
  }, [socket, currentChat]);

  useEffect(() => {
    const getUsers = async () => {
      const response = await axios.get(`${baseUrl}/listAccount`);
      if (response.data.error) {
        return console.log('Err fetching users', response.data);
      }

      const pChats = response.data.filter((u) => {
        let isChatCreated = false;
        if (user?._id === u._id) {
          return false;
        }

        if (userChats) {
          isChatCreated = userChats?.some((chat) => {
            return chat.members[0] === u._id || chat.members[1] === u._id;
          });
        }
        return !isChatCreated;
      });

      setPotentialChats(pChats);
      setAllUsers(response.data);
    };

    getUsers();
  }, [userChats]); //react-hooks/exhaustive-deps
  //ok
  useEffect(() => {
    const getUserChats = async () => {
      if (user?._id) {
        setIsUserChatsLoading(true);
        setUserChatsError(null);
        const response = await axios.get(`${baseUrl}/chat/${user?._id}`);

        setIsUserChatsLoading(false);
        if (response.data.error) {
          return setUserChatsError(response.data);
        }

        setUserChats(response.data);
      }
    };
    getUserChats();
  }, [user, notification]);

  useEffect(() => {
    const getMessages = async () => {
      setIsMessagesLoading(true);
      setMessagesError(null);
      const responseGetMessages = await axios.post(`${baseUrl}/getMessage`, {
        chatId: currentChat ? currentChat._id : null,
      });

      setIsMessagesLoading(false);
      if (responseGetMessages.data.error) {
        return setMessagesError(responseGetMessages.data.error);
      }

      setMessages(responseGetMessages.data);
    };
    getMessages();
  }, [currentChat]);

  const updateCurrentChat = useCallback((chat) => {
    setCurrentChat(chat);
  }, []);

  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      try {
        if (!textMessage) return console.log('you must type something');

        const reponseSendMessage = await axios.post(
          `${baseUrl}/createMessage`,
          {
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
          }
        );
        if (reponseSendMessage.data.error) {
          return setSendTextMessageError(reponseSendMessage.data);
        }
        setNewMessage(reponseSendMessage.data);
        setMessages((prev) => [...prev, reponseSendMessage.data]);
        setTextMessage('');
      } catch (error) {}
    },
    []
  );

  // chỗ cần thay dổi // biến nó thành find user
  const createChat = useCallback(async (firstId, secondId) => {
    const responseCreateChat = await axios.post(`${baseUrl}/createChat`, {
      firstId,
      secondId,
    });
    if (responseCreateChat.data.error) {
      return console.log('Error creating chat', responseCreateChat.data);
    }
    setUserChats((prev) => [...prev, responseCreateChat.data]);
  }, []);
  ///

  const markAllNotificationAsRead = useCallback((notification) => {
    const mNotification = notification.map((n) => {
      return { ...n, isRead: true };
    });

    setNotification(mNotification);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notification) => {
      //find chat to open

      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((members) => {
          return chatMembers.includes(members);
        });
        return isDesiredChat;
      });

      //mark notification as read
      const mNotification = notification.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });

      updateCurrentChat(desiredChat);
      setNotification(mNotification);
    },
    []
  );

  const markThisUserNotificationAsRead = useCallback(
    (thisUserNotification, notification) => {
      //mark notification as read

      const mNotification = notification.map((el) => {
        let notify;
        thisUserNotification.forEach((n) => {
          if (n.senderId === el.senderId) {
            notify = { ...n, isRead: true };
          } else {
            notify = el;
          }
        });
        return notify;
      });
      setNotification(mNotification);
    },
    []
  );

  //
  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatsLoading,
        userChatsErrors,
        potentialChats,
        createChat,
        currentChat,
        updateCurrentChat,
        messages,
        isMessagesLoading,
        messagesError,
        sendTextMessage,
        onlineUser,
        notification,
        allUsers,
        markAllNotificationAsRead,
        markNotificationAsRead,
        markThisUserNotificationAsRead,
        newMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
