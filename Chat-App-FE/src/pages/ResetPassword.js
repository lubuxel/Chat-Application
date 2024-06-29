import { toast } from 'react-toastify';
import { Helmet } from 'react-helmet';
import { React, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { baseUrl } from '../utils/services';

export default function ResetPassword() {
  const [showReset, setShowReset] = useState(true);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [reTypePassword, setReTypePassword] = useState('');
  const navigate = useNavigate();

  const handleSendEmail = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Vui lòng nhập email !!!');
    } else {
      try {
        const send = await axios.post(`${baseUrl}/sendEmail`, { email });
        console.log(send);
        if (send) {
          toast.success('Vui lòng kiểm tra email !!!');
          setTimeout(() => {
            setShowReset(!showReset);
          }, 2500);
        }
      } catch (err) {
        toast.error('Email không tồn tại !!!');
      }
    }
  };
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      const reset = await axios.post(`${baseUrl}/resetPassword`, {
        email,
        code,
        newPassword,
        reTypePassword,
      });
      console.log(reset);
      if (reset) {
        toast.success('Thay đổi mật khẩu thành công');
        setTimeout(() => {
          navigate('/');
        }, 2500);
      }
    } catch (error) {
      toast.error('Bạn đã nhập sai gì đó !!! ');
    }
  };

  return (
    <div>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>
      <div className="container-resetpassword">
        <div className="resetpassword">
          <div className="title">Reset Password</div>
          {showReset ? (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Button variant="primary" type="submit" onClick={handleSendEmail}>
                Send Email
              </Button>
            </Form>
          ) : (
            <Form>
              <Form.Group className="mb-3" controlId="formBasicCode">
                <Form.Label>Code</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Code..."
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  placeholder="Confirm Password"
                  value={reTypePassword}
                  onChange={(e) => setReTypePassword(e.target.value)}
                />
              </Form.Group>

              <Button
                variant="primary"
                type="submit"
                onClick={handleResetPassword}
              >
                Update
              </Button>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}
