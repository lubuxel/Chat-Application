import { useContext, useState } from 'react';
import { toast } from 'react-toastify';

import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { baseUrl } from '../utils/services';
import { useNavigate } from 'react-router-dom';

export default function EditAccount() {
  const { user, logoutUser } = useContext(AuthContext);
  const [userName, setUserName] = useState('');
  // const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const navigate = useNavigate();

  const handleChangeName = async (e) => {
    e.preventDefault();
    try {
      if (!user._id) {
        toast.error('Vui long dang nhap');
        setTimeout(() => {
          navigate('/');
        }, 2500);
      } else {
        const responseChangeName = await axios.post(
          `${baseUrl}/${user._id}/editName`,
          {
            name: userName,
          }
        );
        if (responseChangeName) {
          toast.success('Doi ten thanh cong');
          setTimeout(() => {
            logoutUser();
            navigate('/');
          }, 2500);
        }
      }
    } catch (error) {
      toast.error(error.responseChangeName.data);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    try {
      if (!user._id) {
        toast.error('Vui long dang nhap');
        setTimeout(() => {
          navigate('/');
        }, 2500);
      } else {
        if (newPassword != reTypePassword) {
          toast.info('Mat khau khong khop voi nhau');
        } else {
          const responseChangePassword = await axios.post(
            `${baseUrl}/resetPassword`,
            {
              email: user.email,
              code: user.code,
              newPassword,
              reTypePassword,
            }
          );
          if (responseChangePassword) {
            toast.success('Doi mat khau thanh cong');
            setTimeout(() => {
              navigate('/');
            }, 2500);
          }
        }
      }
    } catch (error) {
      // toast.error(error.responseChangePassword);
    }
  };

  return (
    <div>
      <Helmet>
        <title>Edit Account</title>
      </Helmet>

      <div className="container-signin">
        <div className="signin">
          <div className="title">Change User Name</div>
          <Form onSubmit={handleChangeName}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Change User Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter A New Username"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Change Name
            </Button>
          </Form>
          <div className="title">Change Password</div>

          <Form onSubmit={handleChangePassword}>
            {/* <Form.Group className="mb-3" controlId="formBasicOldPassword">
              <Form.Label>Old Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter Old Password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                required
              />
            </Form.Group> */}
            <Form.Group className="mb-3" controlId="formBasicNewPassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicRePassword">
              <Form.Label>Re-Enter Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Re-Enter Password"
                value={reTypePassword}
                onChange={(e) => setReTypePassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Change Password
            </Button>
          </Form>
          <a href="/">Back</a>
        </div>
      </div>
    </div>
  );
}
