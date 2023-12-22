import React, { useState, useEffect } from "react";
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

function addMetric(data) {
  [decompress, (x) => console.log(x)].reduce(functionReducer, data);
}

function createMetricLegendDisplay(data) {
  //console.log("NOT DEFINED");
}

function createDatasets(data) {
  return {
    labels: [], //labels,
    datasets: [
      /*{
        label: "Dataset 1",
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.red,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
      },
      {
        label: "Dataset 2",
        data: Utils.numbers(NUMBER_CFG),
        borderColor: Utils.CHART_COLORS.blue,
        backgroundColor: Utils.transparentize(Utils.CHART_COLORS.blue, 0.5),
      },*/
    ],
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

export function ThreeSixtyComparison({ http, instrumentListUrl }) {
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const urlData =
    [convertAndParse].reduce(functionReducer, parameters.data) || {};

  const [instruments, updateInstruments] = useState([]);
  const instrument = {};
  const chartOptions = {};
  const graphData = {};

  const updateComparisonName = (e) =>
    updateInput(updateState, urlData, "comparisonName", e.target.value);

  //test here after loading instruments.
  const saveSelectedInstrument = (e) =>
    updateInput(updateState, urlData, "instrument", e.target.value);

  //replace later.
  const inputProvidedDataUrl = "";

  //
  useEffect(() => {
    loadInstruments(http, instrumentListUrl, updateInstruments);
  }, []);

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
                    <option key={x.name} value={x}>
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
                  onClick={() => addMetric(inputProvidedDataUrl)}
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
