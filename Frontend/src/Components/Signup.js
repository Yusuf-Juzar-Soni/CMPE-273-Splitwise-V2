import { React, useState } from "react";
import axios from "axios";
import alert from "alert";
import Nav from "react-bootstrap/esm/Nav";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./Signup";
import logged from "../actions";
import Navbar from "react-bootstrap/Navbar";
import bg_image0 from "./assets/login_logo.png";
import backendServer from "../webConfig";
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

function Signup() {
  const [name, nameChangeHandler] = useState("");
  const [email, emailChangeHandler] = useState("");
  const [password, passwordChangeHandler] = useState("");
  const history = useHistory();
  const [alt, setAlert] = useState("");
  const [validated, setValidated] = useState(false);

  const isLogged = useSelector((state) => state.isLoggedIn);
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

  const onSignup = (e) => {
    e.preventDefault();
    setValidated(true);
    if (email === "" || password === "") {
      setAlert("Please fill information completely");
    } else {
      if (email.includes("@") && email.includes(".com")) {
        axios
          .post(`${backendServer}/signup`, {
            name,
            email,
            password,
          })
          .then((response) => {
            localStorage.setItem("username", response.data.name);
            localStorage.setItem("useremail", response.data.email);
            console.log(response);
            console.log(isLogged);
            console.log(response.data.email);
            loadSuccessful();
            handleClick(response.data.email);
            dispatch(logged(response.data.name, response.data.email));
          })
          .catch((err) => {
            if (err.response) {
              console.log(err.response);
              setAlert(err.response.data.message);
            }
          });
      } else {
        alert("Email format wrong");
      }
    }
  };
  return (
    <div>
      <Navbar className="navigator" bg="success" expand="lg">
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
              <b>Enter Username</b>
            </Form.Label>
            <Form.Control
              className="text-center"
              style={{ width: "100%" }}
              required
              type="text"
              placeholder="AddName"
              onChange={(e) => {
                nameChangeHandler(e.target.value);
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
            controlId="validationCustom03"
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
              className="button-settleup"
              type="submit"
              onClick={onSignup}
            >
              SIGNUP
            </Button>
          </Form.Group>
        </Form.Row>
        <div>
          <h4>{alt}</h4>
        </div>
      </Form>
    </div>
  );
}

export default Signup;
