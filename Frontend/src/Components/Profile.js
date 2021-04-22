import React, { useEffect, useState } from "react";
import backendServer from "../webConfig";
import { useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
const queryString = require("query-string");
import axios from "axios";
import TopNavBar from "./TopNavBar";

import LeftNavBar from "./LeftNavBar/LeftNavBar";
import "./Profile.css";
import {
  Button,
  Grid,
  Row,
  Col,
  ListGroup,
  Form,
  Card,
  Modal,
  Image,
} from "react-bootstrap";

function Profile() {
  const location = useLocation();
  const parsed = queryString.parse(location.search);
  const email = parsed.email;
  const [user, setUser] = useState([" "]);
  const [selectedFile, setFile] = useState();
  const [amazonurl, setURL] = useState([
    "https://splitwiseyusuf123.s3.us-east-2.amazonaws.com/d1b98d2059dc419d2c012cc1cee52154.jpg",
  ]);

  const [name, setName] = useState("");
  const [currency, setCurrency] = useState("");
  const [time, setTime] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  //change default url
  const token = localStorage.getItem("token");

  useEffect(() => {
    console.log("useEffect called");
    getUser();
    getImageOnLoad();
    console.log(user);
  }, []);

  const getUser = async () => {
    try {
      const res = await axios.post(
        `${backendServer}/getProfile`,
        {
          email: email,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      );
      console.log(res.data);
      setName(res.data[0].name);
      setCurrency(res.data[0].currency);
      setPhone(res.data[0].phone);
      setTime(res.data[0].timezone);
      setUser(res.data);
    } catch (e) {
      console.log(e);
    }
  };

  const getImageOnLoad = async () => {
    var data = {
      useremail: email,
    };

    await axios
      .post(`${backendServer}/getimageonload`, data, {
        headers: {
          Authorization: `${token}`,
        },
      })
      .then((res) => {
        if (res.status === 200) {
          console.log("Got response", res.data.imagelink[0].photostring);
          setURL(res.data.imagelink[0].photostring);
        } else {
          console.log("There was some error!");
        }
      });
  };

  const setDefault = (e) => {
    setFile(e.target.files[0]);
    console.log(setFile);
  };

  const onSave = (e, file) => {
    const formData = new FormData();
    console.log("Inside submit data!");
    console.log("Got state of file:", file);
    formData.append("file", file);
    formData.append("useremail", email);
    axios.post(`${backendServer}/imageupload`, formData).then((res) => {
      if (res.status === 200) {
        console.log("Image uploaded on S3!");
        var data = {
          useremail: email,
        };
        console.log("Got email!", data.useremail);
        axios
          .post(`${backendServer}/getimage`, data, {
            headers: {
              Authorization: `${token}`,
            },
          })
          .then((res) => {
            console.log("Inside frontend API!");
            if (res.status === 200) {
              console.log("Got response", res.data.imagelink[0].photostring);
              setURL(res.data.imagelink[0].photostring);
            } else {
              console.log("There was some error!");
            }
          });
      } else {
        console.log("There was some error!");
      }
    });
  };

  const onUpdate = (e) => {
    axios
      .post(
        `${backendServer}/updateProfile`,
        {
          name: name,
          currency: currency,
          phonenumber: phone,
          timezone: time,
          email: email,
        },
        {
          headers: {
            Authorization: `${token}`,
          },
        }
      )
      .then((res) => {
        if (res.status === 200) {
          getUser();
          console.log("ProfileUpdated");
          setMessage("Profile Updated");
        } else {
          console.log("There was some error!");
        }
      });
  };

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
          <div className="row">
            <div className="col-sm-12 .col-md-6 .offset-md-3">
              <center>
                <h4
                  data-testid="Account"
                  style={{ color: "gray", fontSize: 19, marginBottom: 22 }}
                >
                  YOUR ACCOUNT
                </h4>
                <div className="ImgUpload">
                  <div className="myImage">
                    <h5 className="heading">Add your Image</h5>
                    <div className="form-group">
                      <input
                        type="file"
                        id="file"
                        accept=".png, .jpg, .jpeg"
                        onChange={(e) => {
                          setDefault(e);
                        }}
                      />
                    </div>
                    <div className="img-holder">
                      {/* {console.log(this.state.selectedFile)} */}
                      <img src={amazonurl} alt="" id="img" className="img" />
                    </div>
                    <div className="form-group">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={(e) => {
                          onSave(e, selectedFile);
                        }}
                      >
                        Upload
                      </button>
                    </div>
                  </div>
                </div>
                <form>
                  <label for="InputUsername">
                    <b>Username</b>
                  </label>
                  <input
                    type="text"
                    class="form-control"
                    id="InputUsername"
                    placeholder={user[0].name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />

                  <div className="form-group Login">
                    <label for="InputEmail">
                      <b>Email</b>
                    </label>
                    <input
                      type="email"
                      class="form-control"
                      id="InputEmail"
                      placeholder={user[0].email}
                    />
                  </div>
                  <div className="form-group Login">
                    <label for="InputPhone">
                      <b>Phone</b>
                    </label>
                    <input
                      type="tel"
                      class="form-control"
                      id="InputPhone"
                      placeholder={user[0].phonenumber}
                      onChange={(e) => {
                        setPhone(e.target.value);
                      }}
                    />
                  </div>
                  <div className="form-group Login">
                    <label for="InputTimezone">
                      <b>Timezone</b>
                    </label>
                    <select
                      class="form-control"
                      onChange={(e) => {
                        setTime(e.target.value);
                      }}
                    >
                      <option value="" disabled selected hidden>
                        {user[0].timezone}
                      </option>
                      <option
                        timeZoneId="5"
                        gmtAdjustment="GMT-08:00"
                        useDaylightTime="1"
                        value="-8"
                      >
                        (GMT-08:00) Pacific Time (US & Canada)
                      </option>
                      <option
                        timeZoneId="1"
                        gmtAdjustment="GMT-12:00"
                        useDaylightTime="0"
                        value="-12"
                      >
                        (GMT-12:00) International Date Line West
                      </option>
                      <option
                        timeZoneId="2"
                        gmtAdjustment="GMT-11:00"
                        useDaylightTime="0"
                        value="-11"
                      >
                        (GMT-11:00) Midway Island, Samoa
                      </option>
                      <option
                        timeZoneId="3"
                        gmtAdjustment="GMT-10:00"
                        useDaylightTime="0"
                        value="-10"
                      >
                        (GMT-10:00) Hawaii
                      </option>
                      <option
                        timeZoneId="4"
                        gmtAdjustment="GMT-09:00"
                        useDaylightTime="1"
                        value="-9"
                      >
                        (GMT-09:00) Alaska
                      </option>

                      <option
                        timeZoneId="7"
                        gmtAdjustment="GMT-07:00"
                        useDaylightTime="0"
                        value="-7"
                      >
                        (GMT-07:00) Arizona
                      </option>

                      <option
                        timeZoneId="9"
                        gmtAdjustment="GMT-07:00"
                        useDaylightTime="1"
                        value="-7"
                      >
                        (GMT-07:00) Mountain Time (US & Canada)
                      </option>
                      <option
                        timeZoneId="10"
                        gmtAdjustment="GMT-06:00"
                        useDaylightTime="0"
                        value="-6"
                      >
                        (GMT-06:00) Central America
                      </option>
                    </select>
                  </div>

                  <div className="form-group Login">
                    <label for="InputCurrency">
                      <b>Currency</b>
                    </label>
                    <select
                      id="currency"
                      name="currency"
                      class="form-control"
                      onChange={(e) => {
                        setCurrency(e.target.value);
                      }}
                    >
                      <option value="" disabled selected hidden>
                        {user[0].currency}
                      </option>
                      <option value="USD">US Dollar</option>
                      <option value="GBP">Great Britain Pound</option>
                    </select>
                  </div>

                  <div className="form-group Login">
                    <label for="InputLanguage">
                      <b>Language</b>
                    </label>
                    <select id="language" name="language" class="form-control">
                      <option value="English">English</option>
                    </select>
                  </div>

                  <Button
                    className="button-save"
                    onClick={(e) => {
                      onUpdate(e);
                    }}
                  >
                    Save Profile
                  </Button>
                </form>
                <h4>{message}</h4>
              </center>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default Profile;
