import React, { useEffect, useState } from "react";
import LeftNavBar from "./LeftNavBar/LeftNavBar";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
const queryString = require("query-string");
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
} from "react-bootstrap";

function Invites() {
  const location = useLocation();
  const isLogged = useSelector((state) => state.isLogged.username);
  const history = useHistory();
  const parsed = queryString.parse(location.search);
  const email = parsed.email;
  const [inviteList, SetInviteList] = useState([]);
  const [inviteMessage, SetInviteMessage] = useState("");
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = (groupName) => {
    localStorage.setItem("selectedGroupName", groupName);
    setShow(true);
  };
  const loadSuccessful = (email) => {
    history.push({
      pathname: "/dash",
      search: `?email=${email}`,
    });
  };

  //

  useEffect(() => {
    function getInviteList() {
      Axios.get(`${backendServer}/getInvites/` + email).then((response) => {
        console.log(response.data.group_list.length);
        if (response.data.group_list.length === 0) {
          SetInviteMessage("No Invitations at the moment !!!");
        }
        SetInviteList(response.data.group_list);
      });
    }
    getInviteList();
  }, [location]);

  const handleAccept = (e) => {
    const selectedgroup = localStorage.getItem("selectedGroupName");

    console.log(selectedgroup);

    e.preventDefault();

    console.log("hello");
    Axios.post(`${backendServer}/acceptInvite`, {
      user: email,
      selectedgroup: selectedgroup,
    }).then((response) => {
      console.log(response.data);
      setShow(false);
      loadSuccessful(email);
    });
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
            <div class="container">
              <h4>Invites List</h4>
              {inviteMessage}
              {inviteList.map((item) => (
                <div>
                  <Button
                    className="button-close"
                    onClick={(e) => handleShow(e.currentTarget.value)}
                    value={item}
                    key={item}
                  >
                    {item}
                    <br />
                  </Button>

                  <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                      <Modal.Title>Group Invite</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      Accept Invite to
                      {localStorage.getItem("selectedGroupName")}
                    </Modal.Body>
                    <Modal.Footer>
                      <Button
                        className="button-settleup"
                        value={item}
                        type="submit"
                        onClick={(e) => handleAccept(e)}
                      >
                        Accept
                      </Button>
                    </Modal.Footer>
                  </Modal>

                  <br />
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invites;
