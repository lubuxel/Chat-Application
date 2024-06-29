import { useContext } from 'react';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { Helmet } from 'react-helmet';
import { AuthContext } from '../context/AuthContext';
export default function Register() {
  const { registerInfo, updateRegisterInfo, registerUser, isRegisterLoading } =
    useContext(AuthContext);

  return (
    <div>
      <Helmet>
        <title>Register</title>
      </Helmet>
      <div className="container-register">
        <div className="register">
          <div className="title">Register</div>
          <Form onSubmit={registerUser}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                onChange={(e) =>
                  updateRegisterInfo({ ...registerInfo, email: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    password: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={(e) =>
                  updateRegisterInfo({
                    ...registerInfo,
                    confirmPassword: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {isRegisterLoading ? 'Creating your account' : 'Register'}
            </Button>
          </Form>

          <div className="text">
            {' '}
            <a href="/"> Already have an account</a>
          </div>
        </div>
      </div>
    </div>
  );
}
