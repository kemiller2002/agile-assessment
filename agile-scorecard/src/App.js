import logo from "./logo.svg";
import "./App.css";
import Checklist from "./checklist/checklist";
import { Survey } from "./checklist/survey";
import axios from "axios";

import React from "react";
import { Route, Routes } from "react-router";
import Listing from "./listing/listing";

function Http() {
  const axiosInstance = axios.create();

  function get(uri) {
    return axiosInstance.get(uri);
  }

  this.get = get;
}

function App() {
  const http = new Http();

  return (
    <Routes>
      <Route path="/">
        <Route
          index
          element={
            <Listing
              http={http}
              surveyListUrl="surveys/survey-list.json"
            ></Listing>
          }
        />
        <Route path="survey/:name" element={<Survey http={http} />}>
          <Route path=":data" element={<Survey http={http} />}></Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
