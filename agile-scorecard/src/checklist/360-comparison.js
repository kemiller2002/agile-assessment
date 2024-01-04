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
import { Scatter, Bubble } from "react-chartjs-2";

import { getInstrument, getInstrumentListing } from "../utilities/surveyData";

import { decompress } from "../utilities/compression";

import { updateDataObject } from "./instrument";
import { functionReducer } from "../utilities/reducer";

import { updateStateDetermineNavigate } from "./instrument";

import "./css/main.css";

import Select from "react-select";

import { createRandomColor } from "../utilities/identifiers";

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
  //console.log(data);
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
  const color = createRandomColor(item.instanceId);

  console.log(color);
  return {
    label: item.instanceId,
    data: instrumentKeys.map((y, x) => ({ y: item.data[y], x })),
    borderColor: "#beccc2", //createRandomColor(item.instanceId),
    //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
  };
}

function formatDataForGraph(data, keys) {
  const scatterFormat = formatDataForScatterGraph(data, keys);
  return [
    (d) => d.data,
    (d) => {}, //HERE! create pivot to bobble
    //https://www.chartjs.org/docs/latest/charts/bubble.html
  ].reduce(functionReducer, scatterFormat);
}

function formatDataForScatterGraph(data, keys) {
  const createDatabaseEntryWithKeys = (x) => createDatasetEntry(x, keys);

  return [
    (k) => k.filter((x) => x.match(/data-.*/)),
    (k) => k.map((x) => data[x]),
    (x) => x.map(createDatabaseEntryWithKeys),
  ].reduce(functionReducer, Object.keys(data));
}

function getInstrumentKeys(instrument) {
  return [
    (x) => x.items,
    (x) => x.map((y) => y.entries),
    (x) => x.flat(),
    (x) => x.map((y) => y.id),
  ].reduce(functionReducer, instrument);
}

function createDatasets(data, instrumentKeys) {
  return {
    labels: [], //labels,
    datasets: formatDataForGraph(data, instrumentKeys),
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

function createSection(item, instrumentKeyPositions) {
  const createQuestionEntry = (entry, instrumentKeyPositions) => {
    return (
      <div key={entry.descriptor}>
        {instrumentKeyPositions[entry.id]}. {entry.descriptor}
      </div>
    );
  };
  return (
    <div key={item.section}>
      <h4>{item.section}</h4>
      {item.entries.map((x) => createQuestionEntry(x, instrumentKeyPositions))}
    </div>
  );
}

export function ThreeSixtyComparison({ http, instrumentListUrl }) {
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const urlData =
    [convertAndParse].reduce(functionReducer, parameters.data) || {};

  const defaultInstrument = { items: [] };
  const [instruments, updateInstruments] = useState([]);
  const [instrument, updateInstrument] = useState({ items: [] });
  const [instrumentKeys, updateInstrumentKeys] = useState([]);
  const [inputProvidedDataUrl, updateInputProvidedDataUrl] = useState("");

  //creates a lookup to see where the item is in the list of questions for reference.
  const instrumentKeyPositions = instrumentKeys.reduce(
    (s, i, p) => ({ ...s, [i]: p + 1 }),
    {}
  );
  const chartOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: instrumentKeys.length + 1,
      },

      y: {
        min: 0,
        max: 5,
      },
    },
    ticks: {
      // forces step size to be 1 unit
      stepSize: 1,
    },
  };

  const updateComparisonName = (e) =>
    updateInput(updateState, urlData, "comparisonName", e.target.value);

  //test here after loading instruments.
  const saveSelectedInstrument = ({ value }) =>
    updateInput(updateState, urlData, "instrumentFile", value);

  useEffect(() => {
    loadInstruments(http, instrumentListUrl, updateInstruments);
  }, []);

  useEffect(() => {
    if (urlData.instrumentFile) {
      getInstrument(http, urlData.instrumentFile).then((x) => {
        updateInstrument(x);
      });
    }
  }, []);

  useEffect(() => {
    [getInstrumentKeys, updateInstrumentKeys].reduce(
      functionReducer,
      instrument
    );
  }, [instrument]);

  const updateInputWithStoredValues = (key, value) =>
    updateInput(updateState, urlData, key, value);

  const graphData = createDatasets(urlData, instrumentKeys);

  return (
    <div data-360-container>
      <div data-flyout>
        <input type="checkbox" id="enactFlyout"></input>
        <div data-window>
          <div data-legend>
            <div data-add>
              <div data-input-entry>
                <Select
                  placeholder="Instrument"
                  onChange={saveSelectedInstrument}
                  defaultValue={urlData.instrumentFile}
                  options={instruments.map((x) => ({
                    value: x.file,
                    label: x.name,
                  }))}
                ></Select>
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
                  onChange={(e) => updateInputProvidedDataUrl(e.target.value)}
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
        <div data-360-scatter>
          <Scatter options={chartOptions} data={graphData} />

          <div>
            <h3>Instrument Questions</h3>
            {instrument.items.map((x) =>
              createSection(x, instrumentKeyPositions)
            )}
          </div>
        </div>
        <div data-pad-right></div>
      </div>
    </div>
  );
}