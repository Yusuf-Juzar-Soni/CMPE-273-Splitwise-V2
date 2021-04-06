import { React, useEffect, useState } from "react";
import Nav from "react-bootstrap/Nav";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
const queryString = require("query-string");
import { useLocation } from "react-router-dom";
import "./LeftNavBar.css";
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
import backendServer from "../../webConfig";

function LeftNavBar() {
  const history = useHistory();
  const emailID = useSelector((state) => state.isLogged.email);

  const [group_names, group_namesChange] = useState([]);
  const [change, setHandleChange] = useState(false);
  const [list, setListDisplay] = useState([]);
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  function retriveGroups(user_email1) {
    const user_email = { email: user_email1 };
    axios
      .post(`${backendServer}/dashboard`, user_email)
      .then((response) => {
        console.log(response.data);
        group_namesChange(response.data);
        console.log(group_names);
      })
      .catch((err) => {
        if (err.response && err.response.data) {
          alert(err.response.data.message);
        }
      });
  }

  function redirectToGroup(redirectGroup, emailId) {
    history.push({
      pathname: "/groupsdisplay",
      search: `?groupname=` + redirectGroup + `&email=` + emailId,
    });
  }

  function redirectToDashboard(emailId) {
    history.push({
      pathname: "/dash",
      search: `?email=${emailId}`,
    });
  }

  function redirectToCreate(emailId) {
    history.push({
      pathname: "/creategroup",
      search: `?email=${emailId}`,
    });
  }

  function redirectToActivity(emailId) {
    history.push({
      pathname: "/activitydisplay",
      search: `?email=${emailId}`,
    });
  }

  function redirectToInvites(emailId) {
    history.push({
      pathname: "/invitedisplay",
      search: `?email=${emailId}`,
    });
  }
  const handleSearch = (e, groups) => {
    setHandleChange(true);
    console.log(groups);
    let final_list = groups.filter((names) => {
      return names.includes(e.target.value);
    });
    setListDisplay(final_list);
  };

  useEffect(() => {
    retriveGroups(parsed.email);
  }, [location]);

  return (
    <div>
      <div>
        <Nav defaultActiveKey="/home" className="flex-column" color="red">
          <Nav.Link onClick={(event) => redirectToDashboard(parsed.email)}>
            Dashboard
          </Nav.Link>
          <Nav.Link
            data-testid="Activity"
            onClick={(event) => redirectToActivity(parsed.email)}
          >
            Activity
          </Nav.Link>
          <Nav.Link>Groups</Nav.Link>
          <input
            type="text"
            onChange={(e) => handleSearch(e, group_names)}
          ></input>
          {change == true && (
            <ListGroup className="list-group-design">
              {list.map((item) => (
                <Button
                  value={item}
                  key={item}
                  variant="link"
                  onClick={(event) =>
                    redirectToGroup(event.currentTarget.value, parsed.email)
                  }
                >
                  {item}
                </Button>
              ))}
            </ListGroup>
          )}

          {change == false && (
            <ListGroup className="list-group-design">
              {group_names.map((item) => (
                <Button
                  value={item}
                  key={item}
                  variant="link"
                  onClick={(event) =>
                    redirectToGroup(event.currentTarget.value, parsed.email)
                  }
                >
                  {item}
                </Button>
              ))}
            </ListGroup>
          )}
          <Nav.Link onClick={(event) => redirectToCreate(parsed.email)}>
            Create Group
          </Nav.Link>
          <Nav.Link onClick={(event) => redirectToInvites(parsed.email)}>
            Invite List
          </Nav.Link>
        </Nav>
      </div>
    </div>
  );
}
export default LeftNavBar;
