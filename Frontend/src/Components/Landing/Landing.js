import React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import { Nav } from "react-bootstrap";
import bg_image0 from "../assets/login_logo.png";
import bg_image1 from "../assets/splitwise_home_2.png";
import bg_image2 from "../assets/splitwise_home_3.png";

const Landing = function () {
  return (
    <div>
      <div>
        <Navbar bg="success" expand="lg">
          <Navbar.Brand>
            <img src={bg_image0} width="50" height="50"></img>
          </Navbar.Brand>
          <Nav className="mr-auto">
            <Nav.Link href="#home" />
          </Nav>
          <Button data-testid="Login" variant="success" href="./login">
            Login
          </Button>
          <Button variant="success" href="./signup">
            Signup
          </Button>
        </Navbar>
      </div>
      <div>
        <img src={bg_image1} width="1350" height="600"></img>
        <img
          src={bg_image2}
          width="1350"
          height="600"
          style={{ marginTop: 80 }}
        ></img>
      </div>
    </div>
  );
};

export default Landing;
