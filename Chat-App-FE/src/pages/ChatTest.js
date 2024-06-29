import { GiHamburgerMenu } from 'react-icons/gi';
import { useState, useContext } from 'react';
import '../css/SideNavLeftCss.css';
// import ava from '../components/defaultava.png';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Container, Stack } from 'react-bootstrap';
import { ChatContext } from '../context/ChatContext';
import { Helmet } from 'react-helmet';

import UserChat from '../components/chat/UserChat';
import PotentialChats from '../components/chat/PotentialChats';
import ChatBox from '../components/chat/ChatBox';
import Notification from '../components/chat/Notification';
export default function ChatTest() {
  const [showNav, setShowNav] = useState(false);

  const { userChats, isUserChatsLoading, updateCurrentChat } =
    useContext(ChatContext);

  const { user, logoutUser } = useContext(AuthContext);

  const toggleSideNav = () => {
    setShowNav(!showNav);
  };
  const handleSidenavSpaceClick = () => {
    if (showNav) {
      toggleSideNav();
    }
  };

  return (
    <div>
      <Helmet>
        <title>Chat</title>
      </Helmet>

      <div className="container-sidenav">
        {!showNav ? (
          <>
            <div className>
              <div className="sidenav-acc">
                <GiHamburgerMenu onClick={toggleSideNav} />
              </div>
              <div className="search-user"></div>

              <div className="list-users-chat">
                <PotentialChats />
                <Container>
                  {userChats?.length < 1 ? null : (
                    <Stack
                      direction="horizontal"
                      gap={4}
                      className="align-items-start"
                    >
                      <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
                        {isUserChatsLoading && <p>Loading chats...</p>}
                        {userChats?.map((chat, index) => {
                          return (
                            <div
                              key={index}
                              onClick={() => updateCurrentChat(chat)}
                            >
                              <UserChat chat={chat} user={user} />
                            </div>
                          );
                        })}
                      </Stack>
                    </Stack>
                  )}
                </Container>
              </div>
            </div>
          </>
        ) : (
          <>
            <div
              className={showNav ? 'sidenav-space active' : 'sidenav-space'}
              onClick={handleSidenavSpaceClick}
            ></div>
            <div className={showNav ? 'sidenav active' : 'sidenav'}>
              <img src="" alt="Avatar" className="avatar" />
              <div> {user.username}</div>

              <ul>
                <li>
                  <Link
                    to="*"
                    className="sideBarLeftLink"
                    // onClick={}
                  >
                    Account
                  </Link>
                </li>
                <li>
                  <Link
                    to="/EditAccount"
                    className="sideBarLeftLink"
                    // onClick={}
                  >
                    Setting
                  </Link>
                </li>
                <li>
                  <Link
                    to="/"
                    className="sideBarLeftLink"
                    onClick={() => logoutUser()}
                  >
                    Log out
                  </Link>
                </li>
                <li>
                  <Notification className="sideBarLeftLink" />
                </li>
              </ul>
            </div>
          </>
        )}
        <div className="chatboxdesign">
          {' '}
          <ChatBox />
        </div>
      </div>
    </div>
  );
}
