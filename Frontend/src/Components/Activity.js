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
  const [pageCount, setPages] = useState(1);
  const [entries, setSelectEntries] = useState(2);
  const parsed = queryString.parse(location.search);
  const email = parsed.email;
  let arrayOfPages = [];
  const token = localStorage.getItem("token");
  // let lengthOfResponse = 0;
  const limit = 3;

  for (let i = 1; i <= 5; i++) {
    arrayOfPages[i] = i;
  }

  const setSelectChange = (e) => {
    console.log("In select change", e.target.value);
    setPages(e.target.value);

    console.log(setPages);
    Axios.post(
      `${backendServer}/getActivity`,
      { email: email, page: pageCount, limit: entries },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
      .then((response) => {
        console.log(response.data);

        setActivity(response.data);
        // console.log(activity);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  useEffect(() => {
    Axios.post(
      `${backendServer}/getActivity`,
      { email: email, page: pageCount, limit: entries },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    )
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
              <div className="form-group Login">
                <label for="Pagination">
                  <b>Select Page</b>
                </label>
                <select
                  onChange={(e) => {
                    setSelectChange(e);
                  }}
                  id="page"
                  name="page"
                  class="form-control"
                >
                  {arrayOfPages.map((item) => (
                    <option value={item}>{item}</option>
                  ))}
                </select>
              </div>
              <div className="form-group Login">
                <label for="NumberOfEntries">
                  <b>Select Number of Entries</b>
                </label>
                <select
                  onChange={(e) => {
                    setSelectEntries(e.target.value);
                  }}
                  id="entries"
                  name="entries"
                  class="form-control"
                >
                  <option value="2">2</option>
                  <option value="5">5</option>
                  <option value="2">10</option>
                </select>
              </div>
              <ListGroup variant="flush">
                {activity.map((activity) => (
                  <ListGroup.Item
                    variant="info"
                    // key={bill.amount}
                    className="links-acttivity-groups"
                    key={activity.created_time}
                  >
                    <b>{activity.created_by}</b> &nbsp;paid&nbsp;{" "}
                    <b>{activity.bill_amount}</b>
                    &nbsp; in &nbsp; <b>{activity.created_in}</b>&nbsp;for&nbsp;
                    <b>{activity.bill_desc}</b>&nbsp;on&nbsp;
                    <b>{activity.created_time}</b>
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
