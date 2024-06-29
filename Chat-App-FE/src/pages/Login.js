import { useContext } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Helmet } from 'react-helmet';
import { AuthContext } from '../context/AuthContext';

export default function Login() {
  const { loginUser, loginInfo, updateLoginInfo, isLoginLoading } =
    useContext(AuthContext);
  return (
    <div>
      <Helmet>
        <title>Login</title>
      </Helmet>
      <div className="container-signin">
        <div className="signin">
          <div className="title">Sign In</div>
          <Form onSubmit={loginUser}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                //value={email}
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, email: e.target.value })
                }
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                // value={password}
                onChange={(e) =>
                  updateLoginInfo({ ...loginInfo, password: e.target.value })
                }
                required
              />
              <div>
                <a href="/resetpassword">Forget Password?</a>
              </div>
            </Form.Group>
            <Button variant="primary" type="submit">
              {isLoginLoading ? 'Getting you in...' : ' Sign In'}
            </Button>
          </Form>

          <div className="text">
            {' '}
            Create New Account? <a href="/register"> Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
