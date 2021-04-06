import React, { useEffect, useState } from "react";
import LeftNavBar from "./LeftNavBar/LeftNavBar";
import Navbar from "react-bootstrap/Navbar";
import bg_image0 from "./assets/login_logo.png";
import Nav from "react-bootstrap/Nav";
import { useSelector } from "react-redux";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { useHistory } from "react-router-dom";
const queryString = require("query-string");
import alert from "alert";
import Axios from "axios";
import TopNavBar from "./TopNavBar";
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
  Alert,
} from "react-bootstrap";
import "./CreateGroup.css";

function CreateGroup() {
  const isLogged = useSelector((state) => state.isLogged.username);
  const history = useHistory();
  const parsed = queryString.parse(location.search);
  let email = parsed;

  const [group, setGroup] = useState("");
  const [flag, setFlag] = useState(false);
  const [user, setUsers] = useState([]);
  const [members, setMembers] = useState([]);
  const [alert, setAlert] = useState([]);
  const [success, setSuccess] = useState("");
  const [emailId, setEmail] = useState([email.email]);
  const isEnabled = group.length > 0;

  useEffect(() => {
    console.log(flag);
    console.log(email.email);
    Axios.get(`${backendServer}/allUsers/` + email.email)
      .then((response) => {
        console.log(response);
        let data = [];

        response.data.forEach((e) => {
          data.push({
            label: e.username + " ( " + e.user_email + " )",
            value: e.user_email,
          });
          setUsers(data);
        });
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(user);
  }, []);

  // const handleClickDashboard = () => {
  //   history.push({
  //     pathname: "/dash",
  //     search: "?email=" + parsed.email,
  //   });
  // };

  // const dashboard = () => {
  //   handleClickDashboard();
  // };

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(members);

    let finalMembers = [];
    finalMembers = members.map((member) => member.value);

    Axios.post(`${backendServer}/createGroup`, {
      groupName: group,
      user: emailId,
      members: finalMembers,
    })
      .then((response) => {
        console.log(response);

        setSuccess("Group Created");
      })
      .catch((e) => {
        if (e.response && e.response.data) {
          console.log(e.response.data.message);
          setAlert("Group already Exist");
        }
      });
  };

  const onChange = (opt) => {
    if (opt == null || opt == "undefined") {
      opt = "";
    }
    setMembers((prev) => [...opt]);
    console.log(members);
  };

  return (
    <div>
      <div className="creategroup">
        <div>
          <TopNavBar />
        </div>
        <div className="row">
          <div div className="col-md-2">
            <LeftNavBar />
          </div>
          <div div className="col-md-10">
            <div className="row">
              <div className="col-md-10">
                <div className="mytitle" style={{ fontSize: 30 }}>
                  <center>
                    <b>ADD A GROUP</b>
                  </center>
                </div>
                <form>
                  <div>
                    <label for="groupName">
                      <b>Group Name</b>
                    </label>
                    <input
                      type="text"
                      id="groupName"
                      className="form-control"
                      aria-describedby="emailHelp"
                      placeholder="Enter Group Name"
                      onChange={(e) => {
                        setGroup(e.target.value);
                      }}
                    />
                  </div>
                  <div>
                    <label for="emailOfGroupMembers">
                      <b>Email ID of group members</b>
                    </label>
                    <Select
                      onChange={(opt) => onChange(opt)}
                      options={user}
                      isMulti
                    />
                  </div>
                  <Button
                    disabled={!isEnabled}
                    className="button-create"
                    onClick={onSubmit}
                  >
                    Create a group
                  </Button>
                </form>
                <h4>{alert}</h4>
                <h4>{success}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
