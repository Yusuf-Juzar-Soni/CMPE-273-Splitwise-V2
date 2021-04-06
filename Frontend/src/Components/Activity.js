import React, { useEffect, useState } from "react";
import LeftNavBar from "./LeftNavBar/LeftNavBar";
import Navbar from "react-bootstrap/Navbar";
import bg_image0 from "./assets/login_logo.png";
import { useSelector } from "react-redux";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import Select from "react-select";
import { useHistory, useLocation } from "react-router-dom";
const queryString = require("query-string");
import Axios from "axios";
import TopNavBar from "./TopNavBar";
import "./Activity.css";
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
import backendServer from "../webConfig";

const Activity = () => {
  const location = useLocation();
  const isLogged = useSelector((state) => state.isLogged.username);
  const [activity, setActivity] = useState([]);
  const parsed = queryString.parse(location.search);
  const email = parsed.email;

  useEffect(() => {
    Axios.get(`${backendServer}/Activity/` + email)
      .then((response) => {
        console.log(response);
        setActivity(response.data);
        console.log(activity);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [location]);

  return (
    <div>
      <div>
        <TopNavBar />
      </div>
      <div className="row">
        <div div className="col-md-2">
          <LeftNavBar />
        </div>
        <div className="col-md-10">
          <h4 data-testid="Activity">Recent Activity</h4>
          <br></br>
          <div className="row ml-1">
            <div className="col-sm-12">
              <ListGroup variant="flush">
                {activity.map((activity) => (
                  <ListGroup.Item
                    variant="info"
                    // key={bill.amount}
                    className="links-acttivity-groups"
                  >
                    <b>{activity.created_by}</b> &nbsp;paid&nbsp;{" "}
                    <b>{activity.bill_amount}</b>
                    &nbsp; in &nbsp; <b>{activity.bill_group}</b>&nbsp;for&nbsp;
                    <b>{activity.bill_desc}</b>&nbsp;on&nbsp;
                    <b>{activity.bill_timestamp}</b>
                    <br></br>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Activity;
