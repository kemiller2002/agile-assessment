import {
  makeHeader,
  updateStateDetermineNavigate,
  convertAndParse,
} from "./checklist";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getChecklist } from "../utilities/surveyData";

import { useHistory, useLocation } from "react-router-dom";
export function CreateInstance({ data, http }) {
  const [survey, updateChecklist] = useState({ items: [] });
  const parameters = useParams();
  const navigate = useNavigate();

  const loadChecklist = () => {
    getChecklist(http, name)
      .then((x) => {
        return x;
      })
      .then((d) => updateChecklist(d));
  };
  useEffect(loadChecklist, []);
  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const parsedData = convertAndParse(data || parameters.data);
  const name = parameters.name || parsedData.surveyName;

  const getData = () => parsedData || { surveyName: name };

  const urlData = getData();
  const getValue = (key) => urlData[key];

  const buildUrl = (reactLocation) => {
    const parts = reactLocation.pathname.split("/");
    const linkUrlPathName = reactLocation.pathname.replace(parts[1], "survey");
    const regex = new RegExp(`/${parts[1]}.*`);
    const location = window.location;
    const newPath = location.pathname.replace(regex, linkUrlPathName);

    return `${location.protocol}//${location.host}${newPath}`;
  };

  const surveyInstanceUrl = buildUrl(useLocation());

  const copyUrl = (url) => navigator.clipboard.writeText(url);

  return (
    <div>
      <h1 data-title>Create instance for 360 reviews</h1>
      <div>
        {makeHeader(survey, false, updateState, urlData, getValue, true)}
      </div>
      <div data-url-send-container>
        <h3 data-url-direction>URL to copy and send to participants.</h3>
        <div data-container>
          <div data-spacer></div>
          <div data-url-instance>{surveyInstanceUrl}</div>
          <div data-spacer></div>
        </div>

        <div>
          <button
            data-copy-url
            type="button"
            onClick={() => copyUrl(surveyInstanceUrl)}
          >
            Copy URL
          </button>
        </div>
      </div>
    </div>
  );
}
