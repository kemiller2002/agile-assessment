import {
  makeHeader,
  updateStateDetermineNavigate,
  convertAndParse,
  updateDataObject,
  convertForUrl,
} from "./instrument";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInstrument } from "../utilities/surveyData";
import { createInstanceId } from "../utilities/identifiers";
import { useHistory, useLocation } from "react-router-dom";
import { array, number } from "prop-types";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { functionReducer } from "../utilities/reducer";

import { Link } from "react-router-dom";

export function InterviewAssessmentAdministrator({ http }) {
  const [instrument, updateInstrument] = useState({ items: [] });
  const [participantUrls, updateParticipantUrls] = useState([]);
  const [survey, updateChecklist] = useState({ items: [] });
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({
    navigate,
  });

  const parsedData = convertAndParse(parameters.data);
  const name = parameters.name || parsedData.surveyName;

  const scoreData = {};
  const sectionScoreDefault = survey.sectionScoreDefault;

  const getData = () => parsedData || { surveyName: name };

  const urlData = getData();
  const getValue = (key) => urlData[key];

  const instanceId = getValue("instanceId") || createInstanceId(10);

  const userName = getValue("userName");
  const token = getValue("token");

  const resultsUrl = getValue("resultsUrl");
  const groupId = getValue("groupId");
  const privatePassphrase = getValue("privatePassphrase") || "";

  function updateGroupId(e) {
    const team = e.target.value;
    const updatedTeam = updateDataObject(urlData, "team", team);
    updateState(updatedTeam);
  }

  function updateResultsUrl(e) {
    const value = e.target.value;
    const update = updateDataObject(urlData, "resultsUrl", value);
    updateState(update);
  }

  function updatePrivatePassphrase(e) {
    const value = e.target.value;
    const update = updateDataObject(urlData, "privatePassphrase", value);
    updateState(update);
  }

  function updateInstanceId(e) {
    const value = e.target.value;
    const update = updateDataObject(urlData, "instanceId", value);
    updateState(update);
  }

  return (
    <div>
      <div>
        {makeHeader(survey, false, updateState, urlData, getValue, true)}
      </div>
      <div>
        <div data-header="true">
          <input
            data-assessment-display-administrator
            type="text"
            value={instanceId}
            onChange={updateInstanceId}
          ></input>
        </div>
        <div data-header="true">
          <input
            data-assessment-display-administrator
            type="text"
            placeholder="Group Name"
            value={groupId}
            onChange={updateGroupId}
          ></input>
        </div>

        <div data-header="true">
          <h2 className="align-center">Results Authentication</h2>

          <div data-header="true">
            <input
              data-assessment-display-administrator
              type="text"
              value={resultsUrl}
              onChange={updateResultsUrl}
              placeholder="Results URL"
            ></input>
          </div>

          <input
            type="text"
            placeholder="Username"
            value={userName}
            data-assessment-display-administrator
          ></input>
          <input
            type="text"
            placeholder="Token"
            value={token}
            data-assessment-display-administrator
          ></input>
        </div>

        <div data-header="true">
          <h2 className="align-center">Results Encryption</h2>{" "}
          <input
            placeholder="Private Results Passphrase"
            data-assessment-display-administrator
            type="text"
            value={privatePassphrase}
            onChange={updatePrivatePassphrase}
          ></input>
        </div>

        <div data-complete-assessment className="pad-top">
          <Link
            to={`/initialize-instance/${name}/${parameters.data}`}
            data-prepare-to-send-link="true"
          >
            Create Assessment Instance
          </Link>
        </div>
      </div>
    </div>
  );
}
