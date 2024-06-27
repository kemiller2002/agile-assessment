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

  const instanceId = createInstanceId(10);

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

  return (
    <div>
      <div>
        {makeHeader(survey, false, updateState, urlData, getValue, true)}
      </div>
      <div>
        <div>
          <label>
            Assessment Instance
            <input
              type="text"
              value={instanceId}
              onChange={() => console.log("update")}
            ></input>
          </label>
        </div>
        <div>
          <label>
            Group Identifier
            <input
              type="text"
              placeholder="Group Name"
              value={groupId}
              onChange={updateGroupId}
            ></input>
          </label>
        </div>

        <div>
          <label>
            Save Results URL
            <input
              type="text"
              value={resultsUrl}
              onChange={updateResultsUrl}
            ></input>
          </label>
        </div>

        <div>
          <h2>Results Authentication</h2>
          <label>
            <input type="text" placeholder="username" value={userName}></input>
          </label>
          <label>
            <input type="text" placeholder="token" value={token}></input>
          </label>
        </div>

        <div>
          <label>
            Private Results Passphrase
            <input
              type="text"
              value={privatePassphrase}
              onChange={updatePrivatePassphrase}
            ></input>
          </label>
        </div>

        <button>Create Group Instance</button>
      </div>
    </div>
  );
}
