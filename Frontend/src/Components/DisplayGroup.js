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
  Accordion,
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
  const token = localStorage.getItem("token");
  const [member_names, setMembers] = useState([]);
  const [comment_body, setCommentBody] = useState("");
  const [show, setShow] = useState(false);
  const [vis, setVis] = useState(false);
  const [groups, setGroups] = useState([]);
  const [amount, setAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [bills, setBills] = useState([]);
  const [comments, setComments] = useState([]);
  const [alert, setAlert] = useState("");
  const [message, setMessage] = useState("");
  const [commenter, setCommenter] = useState("");

  const no_of_members = member_names.length;
  console.log("No.of Members", no_of_members);

  const owe = parseInt(localStorage.getItem("IOweAmount"));
  const owed = parseInt(localStorage.getItem("OwedAmount"));
  console.log("On display page", owe);
  console.log("On display Page", owed);
  let isEnabled = false;

  if (commenter == email) {
    isEnabled = true;
  }

  const loadSuccessful = () => {
    const billid = localStorage.getItem("BillID");
    handleGetComment(billid);
  };

  const loadSuccess = (email) => {
    history.push({
      pathname: "/dash",
      search: `?email=${email}`,
    });
  };

  const handleClose = () => {
    setShow(false);
  };
  const handleCross = () => {
    setVis(false);
  };

  const handleSaveChanges = () => {
    AddBill(email, groupName, no_of_members);
  };

  const AddBill = (email, group, membercount) => {
    Axios.post(
      `${backendServer}/createBill`,
      {
        user_email: email,
        desc: description,
        bill_amt: amount,
        group_name: group,
        members: member_names,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
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
      Axios.post(
        `${backendServer}/getAllBills`,
        { g_name: group },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
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
    Axios.post(
      `${backendServer}/leaveGroup`,
      {
        email: u_email,
        groupName: groupname,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setMessage("Successfully Left Group");
          loadSuccess(email);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleGetComment = (billid) => {
    localStorage.setItem("BillID", billid);
    Axios.post(
      `${backendServer}/getComments`,
      {
        bill_id: billid,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setComments(response.data);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleDelete = (commentid) => {
    Axios.post(
      `${backendServer}/deleteComment`,
      {
        comment_id: commentid,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);

          setVis(false);
          loadSuccessful();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleAddComment = (billid) => {
    Axios.post(
      `${backendServer}/createComment`,
      {
        user_email: email,
        c_body: comment_body,
        bill: billid,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);

          setVis(false);
          loadSuccessful();
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const handleShow = () => setShow(true);
  const handleVis = (commenter) => {
    setVis(true);
    setCommenter(commenter);
  };
  useEffect(() => {
    Axios.post(
      `${backendServer}/getAllMembers`,
      {
        g_name: groupName,
        email: email,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        console.log(response.data[0].members);

        setMembers(response.data[0].members);
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
                          <b>{item}</b>
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

                    <Accordion>
                      {bills.map((bill) => (
                        // localStorage.setItem(billId,{bill._id})
                        <Card>
                          <Card.Header>
                            <Accordion.Toggle
                              as={Button}
                              variant="link"
                              eventKey={bill._id}
                              onClick={(e) => {
                                handleGetComment(bill._id);
                              }}
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
                                Created On: <i>{bill.created_time}</i>
                              </b>
                              <br></br>
                            </Accordion.Toggle>
                          </Card.Header>
                          <Accordion.Collapse eventKey={bill._id}>
                            <Card.Body>
                              <ListGroup>
                                {comments.map((comment) => (
                                  <ListGroup.Item
                                    variant="warning"
                                    className="links-dashboard-groups"
                                  >
                                    <b>
                                      <i>{comment.commented_by}:=</i>
                                    </b>
                                    <i> {comment.comment_body}</i>
                                    <Button
                                      className="button-settleup"
                                      onClick={(e) =>
                                        handleVis(comment.commented_by)
                                      }
                                    >
                                      Delete
                                    </Button>
                                    <br></br>
                                    <Modal show={vis} onHide={handleCross}>
                                      <Modal.Header closeButton>
                                        <Modal.Title>
                                          Delete Confirmation
                                        </Modal.Title>
                                      </Modal.Header>
                                      <Modal.Body>
                                        Are you sure you want to delete this
                                        comment
                                      </Modal.Body>
                                      <Modal.Footer>
                                        <Button
                                          disabled={!isEnabled}
                                          className="button-close"
                                          type="submit"
                                          onClick={(e) =>
                                            handleDelete(comment._id)
                                          }
                                        >
                                          Delete
                                        </Button>
                                      </Modal.Footer>
                                    </Modal>
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                              <input
                                type="text"
                                class="form-control"
                                id="InputUsername"
                                placeholder="Add Comment "
                                onChange={(e) => {
                                  setCommentBody(e.target.value);
                                }}
                              />
                              <br></br>
                              <Button
                                className="button-close"
                                onClick={(e) => {
                                  handleAddComment(bill._id);
                                }}
                              >
                                Add Comment
                              </Button>
                            </Card.Body>
                          </Accordion.Collapse>
                        </Card>
                      ))}
                    </Accordion>

                    {/* <Accordion.Collapse eventKey="1">
                          <Card.Body>Hello! I'm another body</Card.Body>
                        </Accordion.Collapse> */}

                    {/* <ListGroup>
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
                            Created On: <i>{bill.created_time}</i>
                          </b>
                          <br></br>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>  */}
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
