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

import { getInstrument } from "../utilities/surveyData";

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

function createChecklist(encodedData, http) {
  const data = convertAndParse(encodedData);
  const getValue = (k) => data[k];
  const surveyName = getValue("surveyName");
  const assessmentDate = getValue("assessmentDate");
  const team = getValue("team");

  const calculateTotalScore = ({ score, maximum }, i) => {
    const findMaximum = (s, i) => (s > i.score ? s : i.score);

    return {
      score: (score += i.score),
      maximum: (maximum += i.entries.reduce(findMaximum)),
    };
  };

  return getInstrument(http, surveyName)
    .then((s) => calculateMetrics(s, getValue))
    .then((d) => d.items.reduce(calculateTotalScore, { score: 0, maximum: 0 }))
    .then((s) => Object.assign({}, s, { surveyName, assessmentDate, team }));
}

function separatePropertyName(name) {
  const [team, dateAsString] = name.split("~");
  return { team, dateAsString };
}

function createMetricLegendDisplay(data) {
  return Object.keys(data)
    .filter((x) => x !== "metadata")
    .map((key) => ({ key, data: data[key] }))
    .map(({ key, data }) => {
      const { team, dateAsString } = separatePropertyName(key);
      return { team, date: new Date(dateAsString), data };
    })
    .map(({ team, data, date }) => (
      <div key={`${team}${date}`}>
        {team} : {date.getMonth() + 1} - {date.getFullYear()}
      </div>
    ));
}

function createMonthArray(state, number, start) {
  const adjustMonth = new Date(start.getTime());
  const adjustedMonth = new Date(
    adjustMonth.setMonth(adjustMonth.getMonth() + number)
  );

  return number >= 0
    ? createMonthArray([adjustedMonth, ...state], --number, start)
    : state;
}

function createDateEntries(min, max, bracketLength) {
  let months = (max.getFullYear() - min.getFullYear()) * 12;
  months -= min.getMonth();
  months += max.getMonth();

  const minFirstOfMonth = new Date(min.setDate(1));

  const bracketMonths = months + bracketLength * 2;
  const bracketMinDate = new Date(
    minFirstOfMonth.setMonth(minFirstOfMonth.getMonth() - bracketLength)
  );

  const dates = createMonthArray([], bracketMonths, bracketMinDate);

  return dates;
}

function findBasedOnDate(searchObjects, date) {
  const foundEntries = searchObjects.filter(
    (x) =>
      x.date.getMonth() === date.getMonth() &&
      x.date.getFullYear() === date.getFullYear()
  );
  return foundEntries.length === 0 ? null : foundEntries[0];
}

function transformIntoChartsDataEntry(legendDates, dataObject, bracketLength) {
  const rawData = Object.keys(dataObject).map((x) =>
    Object.assign({}, dataObject[x], { date: new Date(x) })
  );

  const label = (rawData[0] || { team: "none" }).team;

  const data = legendDates
    .map((x) => findBasedOnDate(rawData, x))
    .map((x) => (x ? x.score : x))
    .reduce(
      ({ entries, previousValue }, i, currentIndex, reducedArray) => {
        const entry =
          reducedArray.length - (currentIndex + bracketLength) <= 0
            ? undefined
            : i || previousValue;

        return { entries: [...entries, entry], previousValue: entry };
      },
      { entries: [], previousValue: undefined }
    ).entries;

  return {
    label,
    data,
  };
}
const bracketLength = 2;

function saveMetric(metric) {
  const data = this.get();
  const updatedData = Object.assign({}, data, {
    [`${metric.team}~${metric.assessmentDate}`]: metric,
  });

  this.save(updatedData);
}

function updateComparisonName(event) {
  const name = event.target.value;
  const data = this.get();

  const updatedData = Object.assign({}, data, { metadata: { name } });
  this.save(updatedData);
  this.updateSystem(name);
}

function createDashboardDataset(data) {
  if (!data) {
    return {
      labels: [],
      datasets: [],
      data: [],
    };
  }
  const separatedData = Object.keys(data)
    .filter((x) => x !== "metadata")
    .reduce((s, key) => {
      const value = data[key];
      const { team, dateAsString } = separatePropertyName(key);
      const date = new Date(dateAsString);
      const entryName = `${team}~${value.surveyName}`;
      const entries = s[entryName] || {};
      const minDate = s.minDate < date ? s.minDate : date;
      const maxDate = s.maxDate > date ? s.maxDate : date;

      const teamData = Object.assign(entries, { [date]: value });

      return Object.assign(
        {},
        s,
        { minDate, maxDate },
        { [entryName]: teamData }
      );
    }, {});

  const dateEntries =
    separatedData.minDate && separatedData.maxDate
      ? createDateEntries(
          separatedData.minDate,
          separatedData.maxDate,
          bracketLength
        )
      : [];

  const datasets = Object.keys(separatedData)
    .filter((x) => x !== "minDate" && x !== "maxDate")
    .map((x) => separatedData[x])
    .map((x) => transformIntoChartsDataEntry(dateEntries, x, bracketLength));

  return {
    labels: dateEntries.map((d) => `${d.getMonth() + 1} - ${d.getFullYear()}`),
    datasets,
    data,
  };
}

export function ComparativeScore(props) {
  const parameters = useParams();
  const [url, updateUrl] = useState("");
  const encodedParameterData = parameters.data;
  const decodedData = encodedParameterData
    ? convertAndParse(encodedParameterData)
    : undefined;

  const get = () => decodedData;

  const [graphTitle, updateTitle] = useState(
    ((decodedData || {}).metadata || { name: undefined }).name ||
      "Assessment Chart"
  );

  const navigate = useNavigate();

  const updateState = (newKeyValue) => {
    navigate(convertForUrl(newKeyValue), { replace: false });
  };

  const saveMetricBound = saveMetric.bind({
    get,
    save: updateState,
  });

  const addMetric = () => {
    const data = url.split("/").reverse()[0].split("?")[0];
    const checklistCreation = createChecklist(data, props.http);

    checklistCreation.then((x) => saveMetricBound(x)).then(() => updateUrl(""));
  };

  const updateUrlData = (e) => updateUrl(e.target.value);
  const metricsData = createDashboardDataset(decodedData); //hERE

  if (!metricsData) {
    return <div>loading</div>;
  }

  const graphData = {
    labels: metricsData.labels,
    datasets: metricsData.datasets,
  };

  const boundUpdateComparisonName = updateComparisonName.bind({
    updateSystem: updateTitle,
    save: updateState,
    get,
  });

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
        labels: {
          font: { size: 24 },
        },
      },
      title: {
        display: true,
        text: graphTitle,
        font: { size: 32 },
      },
      tooltip: {
        titleFont: {
          size: 16,
        },
        bodyFont: {
          size: 16,
        },
      },
    },
    scales: {
      y: {
        max: 100,
        min: 0,
        ticks: {
          stepSize: 5,
        },
      },
    },
  };

  return (
    <div>
      <div data-flyout>
        <input type="checkbox" id="enactFlyout"></input>
        <div data-window>
          <div data-legend>
            <div data-add>
              <span>Comparison Name:</span>
              <div data-input-entry>
                <input
                  type="text"
                  placeholder="Comparison Name"
                  className="comparison-name"
                  onChange={boundUpdateComparisonName}
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
                  onChange={updateUrlData}
                  value={url}
                  data-input-url
                  placeholder="Paste survey URL"
                ></textarea>
                <input
                  type="button"
                  value="Add Url Data"
                  onClick={addMetric}
                ></input>
              </div>
            </div>
          </div>
          <div data-graph>{createMetricLegendDisplay(metricsData.data)}</div>
        </div>
        <label className="flyout-indicator" htmlFor="enactFlyout">
          <div className="pad-top"></div>
          <div>
            <FontAwesomeIcon icon={faChevronLeft} />
          </div>
          <div className="pad-bottom"></div>
        </label>
      </div>
      <div data-dashboard-container>
        <div data-pad-left></div>
        <div data-container>
          <Line options={chartOptions} data={graphData} />
        </div>
        <div data-pad-right></div>
      </div>
    </div>
  );
}
