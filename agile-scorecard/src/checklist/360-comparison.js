import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { convertAndParse, calculateMetrics, convertForUrl } from "./instrument";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { getInstrument, getInstrumentListing } from "../utilities/surveyData";

import { decompress } from "../utilities/compression";

import { updateDataObject } from "./instrument";
import { functionReducer } from "../utilities/reducer";

import { updateStateDetermineNavigate } from "./instrument";

import "./css/main.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const dataKeyRegex = /\d+:\d+/;

function log(data) {
  console.log(data);
  return data;
}
function extractData(url) {
  return url.split("/").pop();
}

function combineProperties(objectArray) {
  return objectArray.reduce((s, i) => ({ ...s, ...i }), {});
}

function formatData(data) {
  return [
    (x) => x.filter((y) => y.match(dataKeyRegex)),
    (x) => x.map((y) => ({ [y]: data[y] })),
    combineProperties,
    (x) => ({ instanceId: data.instanceId, data: x }),
  ].reduce(functionReducer, Object.keys(data));
}

function parse(data) {
  return JSON.parse(data);
}

function saveData(data, saveDataAction) {
  const key = `data-${data.instanceId}`;
  saveDataAction(key, data);

  return data;
}

function addMetric(data, saveDataAction) {
  const saveDataBound = (data) => saveData(data, saveDataAction);
  [extractData, decompress, parse, log, formatData, saveDataBound].reduce(
    functionReducer,
    data
  );
}

function createMetricLegendDisplay(data) {
  //console.log("NOT DEFINED");
}

function createNumberFromPartsReducer(s, i, p) {
  return s + i * (1000 * p);
}

function sortDataKeys(a, b) {
  const convertToNumber = (key) =>
    [
      (i) => i.split(":"),
      (i) => i.map((x) => parseInt(x)),
      (i) => i.reverse(),
      (i) => i.reduce(createNumberFromPartsReducer),
    ].reduce(functionReducer, key);

  const aNumber = convertToNumber(a);
  const bNumber = convertToNumber(b);
  return aNumber - bNumber;
}
function createSortedDataArray(item, keys) {
  return [(k) => k.map((x) => item[k])].reduce(functionReducer, keys);
}

function createDatasetEntry(item, instrumentKeys) {
  return {
    label: item.instanceId,
    data: createSortedDataArray(item, instrumentKeys),
    //borderColor: Utils.CHART_COLORS.red,
    //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
  };
}

function formatDataForGraph(data, keys) {
  const createDatabaseEntryWithKeys = (x) => createDatasetEntry(data, keys);
  return [
    (k) => k.filter(/data-.*/),
    (k) => data[k],
    (x) => x.map(createDatabaseEntryWithKeys),
  ].reduce(functionReducer, Object.keys(data));
}

function createDatasets(data, instrument) {
  const instrumentKeys = Object.keys(data);
  return {
    labels: [], //labels,
    datasets: data.map((x) => formatDataForGraph(x, instrumentKeys)),
  };
}

function getAssessments({ get }, assessmentUrl) {
  return get(assessmentUrl).then((x) => x.data);
}

function updateInput(updateState, urlData, key, value) {
  const update = updateDataObject(urlData, key, value);
  updateState(update);
}

function loadInstruments(http, url, updateInstruments) {
  return getInstrumentListing(http, url).then((x) => updateInstruments(x));
}

function write(x) {
  console.log(x);
  return x;
}

export function ThreeSixtyComparison({ http, instrumentListUrl }) {
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const urlData =
    [convertAndParse, write].reduce(functionReducer, parameters.data) || {};

  const [instruments, updateInstruments] = useState([]);
  const instrument = {};
  const chartOptions = {};
  const graphData = {};

  const updateComparisonName = (e) =>
    updateInput(updateState, urlData, "comparisonName", e.target.value);

  //test here after loading instruments.
  const saveSelectedInstrument = (e) =>
    updateInput(updateState, urlData, "instrumentFile", e.target.value);

  //replace later.
  const inputProvidedDataUrl =
    "https://kemiller2002.github.io/agile-assessment/survey/scrum-master-360-v1.json/N4IgzgrgTgbgpgTwHIEMC2cQC5wGMoRoC0aKYALnFEQMwBsADETAIwB0AVmAPYB2IAGhCV02EABUEAGyoACALK4AInxRSAJoJBkwcMGAy9ySlJTEAmBuZpEW5ouZZaU6tAEtebilFPcoY9ykZKABrAAEoOE9eXDZcbjQtDwoUGLgASU0cDgApAGk4KSQAB24lAA8Wco4lc24ANRCIAEUtBiwGbHMhdqcsGiEWDuwAFkGsPrGQc2H+oRnJoRpZqeXFkBGVoU2+gY2sc2w9gFYJrqFTzqwpulmWIVvdoQB2LZBX9YAOWb3vyYBfIA";

  //
  useEffect(() => {
    loadInstruments(http, instrumentListUrl, updateInstruments);
  }, []);

  const updateInputWithStoredValues = (key, value) =>
    updateInput(updateState, urlData, key, value);

  return (
    <div>
      <div data-flyout>
        <input type="checkbox" id="enactFlyout"></input>
        <div data-window>
          <div data-legend>
            <div data-add>
              <div data-input-entry>
                <select
                  placeholder="Instrument"
                  onChange={saveSelectedInstrument}
                >
                  <option>Select Instrument</option>
                  {instruments.map((x) => (
                    <option
                      key={x.name}
                      value={x.file}
                      defaultValue={x.file === urlData.instrumentFile}
                    >
                      {x.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div data-add>
              <span>Comparison Name:</span>
              <div data-input-entry>
                <input
                  type="text"
                  placeholder="Comparison Name"
                  className="comparison-name"
                  onChange={updateComparisonName}
                  value={urlData.comparisonName}
                />
              </div>
            </div>
            <div data-add>
              <span>Add Data Point:</span>
              <div data-input-entry>
                <textarea
                  type="text"
                  key="url"
                  id="urlInput"
                  name="urlInput"
                  onChange={(x) => x}
                  value={inputProvidedDataUrl}
                  data-input-url
                  placeholder="Paste survey URL"
                ></textarea>
                <input
                  type="button"
                  value="Add Url Data"
                  onClick={() =>
                    addMetric(inputProvidedDataUrl, updateInputWithStoredValues)
                  }
                ></input>
              </div>
            </div>
          </div>
          <div data-graph>{createMetricLegendDisplay()}</div>
        </div>
        <label className="flyout-indicator" htmlFor="enactFlyout">
          <div className="pad-top"></div>
          <div>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="pad-bottom"></div>
        </label>
      </div>

      <h1>{urlData.comparisonName}</h1>
      <h2>{instrument.name}</h2>

      <div data-dashboard-container>
        <div data-pad-left></div>
        <div data-container>GRAPH GOES HERE</div>
        <div data-pad-right></div>
      </div>
    </div>
  );
}
