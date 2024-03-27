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

function reducer(s, i) {
  return i(s);
}

function splitOutCalibrationItems(items) {
  return items.reduce(
    (s, i) => {
      const isCalibration = i.calibration;

      return {
        calibration: [...s.calibration, ...[...(isCalibration ? [i] : [])]],
        standard: [...s.standard, ...[...(isCalibration ? [] : [i])]],
      };
    },
    { calibration: [], standard: [] }
  );
}

function shuffleArray(array) {
  // Creating a copy of the original array to avoid modifying it directly
  let arr = array.slice();

  for (let ii = arr.length - 1; ii > 0; ii--) {
    // Generate a random index from 0 to i
    let jj = Math.floor(Math.random() * (ii + 1));

    // Swap arr[i] with the element at random index
    [arr[ii], arr[jj]] = [arr[jj], arr[ii]];
  }

  return arr;
}

function createQuestionDistribution(
  items,
  numberOfParticipants,
  itemCountPerEntry,
  entries = []
) {
  const startingPosition = (numberOfParticipants - 1) * itemCountPerEntry;
  return numberOfParticipants <= 0
    ? entries
    : createQuestionDistribution(
        items,
        numberOfParticipants - 1,
        itemCountPerEntry,
        [
          [
            ...items.calibration,
            ...items.standard.slice(
              startingPosition,
              startingPosition + itemCountPerEntry
            ),
          ],
          ...entries,
        ]
      );
}

function createDataState(studyDataObject, input) {
  return [
    (i) => i.map((x) => x.id),
    (i) => i.join(";"),
    (x) => updateDataObject(studyDataObject, "questionList", x, true),
    convertForUrl,
  ].reduce(reducer, input);
}

function createUrlsForDistribution(
  instrument,
  numberOfParticipants,
  baseUrl,
  baseData
) {
  const createUrl = (data) => `${baseUrl}/${data}`;
  const dataStateFunction = (data) => createDataState(baseData, data);

  return [
    (i) => i.items,
    (i) => i.map((x) => x.entries),
    (i) => i.flat(),
    splitOutCalibrationItems,
    (x) => ({ calibration: x.calibration, standard: shuffleArray(x.standard) }),
    (x) =>
      createQuestionDistribution(
        x,
        numberOfParticipants,
        Math.ceil(x.standard.length / numberOfParticipants)
      ),
    (x) => x.map(shuffleArray),
    (x) => {
      console.log(x);
      return x;
    },
    (x) => x.map(dataStateFunction),
    (x) => {
      console.log(baseUrl, x);
      return x;
    },
    (x) => x.map(createUrl),
  ].reduce(reducer, instrument);
}

function makeUrlDistributionUI(entry, copyAction) {
  return (
    <div className="question-distributer-url-entry-container">
      <div className="question-distributer-url">{entry}</div>
      <div
        className="question-distributer-copy-icon"
        onClick={() => copyAction(entry)}
      >
        <FontAwesomeIcon icon={faCopy} />
      </div>
    </div>
  );
}

function getBaseData(data) {
  return [(i) => i].reduce(reducer, data);
}

export function QuestionDistributer({ data, http }) {
  const [instrument, updateInstrument] = useState({ items: [] });
  const [participantUrls, updateParticipantUrls] = useState([]);

  const parameters = useParams();
  const navigate = useNavigate();

  const loadInstrument = () => {
    getInstrument(http, name)
      .then((x) => {
        return x;
      })
      .then((d) => updateInstrument(d));
  };

  useEffect(loadInstrument, []);

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const parsedData = convertAndParse(data || parameters.data);
  const name = parameters.name || parsedData.surveyName;

  const getData = () => parsedData || { surveyName: name };

  const urlData = getData();
  const getValue = (key) => urlData[key];

  const baseData = getBaseData(urlData);

  const buildUrl = (reactLocation) => {
    const allParts = reactLocation.pathname.split("/");
    const parts = allParts.slice(0, allParts.length - 1);

    const linkUrlPathName = [
      (x) => x.pathname.replace(parts[1], "survey"),
      (x) => x.split("/"),
      (x) => x.slice(0, x.length - 1),
      (x) => x.join("/"),
    ].reduce(functionReducer, reactLocation);

    const regex = new RegExp(`/${parts[1]}.*`);
    const location = window.location;
    const newPath = location.pathname.replace(regex, linkUrlPathName);

    return `${location.protocol}//${location.host}${newPath}`;
  };

  const surveyInstanceUrl = buildUrl(useLocation());

  const copyUrl = (url) => navigator.clipboard.writeText(url);

  const updateGroupId = (urlGroupId) => {
    if (!urlGroupId) {
      const update = updateDataObject(
        getData(),
        "groupId",
        createInstanceId(5)
      );

      updateState(update);
    }
  };

  const updateNumberOfParticipants = (e) => {
    const numberOfParticipants = e.target.value;

    const update = updateDataObject(
      getData(),
      "numberOfParticipants",
      numberOfParticipants
    );
    updateState(update);
  };

  const numberOfParticipants = getValue("numberOfParticipants") || 1;

  const generateEvent = () => {
    const urls = createUrlsForDistribution(
      instrument,
      numberOfParticipants,
      surveyInstanceUrl,
      baseData
    );
    updateParticipantUrls(urls);
  };

  const makeUrlDistributionUIWithCopy = (url) =>
    makeUrlDistributionUI(url, copyUrl);

  return (
    <div className="distribute-questions-list-container">
      <h1>Distribute Questions Among Group</h1>
      <div>
        {makeHeader(instrument, false, updateState, urlData, getValue, true)}
      </div>
      <div>
        <h2>
          Number of Participants <br />
          (Cannot be changed once assessment starts)
        </h2>

        <input
          type="number"
          className="question-distributer"
          max="100"
          min="1"
          value={numberOfParticipants}
          onChange={updateNumberOfParticipants}
        ></input>
        <input
          type="button"
          value="Generate"
          className="question-distributer"
          onClick={generateEvent}
        />
      </div>

      <div>
        <h3>Urls for Distribution</h3>
        <div>{participantUrls.map(makeUrlDistributionUIWithCopy)}</div>
      </div>
    </div>
  );
}
