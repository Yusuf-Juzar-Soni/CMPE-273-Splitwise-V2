import { React, useState } from "react";
import axios from "axios";
import alert from "alert";
import Navbar from "react-bootstrap/Navbar";
import backendServer from "../webConfig";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Nav } from "react-bootstrap";
import logged from "../actions";
import bg_image0 from "./assets/login_logo.png";
import {
  Button,
  Grid,
  Row,
  Col,
  ListGroup,
  Form,
  Card,
  Modal,
} from "react-bootstrap";

function Login() {
  const [email, emailChangeHandler] = useState("");
  const [password, passwordChangeHandler] = useState("");
  const [validated, setValidated] = useState(false);

  const history = useHistory();

  const isLogged = useSelector((state) => state.isLogged);
  const dispatch = useDispatch();

  const loadSuccessful = () => {
    history.push("/dash");
  };

  const handleClick = (emailId) => {
    history.push({
      pathname: "/dash",
      search: `?email=${emailId}`,
    });
  };

  const onLogin = (e) => {
    e.preventDefault();
    console.log("inside function");
    setValidated(true);
    if (email.includes("@") && email.includes(".com")) {
      axios
        .post(`${backendServer}/login`, {
          email,
          password,
        })
        .then((response) => {
          localStorage.setItem("username", response.data.result[0].username);
          localStorage.setItem("useremail", response.data.result[0].user_email);
          console.log(response.data.result[0]);
          console.log(response.data.result[0].username);
          console.log(response.data.result[0].user_email);
          loadSuccessful();
          handleClick(response.data.result[0].user_email);
          dispatch(
            logged(
              response.data.result[0].username,
              response.data.result[0].user_email
            )
          );
        })
        .catch((err) => {
          if (err.response) {
            alert(err.response.data.message);
          }
        });
    }
    else{
      alert("Email format wrong")
    }
  };

  return (
    <div>
      <Navbar bg="success" expand="lg">
        <Navbar.Brand>
          <img src={bg_image0} width="50" height="50"></img>
        </Navbar.Brand>
        <Nav className="mr-auto">
          <Nav.Link href="#home" />
        </Nav>
        <Button variant="success" href="./login">
          Login
        </Button>
        <Button variant="success" href="./signup">
          Signup
        </Button>
      </Navbar>
      <Form noValidate validated={validated}>
        <Form.Row>
          <Form.Group
            as={Col}
            md={{ span: 5, offset: 3 }}
            controlId="validationCustom01"
          >
            <Form.Label className="text-center">
              <b>Enter Email</b>
            </Form.Label>
            <Form.Control
              className="text-center"
              style={{ width: "100%" }}
              required
              type="email"
              placeholder="Email"
              onChange={(e) => {
                emailChangeHandler(e.target.value);
              }}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group
            as={Col}
            md={{ span: 5, offset: 3 }}
            controlId="validationCustom02"
          >
            <Form.Label className="text-center">
              <b>Enter Password</b>
            </Form.Label>
            <Form.Control
              className="text-center"
              style={{ width: "100%" }}
              required
              type="password"
              placeholder="Password"
              onChange={(e) => {
                passwordChangeHandler(e.target.value);
              }}
            />
            <Form.Control.Feedback>Looks good!</Form.Control.Feedback>
          </Form.Group>
        </Form.Row>
        <Form.Row>
          <Form.Group
            as={Col}
            md={{ span: 5, offset: 3 }}
            controlId="validationCustom03"
          >
            <Button
              data-testid="Login"
              className="button-settleup"
              type="submit"
              onClick={onLogin}
            >
              LOGIN
            </Button>
          </Form.Group>
        </Form.Row>
      </Form>
    </div>
  );
}

export default Login;
