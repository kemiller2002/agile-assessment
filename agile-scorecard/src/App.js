import "./App.css";
import { Survey } from "./checklist/survey";
import { ComparativeScore } from "./checklist/comparative-score";
import { Compression } from "./utilities/compression";
import { CreateInstance } from "./checklist/create-instance";
import axios from "axios";

import React from "react";
import { Route, Routes } from "react-router";
import Listing from "./listing/listing";
import { Report } from "./checklist/report";

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
        <Route
          path="report/:name/:data"
          element={<Report http={http} />}
        ></Route>
        <Route path="survey/:name" element={<Survey http={http} />}>
          <Route path=":data" element={<Survey http={http} />}></Route>
        </Route>
        <Route
          path="create-instance/:name"
          element={<CreateInstance http={http} />}
        >
          <Route path=":data" element={<CreateInstance http={http} />}></Route>
        </Route>
        <Route path="graph" element={<ComparativeScore http={http} />}>
          <Route
            path=":data"
            element={<ComparativeScore http={http} />}
          ></Route>
        </Route>
        <Route path="utilities">
          <Route path="compression" element={<Compression http={http} />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
