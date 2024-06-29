import { createContext, useCallback, useEffect, useState } from 'react';
import { baseUrl } from '../utils/services';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registerInfo, setRegisterInfo] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: '',
  });

  console.log('Login info', loginInfo);

  useEffect(() => {
    const user = localStorage.getItem('User');

    setUser(JSON.parse(user));
  }, []);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  }, []);

  const registerUser = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsRegisterLoading(true);
        if (registerInfo.password !== registerInfo.confirmPassword) {
          setIsRegisterLoading(false);
          toast.error('Mật khẩu đã nhập không trùng khớp');
        } else {
          const response = await axios.post(`${baseUrl}/signup`, {
            email: registerInfo.email,
            password: registerInfo.password,
            confirmPassword: registerInfo.confirmPassword,
          });

          toast.success('Đăng kí thành công');
          setIsRegisterLoading(false);
          setTimeout(() => {
            //   localStorage.setItem('User', JSON.stringify(response.data));
            //   setUser(response.data);
            navigate('/');
          }, 2500);
        }
      } catch (error) {
        if (error.response) {
          setIsRegisterLoading(false);
          toast.error(error.response.data);
        } else {
          toast.error('Đã xảy ra sự cố ngoài ý muốn !!!');
        }
      }
    },

    [registerInfo] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const loginUser = useCallback(
    async (e) => {
      e.preventDefault();
      try {
        setIsLoginLoading(true);
        setLoginInfo(null);
        const response = await axios.post(`${baseUrl}/signin`, {
          email: loginInfo.email,
          password: loginInfo.password,
        });

        toast.success('Đăng nhập thành công');

        setIsLoginLoading(false);
        setTimeout(() => {
          localStorage.setItem('User', JSON.stringify(response.data));
          setUser(response.data);
          navigate('/');
        }, 2500);
      } catch (error) {
        if (error.response) {
          setIsLoginLoading(false);
          toast.error(error.response.data);
        } else {
          toast.error('Đã xảy ra sự cố ngoài ý muốn !!!');
        }
      }
    },
    [loginInfo] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const logoutUser = useCallback(() => {
    localStorage.removeItem('User');
    setUser(null);
  }, []);
  return (
    <AuthContext.Provider
      value={{
        user,

        registerInfo,
        updateRegisterInfo,
        registerUser,

        isRegisterLoading,
        logoutUser,
        loginUser,

        loginInfo,
        updateLoginInfo,
        isLoginLoading,
      }}
    >
      {children}
      <ToastContainer
        position="bottom-center"
        limit={1}
        autoClose={1500}
        style={{ width: '500px' }}
      />
    </AuthContext.Provider>
  );
};
