import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Chat from './pages/Chat';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import { useContext } from 'react';
import { AuthContext } from './context/AuthContext';
import ChatTest from './pages/ChatTest';
import { ChatContextProvider } from './context/ChatContext';
import EditAccount from './pages/EditAccount';

function App() {
  const { user } = useContext(AuthContext);

  return (
    <div className="app-container">
      <ChatContextProvider user={user}>
        <Routes>
          {/* <Route path="/messages/:id" element={<ChatTest />} /> */}
          <Route path={'/'} element={user ? <ChatTest /> : <Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route
            path="/EditAccount"
            element={user ? <EditAccount /> : <Login />}
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ChatContextProvider>
    </div>
  );
}

export default App;
