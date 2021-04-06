import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";
import LeftNavBar from "./LeftNavBar/LeftNavBar";
import { useHistory, useLocation } from "react-router-dom";
const queryString = require("query-string");
import Axios from "axios";
import TopNavBar from "./TopNavBar";
import "./DisplayGroup.css";
import backendServer from "../webConfig";
import {
  Nav,
  Row,
  Col,
  Button,
  Card,
  Container,
  ListGroup,
  Modal,
  Form,
} from "react-bootstrap";

function DisplayGroup() {
  const location = useLocation();
  const isLogged = useSelector((state) => state.isLogged.username);
  const user_name = isLogged;
  console.log(user_name);
  const history = useHistory();
  const parsed = queryString.parse(location.search);
  const email = parsed.email;
  const groupName = parsed.groupname;
  console.log(email);
  console.log(groupName);
  const [member_names, setMembers] = useState([]);

  const [show, setShow] = useState(false);
  const [groups, setGroups] = useState([]);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [bills, setBills] = useState([]);
  const [alert, setAlert] = useState("");
  const [message, setMessage] = useState("");
  const no_of_members = member_names.length;
  console.log("No.of Members", no_of_members);

  const owe = parseInt(localStorage.getItem("IOweAmount"));
  const owed = parseInt(localStorage.getItem("OwedAmount"));
  console.log("On display page", owe);
  console.log("On display Page", owed);

  const handleClose = () => {
    setShow(false);
  };

  const handleSaveChanges = () => {
    AddBill(email, groupName, no_of_members);
  };

  const AddBill = (email, group,membercount) => {
    Axios.post(`${backendServer}/addBill`, {
      user: email,
      billData: description,
      amount: amount,
      group: group,
      members: member_names,
    })
      .then((response) => {
        console.log(response.data);
        fetchBills(group).then((result) => {
          console.log(result);
          setBills([]);
          setBills(result);
        });
        setShow(false);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  function fetchBills(group) {
    return new Promise((resolve, reject) => {
      Axios.get(`${backendServer}/fetchBills/` + group)
        .then((response) => {
          console.log(response.data);
          resolve(response.data);
        })
        .catch((e) => {
          console.log(e);
        });
    });
  }

  const handleLeaveGroup = () => {
    console.log("inside caller function", owe);
    console.log("inside caller function 1", owed);
    if (owe === 0 && owed === 0) {
      console.log("inside caller if");
      LeaveGroup(parsed.email, groupName);
    } else {
      setAlert("Unable to leave group as dues pending");
    }
  };

  const LeaveGroup = (u_email, groupname) => {
    Axios.post(`${backendServer}/leaveGroup`, {
      user: u_email,
      group: groupname,
    })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setMessage("Successfully Left Group");
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    Axios.post(`${backendServer}/allMembers`, {
      groupname: groupName,
      email: email,
    })
      .then((response) => {
        console.log(response);

        setMembers(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
    console.log(member_names);

    fetchBills(groupName).then((result) => {
      console.log(result);
      setBills([]);
      setBills(result);
    });
  }, [location]);

  return (
    <div>
      <div className="displaygroup">
        <div>
          <TopNavBar />
        </div>
        <div className="row">
          <div className="col-md-2">
            <LeftNavBar />
          </div>
          <div className="col-md-10">
            <div className="row justify-content-center">
              <div className="col-md-12">
                <h4>Group Name {groupName}</h4>

                <Button className="button-addBillPrimary" onClick={handleShow}>
                  Add Bill Display Page
                </Button>
                <Button
                  className="button-close"
                  onClick={() => {
                    handleLeaveGroup();
                  }}
                >
                  Leave Group
                </Button>
                <h4>{alert}</h4>
                <h4>{message}</h4>
                <br></br>
                <br></br>
                <div className="row">
                  <div className="col-md-3">
                    <h4>Group Members</h4>

                    <ListGroup>
                      {member_names.map((item) => (
                        <ListGroup.Item variant="light">
                          <b>{item.user_email}</b>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>

                  <div className="col-md-9">
                    <h4>Bills in Group</h4>
                    <Modal show={show} onHide={handleClose}>
                      <Modal.Header closeButton>
                        <Modal.Title>Add a Bill</Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <Form>
                          <Form.Group controlId="formBasicEmail">
                            <Form.Label>Description</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter description"
                              onChange={(e) => {
                                setDescription(e.target.value);
                              }}
                            />
                          </Form.Group>
                          <Form.Group controlId="formBasicEmail">
                            <Form.Label>Amount</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Enter amount"
                              onChange={(e) => {
                                setAmount(e.target.value);
                              }}
                            />
                          </Form.Group>
                        </Form>
                      </Modal.Body>
                      <Modal.Footer>
                        <Button className="button-close" onClick={handleClose}>
                          Close
                        </Button>
                        <Button
                          className="button-addBillSecondary"
                          onClick={handleSaveChanges}
                        >
                          Add Bill
                        </Button>
                      </Modal.Footer>
                    </Modal>
                    <ListGroup>
                      {bills.map((bill) => (
                        <ListGroup.Item
                          variant="warning"
                          className="links-dashboard-groups"
                        >
                          <b>
                            Created By:<i> {bill.created_by}</i>
                          </b>
                          <br></br>
                          <b>
                            Bill Amount:<i> ${bill.bill_amount}</i>
                          </b>
                          <br></br>
                          <b>
                            Created On: <i>{bill.bill_timestamp}</i>
                          </b>
                          <br></br>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DisplayGroup;
