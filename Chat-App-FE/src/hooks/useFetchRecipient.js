import { useEffect, useState } from 'react';
import { baseUrl } from '../utils/services';
import axios from 'axios';

export const useFetchRecipientUser = (chat, user) => {
  const [recipientUser, setRecipientUser] = useState(null);
  const [error, setError] = useState(null);

  const recipientId = chat?.members?.find((id) => id !== user?._id);

  useEffect(() => {
    const getUser = async () => {
      try {
        if (!recipientId) {
          return null;
        }
        const response = await axios.get(`${baseUrl}/${recipientId}`);

        if (response.data.error) {
          setError(response.data.error);
        } else {
          setRecipientUser(response.data);
        }
      } catch (err) {
        console.log('Hệ thống đã xảy ra lỗi!!!');
      }
    };

    getUser();
  }, [recipientId]);

  return { recipientUser };
};
