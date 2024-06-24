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

export function InterviewAssessmentAdministrator({ data, http }) {
  const [instrument, updateInstrument] = useState({ items: [] });
  const [participantUrls, updateParticipantUrls] = useState([]);

  const parameters = useParams();
  const navigate = useNavigate();

  return (
    <div>
      <div>
        <span>Assessment Instance</span>
        <input type="text"></input>
      </div>
      <div>
        <span>Group Identifier</span>
        <input type="text"></input>
      </div>

      <div>
        <span>Save Results URL</span>
        <input type="text"></input>
      </div>

      <div>
        <span>Results Authentication</span>
        <input type="text" placeholder="username"></input>
        <input type="text" placeholder="password"></input>
      </div>

      <div>
        <span>Private Results Passphrase</span>
        <input type="text"></input>
      </div>
    </div>
  );
}
