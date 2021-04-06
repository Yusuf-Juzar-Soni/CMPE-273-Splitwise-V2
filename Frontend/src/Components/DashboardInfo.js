import React, { useEffect, useState } from "react";
const queryString = require("query-string");
import Axios from "axios";
import { useHistory, useLocation } from "react-router-dom";
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
import "./DashboardInfo.css";

function DashboardInfo() {
  const history = useHistory();
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const email = parsed.email;

  const [amounts, setFinalAmounts] = useState([" "]);
  const [owe, setOwe] = useState([]);
  const [owed, setOwed] = useState([]);
  const [bal, setBal] = useState(0);
  const [lena, setLena] = useState(0);
  const [dena, setDena] = useState(0);
  const [selectUser, setSelectUser] = useState({});
  const [show, setShow] = useState(false);
  const [show1, setShow1] = useState(false);
  const [selectUser1, setSelectUser1] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    console.log();

    Axios.get(`${backendServer}/amount/` + email).then((response) => {
      console.log(response);
      setFinalAmounts(response.data);
      setSplit(response.data);
    });

    console.log(amounts);
  }, [location]);

  const setSplit = (amounts1) => {
    console.log(amounts1);

    let negative = amounts1.filter((amt) => amt.amt < 0);
    let positive = amounts1.filter((amt) => amt.amt > 0);

    console.log(positive);
    console.log(negative);

    let negative_final = negative.map(function (item) {
      item.amt = item.amt * -1;
      return item;
    });

    setOwe(negative_final);
    setOwed(positive);
    console.log("Owe array", owe);

    findAmounts(negative_final, positive);
  };

  const findAmounts = (test1, test2) => {
    console.log(test1);
    let IOwe = 0;
    let Owed = 0;
    let balanced = 0;

    for (let j = 0; j < test1.length; j++) {
      if (test1[j] !== undefined) {
        IOwe = IOwe + test1[j].amt;
      }
    }
    console.log(IOwe);
    if (IOwe == NaN) IOwe = 0;

    for (let k = 0; k < test2.length; k++) {
      if (test2[k] !== undefined) {
        Owed = Owed + test2[k].amt;
      }
    }
    console.log(Owed);
    if (Owed == NaN) Owed = 0;

    balanced = IOwe - Owed;
    if (balanced < 0) balanced = 0;

    setDena(IOwe);
    setLena(Owed);
    setBal(balanced);
    localStorage.setItem("IOweAmount", IOwe);
    localStorage.setItem("OwedAmount", Owed);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleShow1 = () => setShow1(true);

  const handleClose = () => {
    setShow(false);
  };

  const handleClose1 = () => {
    setShow1(false);
  };

  //console.log(selectUser1);

  const handleSettleUp1 = (selectUser) => {
    console.log(selectUser.amt);
    SettleUp1(parsed.email, selectUser.email, selectUser.amt);
  };

  const handleSettleUp2 = (selectUser1) => {
    SettleUp2(parsed.email, selectUser1.email, selectUser1.amt);
  };

  // const selectedPayee = (e) => {
  //   console.log(e.target.value);
  // };

  const SettleUp1 = (email, senderemail, amount) => {
    Axios.post(`${backendServer}/settleUpOwe`, {
      user: email,
      sender: senderemail,
      amt: amount,
    })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setShow(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const SettleUp2 = (email, senderemail, amount) => {
    Axios.post(`${backendServer}/settleUpOwed`, {
      user: email,
      sender: senderemail,
      amount: amount,
    })
      .then((response) => {
        if (response.status == 200) {
          console.log(response.data);
          setShow1(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  function redirectToCreate(emailId) {
    history.push({
      pathname: "/creategroup",
      search: `?email=${emailId}`,
    });
  }

  const setSelectChange = (e) => {
    setSelectUser(JSON.parse(e.target.value));
    console.log(selectUser);
  };

  const setSelectChangeOwed = (e) => {
    setSelectUser1(JSON.parse(e.target.value));
    console.log(selectUser1);
  };

  return (
    <div>
      <div className="row">
        <div className="row">
          <div className="col-md-12">
            <Button
              data-testid="Settle Up"
              className="button-settleup"
              size="sm"
              onClick={handleShow}
            >
              Settle Up Owe
            </Button>
            <Button
              data-testid="Settle Up"
              className="button-settleup"
              size="sm"
              onClick={handleShow1}
            >
              Settle Up Owed
            </Button>
            <Button
              className="button-creategroup"
              size="sm"
              onClick={(event) => redirectToCreate(parsed.email)}
            >
              Create Group
            </Button>
          </div>
        </div>
      </div>
      <br></br>
      <br></br>
      <div className="row">
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>SettleUp Modal</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  <b>Select Who You Want to Settle Up With :</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    setSelectChange(e);
                  }}
                >
                  <option selected disabled hidden>
                    choose here
                  </option>
                  {owe.map((amount) => (
                    <option value={JSON.stringify(amount)}>
                      {amount.email} &nbsp;&nbsp; {amount.amt}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="button-close" onClick={handleClose}>
              Close
            </Button>

            <Button
              className="button-settleup"
              onClick={() => {
                handleSettleUp1(selectUser);
              }}
            >
              SettleUp
            </Button>
          </Modal.Footer>
        </Modal>
        {/* ------------------------------------------------------------------------------------------ */}
        <Modal show={show1} onHide={handleClose1}>
          <Modal.Header closeButton>
            <Modal.Title>SettleUp Modal Owed</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Label>
                  <b>Select Who You Want to Settle Up With :</b>
                </Form.Label>
                <Form.Control
                  as="select"
                  onChange={(e) => {
                    setSelectChangeOwed(e);
                  }}
                >
                  <option selected disabled hidden>
                    choose here
                  </option>
                  {owed.map((amount) => (
                    <option value={JSON.stringify(amount)}>
                      {amount.email} &nbsp;&nbsp; {amount.amt}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button className="button-close" onClick={handleClose1}>
              Close
            </Button>

            <Button
              className="button-settleup"
              onClick={() => {
                handleSettleUp2(selectUser1);
              }}
            >
              SettleUp Owed
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div class="row justify-content-center">
        <title>Welcome to Dashboard</title>
        <h4>Welcome to {username}'s Dashboard</h4>
      </div>
      <div className="row mt-2">
        <div className="col-md-4">
          <b>YOU OWE: ${dena}</b>
        </div>
        <div className="col-md-4">
          <b>YOU ARE OWED: ${lena}</b>
        </div>
        <div className="col-md-4">
          <b>BALANCE: ${bal}</b>
        </div>
      </div>

      <div className="show-grid">
        <div className="row mt-4">
          <div className="col-md-6">
            <p>
              <center>
                <b>
                  <u>YOU OWE</u>
                </b>
              </center>
            </p>
            <ListGroup>
              {owe.map((amt) => (
                <ListGroup.Item
                  variant="danger"
                  className="links-acttivity-groups"
                >
                  You owe <b>{amt.email}</b>&nbsp;<b>${amt.amt}</b>
                  <br></br>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
          <div className="col-md-6">
            <p>
              <center>
                <b>
                  <u>YOU ARE OWED</u>
                </b>
              </center>
            </p>
            <ListGroup>
              {owed.map((amount) => (
                <ListGroup.Item
                  variant="success"
                  className="links-acttivity-groups"
                >
                  <b>{amount.email}</b> owes you&nbsp;&nbsp;{" "}
                  <b>${amount.amt}</b>
                  <br></br>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInfo;
