import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "./Dashboard.css";
import LeftNavBar from "../LeftNavBar/LeftNavBar";
import TopNavBar from "../TopNavBar";
import DashboardInfo from "../DashboardInfo";

const Dashboard = function () {
  
  const isLogged = useSelector((state) => state.isLogged.username);
  console.log("hello");
  return (
    <div className="dashboard">
      <div>
        <TopNavBar />
      </div>
      <h4 data-testid="Dashboard">Dashboard</h4>

      <div className="row">
        <div div className="col-md-2">
          <LeftNavBar />
        </div>
        <div div className="col-md-10">
          <DashboardInfo />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
