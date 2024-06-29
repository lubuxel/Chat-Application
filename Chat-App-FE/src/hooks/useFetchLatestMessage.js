import { useContext, useEffect, useState } from 'react';
import { ChatContext } from '../context/ChatContext';
import { baseUrl } from '../utils/services';
import axios from 'axios';

export const useFetchLatestMessage = (chat) => {
  const { newMessage, notification } = useContext(ChatContext);
  const [latestMessage, setLatestMessage] = useState(null);
  useEffect(() => {
    const getMessages = async () => {
      const responseGetMessages = await axios.post(`${baseUrl}/getMessage`, {
        chatId: chat?._id,
      });

      //   const responseGetMessages = await axios.post(`${baseUrl}/getMessage`, {
      //     chatId: currentChat ? currentChat._id : null,
      //   });
      if (responseGetMessages.data.error) {
        return console.log(
          'Error getting messages',
          responseGetMessages.data.error
        );
      }
      const lastMessage =
        responseGetMessages.data[responseGetMessages.data?.length - 1];
      console.log('lastMess', lastMessage);

      setLatestMessage(lastMessage);
    };
    getMessages();
  }, [newMessage, notification]);
  return { latestMessage };
};
