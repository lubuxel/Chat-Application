import React, { useState, useEffect } from "react";
import "./Chat.css";
import axios from "axios";
import {
  Container,
  Row,
  Col,
  ListGroup,
  Card,
  Form,
  Button,
  Nav,
  Navbar,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import _ from "lodash";
import { io } from "socket.io-client";

function App() {
  const [showTaskbar, setShowTaskbar] = useState(false);
  const [users, setUsers] = useState({});
  const { id } = useParams();
  const [foundUser, setFoundUser] = useState(null);
  const [find, setFind] = useState("");
  const [userList, setUserList] = useState([]);
  const [isChatVisible, setIsChatVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatContent, setChatContent] = useState([]);
  const [messageContent, setMessageContent] = useState("");
  const [chatId, setChatId] = useState("");
  const [socket, setSocket] = useState(null);
  const [onlineUser, setOnlineUser] = useState([]);

  useEffect(() => {
    const newSocket = io("http://localhost:2304");
    setSocket(newSocket);
  }, [users]);

  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUser(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  const fetchUsers = async () => {
    try {
      const listAccountResponse = await axios.get("/api/listAccount");
      const userResponse = await axios.get(`/api/${id}`);
      setUsers(userResponse.data);
      const { data } = listAccountResponse;
      const listUser = data.filter((user) => {
        return user._id !== id;
      });
      setUserList(listUser);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleFindUser = async () => {
    try {
      const response = await axios.post("/api/find", { username: find });
      setFoundUser(response.data);
    } catch (error) {
      console.log("Không thể tìm thấy người dùng:", error);
    }
  };

  const handleClick = () => {
    setShowTaskbar(!showTaskbar);
  };

  const handleCreateChatClick = async () => {
    try {
      const response = await axios.post("/api/createChat", {
        firstId: users._id,
        secondId: foundUser._id,
      });
      if (response && response.data._id) {
        setChatId(response.data._id);
        setIsChatVisible(true);
        handleGetMessage(response.data._id);
      } else {
        console.log("Invalid chat content:", response.data);
      }
    } catch (err) {
      console.log("===============err", err);
      setIsChatVisible(true);
    }
  };

  const handleGetMessage = async (chatId) => {
    if (chatId) {
      const data = await axios.post("/api/getMessage", {
        chatId,
      });
      if (_.isEmpty(data)) {
        setChatContent([]);
      } else {
        setChatContent(data.data);
      }
    }
  };

  const handleSelectedUser = (user) => {
    setSelectedUser(user);
    setFoundUser(user);
    setIsChatVisible(false);
  };

  const handleSendMessage = async () => {
    if (socket === null) return;
    const chatMember = foundUser._id;
    const message = {
      chatId: chatId,
      senderId: selectedUser._id,
      text: messageContent,
    };
    try {
      const data = await axios.post("/api/createMessage", message);
      if (data) {
        chatContent.push(data.data);
        handleGetMessage(message.chatId);
        setMessageContent("");
        socket.emit("sendMessage", { chatContent, chatMember });
      } else console.log("====================err at send message");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    handleGetMessage();
  }, [users]);

  // receive message
  useEffect(() => {
    if (socket === null) return;
    socket.on("getMessage", (res) => {
      setChatContent(res);
    });
  }, [socket]);

  return (
    <div className="app">
      <Container>
        <Row>
          <Col md={4}>
            {/* Left section */}
            <Card>
              <Card.Body className="d-flex flex-column">
                <div className="user-info">
                  <div key={users.id}>
                    <img
                      src={users.avatar}
                      alt=""
                      className="avatar"
                      onClick={handleClick}
                    />
                    <h5>{users.username}</h5>
                  </div>
                  <div className={`taskbar${showTaskbar ? " active" : ""}`}>
                    <Navbar bg="light" expand="lg">
                      <Navbar.Toggle aria-controls="basic-navbar-nav" />
                      <Navbar.Collapse id="basic-navbar-nav">
                        <Nav
                          className="mr-auto"
                          style={{ flexDirection: "column" }}
                        >
                          <Nav.Link href="#account">Account</Nav.Link>
                          <Nav.Link href="#setting">Setting</Nav.Link>
                          <Nav.Link href="/">LogOut</Nav.Link>
                        </Nav>
                      </Navbar.Collapse>
                    </Navbar>
                    <div className="close-btn" onClick={handleClick}>
                      X
                    </div>
                  </div>
                </div>
                <div className="found-user">
                  {foundUser && (
                    <div className="found-user-info">
                      <div className="d-flex align-items-center justify-content-between">
                        <div>
                          <img
                            src={foundUser.avatar}
                            alt=""
                            className="avatar"
                          />
                          <h3>{foundUser.username}</h3>
                          <p>Email: {foundUser.email}</p>
                        </div>
                        <Button onClick={handleCreateChatClick}>Chat</Button>
                      </div>
                    </div>
                  )}
                </div>
                <div className="search-list-container">
                  <div className="d-flex justify-content-between align-items-center">
                    <Form.Control
                      type="text"
                      placeholder="Search"
                      value={find}
                      onChange={(e) => setFind(e.target.value)}
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={handleFindUser}
                    >
                      Find
                    </Button>
                  </div>
                  <div className="list-group-container">
                    <ListGroup className="list-group-scroll">
                      {userList.map((user) => (
                        <ListGroup.Item
                          key={user.id}
                          onClick={() => handleSelectedUser(user)}
                          className={selectedUser === user ? "selected" : ""}
                        >
                          {user.username}
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={8}>
            {/* Right section */}
            {isChatVisible && selectedUser && (
              <Card>
                <Card.Header className="bg-primary text-white">
                  <div className="d-flex align-items-center">
                    <img src={selectedUser.avatar} alt="" className="avatar" />
                    <h4 className="ml-2">{selectedUser.username}</h4>
                  </div>
                </Card.Header>
                <Card.Body className="chat-box">
                  {chatContent &&
                    chatContent.map((message, index) => (
                      <div
                        key={index}
                        className={`message ${
                          message.senderId === users._id ? "left" : "right"
                        }`}
                      >
                        <span className="sender" style={{ float: "right" }}>
                          {message.chat}
                        </span>
                        <span className="content">{message.text}</span>
                      </div>
                    ))}
                </Card.Body>
                <Card.Footer className="d-flex align-items-center">
                  <Form.Control
                    type="text"
                    placeholder="Type your message"
                    value={messageContent}
                    onChange={(e) => setMessageContent(e.target.value)}
                    className="flex-grow-1 mr-2"
                  />
                  <Button variant="primary" onClick={handleSendMessage}>
                    Send
                  </Button>
                </Card.Footer>
              </Card>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
}

export default App;
