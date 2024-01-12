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

import { scoreFormat } from "../utilities/surveyData";

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
  [extractData, decompress, parse, formatData, saveDataBound].reduce(
    functionReducer,
    data
  );
}

function createMetricLegendDisplay(data) {}

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

  return {
    label: item.instanceId,
    data: instrumentKeys.map((y, x) => ({ y: item.data[y], x })),
    borderColor: "#beccc2", //createRandomColor(item.instanceId),
    //backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
  };
}

function updateStructureWithAggregate(state, item) {
  //{3: 1, 4: 1} -- output, value 3 - one tally, value 4 - one tally
  const stateOrDefault = state || {};
  return { ...stateOrDefault, [item]: (stateOrDefault[item] || 0) + 1 };
}

function aggregateEntries(xAndYData) {
  const reducer = (s, i) => {
    return {
      ...s,
      [i.x]: updateStructureWithAggregate(s[i.x], [i.y]),
    };
  };

  return xAndYData.reduce(reducer, {});
}

function expandIntoObjects(bubbleItem) {
  return [
    (k) => k.filter((x) => x.match(scoreFormat)),
    (key) => key.map((k) => ({ x: bubbleItem.x + 1, y: k })),
    (i) =>
      i.map((x) => ({
        ...x,
        r: bubbleItem[x.y] * 3,
        selectionCount: bubbleItem[x.y],
      })),
  ].reduce(functionReducer, Object.keys(bubbleItem));
}

function createBubbleDataset(data) {
  return [
    (k) => k.map((x) => ({ x: parseInt(x), ...data[x] })),
    (x) => x.map(expandIntoObjects),
    (x) => x.flat(),
  ].reduce(functionReducer, Object.keys(data));
}

function formatDataForGraph(data, keys) {
  const scatterFormat = formatDataForScatterGraph(data, keys);

  return [
    (x) => x.map((d) => d.data),
    (x) => x.flat(),
    aggregateEntries, //HERE! create pivot to bobble
    createBubbleDataset,
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
  const dataset = formatDataForGraph(data, instrumentKeys);
  return {
    datasets: [
      {
        label: "Results", //labels,
        data: dataset,
        backgroundColor: "rgb(255, 99, 132)",
      },
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

function write(x) {
  console.log(x);
  return x;
}
function expandDataPoints(dataset) {
  return [
    (x) => x.map((x) => Array(x.selectionCount).fill(x.y)),
    (x) => x.flat(),
    (x) => x.map((y) => parseInt(y)),
  ].reduce(functionReducer, dataset);
}

function calculateMedian(dataPoints) {
  if (!dataPoints || dataPoints.length == 0) {
    return 0;
  }

  const numberOfPoints = dataPoints.length;
  const hasMiddleNumber = numberOfPoints % 2 === 1;
  const middleNumber = dataPoints.length / 2;

  return hasMiddleNumber
    ? dataPoints[Math.ceil(middleNumber)]
    : (dataPoints[middleNumber] + dataPoints[middleNumber + 1]) / 2;
}

function createSection(
  item,
  instrumentKeyPositions,
  answerKeys,
  groupedDataPoints
) {
  const createQuestionEntry = (
    entry,
    instrumentKeyPositions,
    answerKeys,
    dataPoints
  ) => {
    const questionNumber = instrumentKeyPositions[entry.id];
    const entryDataPoints = dataPoints[questionNumber] || [];
    const expandedDataPoints = expandDataPoints(entryDataPoints);
    const statistics = calculateStatistics(expandedDataPoints);

    return (
      <div>
        <label className="data-descriptor" key={entry.descriptor}>
          <div className="questionDetails">
            {questionNumber}. {entry.descriptor}
          </div>
          <input data-toggle className="dt" type="checkbox"></input>

          <span className="dt">details</span>

          <div data-question-details>
            <div className="questionType">
              <span className="questionType">Question Type:</span>
              <span>{answerKeys[entry.options]["meta-name"]}</span>
            </div>
            <div key={`div-statistics-${entry.id}`} className="statistics">
              <div>
                <span>Mean:</span>
                <span>
                  {Math.round((statistics.mean + Number.EPSILON) * 100) / 100}
                </span>
              </div>
              <div>
                <span>Median:</span>
                <span>{statistics.median}</span>
              </div>
              <div>
                <span>Mode:</span>
                <span>{statistics.mode}</span>
              </div>
            </div>
          </div>
        </label>
      </div>
    );
  };
  return (
    <div key={item.section}>
      <h4 className="sectionName">{item.section}</h4>
      {item.entries.map((x) =>
        createQuestionEntry(
          x,
          instrumentKeyPositions,
          answerKeys,
          groupedDataPoints
        )
      )}
    </div>
  );
}

function getAnswerKey(answerKey) {
  return [
    (x) => Object.keys(x),
    (x) => x.filter((y) => y.match(scoreFormat)),
    (x) => x.map((y) => parseInt(y)),
  ].reduce(functionReducer, answerKey);
}

function determineYRangeForChart(instrument) {
  return [
    (x) => x.map((y) => instrument.answerKeys[x]),
    (x) => x.map(getAnswerKey),
    (x) => x.flat(),
    (x) => x.sort((a, b) => a - b),
    (x) => ({ mix: x[0], max: x[x.length - 1] }),
  ].reduce(functionReducer, Object.keys(instrument.answerKeys));
}

function groupDataPoints(dataPoints) {
  return Object.groupBy(dataPoints, ({ x }) => x);
}

function calculateMode(dataPointArray) {
  return [
    (x) => Object.groupBy(x || [], (y) => y),
    (x) => Object.keys(x).map((k) => x[k]),
    (x) => x.sort((a, b) => b.length - a.length),
    (x) => ((x || []).length === 0 ? [0] : x),
    (x) => x[0][0],
  ].reduce(functionReducer, dataPointArray);
}

function calculateMean(dataset) {
  return (
    dataset.reduce((s, i) => (s += i), 0) / (dataset.length || 1)
    // || 1 -> stop divide by zero
  );
}

function calculateStatistics(dataset) {
  return [
    (x) => ({
      data: x,
      mode: calculateMode(x),
      mean: calculateMean(x),
      median: calculateMedian(x),
    }),
  ].reduce(functionReducer, dataset || []);
}

export function ThreeSixtyComparison({ http, instrumentListUrl }) {
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const urlData =
    [convertAndParse].reduce(functionReducer, parameters.data) || {};

  const defaultInstrument = { items: [] };
  const [instruments, updateInstruments] = useState([]);
  const [instrument, updateInstrument] = useState({
    items: [],
    answerKeys: {},
  });
  const [instrumentKeys, updateInstrumentKeys] = useState([]);
  const [inputProvidedDataUrl, updateInputProvidedDataUrl] = useState("");

  //creates a lookup to see where the item is in the list of questions for reference.
  const instrumentKeyPositions = instrumentKeys.reduce(
    (s, i, p) => ({ ...s, [i]: p + 1 }),
    {}
  );

  const yRange = determineYRangeForChart(instrument);

  const chartOptions = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        min: 0,
        max: instrumentKeys.length + 1,
      },

      y: {
        min: yRange.min,
        max: yRange.max + 1,
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
  const groupedDataPoints = groupDataPoints(
    (graphData.datasets || [{ data: [] }])[0].data
  );

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
          <Bubble data={graphData} options={chartOptions} />

          <div>
            <h3>Instrument Questions</h3>
            {instrument.items.map((x) =>
              createSection(
                x,
                instrumentKeyPositions,
                instrument.answerKeys,
                groupedDataPoints
              )
            )}
          </div>
        </div>
        <div data-pad-right></div>
      </div>
    </div>
  );
}
