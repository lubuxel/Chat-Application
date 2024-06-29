import { useContext, useState } from 'react';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/AuthContext';

const PotentialChats = () => {
  const { user } = useContext(AuthContext);
  const { potentialChats, createChat, onlineUser } = useContext(ChatContext);
  const [clickedIds, setClickedIds] = useState([]);
  console.log('click', clickedIds);
  return (
    <>
      <div className="all-users">
        {potentialChats &&
          potentialChats.map((u, index) => {
            console.log('uid', u._id);
            const handeleCreateChat = () => {
              if (clickedIds.includes(u._id)) {
                return false;
              }

              setClickedIds([...clickedIds, u._id]);

              createChat(user._id, u._id);
            };

            return (
              <div
                className="single-user"
                key={index}
                onClick={handeleCreateChat}
              >
                {u.username}
                <span
                  className={
                    onlineUser?.some((user) => user?.userId === u?._id)
                      ? 'user-online'
                      : ''
                  }
                ></span>
              </div>
            );
          })}
      </div>{' '}
    </>
  );
};

export default PotentialChats;
