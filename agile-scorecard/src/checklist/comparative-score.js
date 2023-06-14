import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { convertAndParse, calculateMetrics, convertForUrl } from "./checklist";
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

import { getChecklist } from "../utilities/surveyData";

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

  return getChecklist(http, surveyName)
    .then((s) => calculateMetrics(s, getValue))
    .then((d) => d.items.reduce(calculateTotalScore, { score: 0, maximum: 0 }))
    .then((s) => Object.assign({}, s, { surveyName, assessmentDate, team }));
}

const testurldata = `raph/agile-assessment-v1.json/eyIxOTM3MjA4NiI6ImluLXByb2dyZXNzIiwiMjEyMTY2MTAiOiJ5ZXMiLCIyMjQwNjQxMiI6InllcyIsIjM0OTUxMjc2IjoieWVzIiwiNDE1ODU4MzAiOiJ5ZXMiLCI4MDAyMzA4OSI6InllcyIsIjExMTUwMTMzOCI6InllcyIsIjExNDM5NDM5NSI6InllcyIsIjEyMTYxMDI3MiI6InllcyIsIjEyNzM3ODEyMyI6InllcyIsIjEzNDQwNzc1NCI6InllcyIsIjIwMjAyMjY3NSI6InllcyIsIjIwNTY3NDI3NSI6InllcyIsIjIwODA4MjE4MiI6InllcyIsIjI0NDQ0Mzg1MSI6InllcyIsIjI0NzY1NTI5MyI6ImluLXByb2dyZXNzIiwiMjc3MjU5MTUyIjoieWVzIiwiMzg4OTE3NzM2IjoieWVzIiwiNDA3MDg5ODkzIjoieWVzIiwiNDEyNzc4ODk2IjoieWVzIiwiNDI3NTMyNjg4IjoieWVzIiwiNDUzMzEyNjIyIjoieWVzIiwiNDUzNTAyNjM5IjoieWVzIiwiNTAzMDY4MjcwIjoieWVzIiwiNTEyOTg4ODYxIjoieWVzIiwiNTEzOTk1NzM4IjoieWVzIiwiNTE2NTA2NTc3IjoieWVzIiwiNTI5MzQyOTYxIjoieWVzIiwiNjA0NzM3NTk4IjoieWVzIiwiNjA4NzAzNTEwIjoieWVzIiwiNjE1MzcyNjg1IjoieWVzIiwiNjM0NTk2MTIwIjoieWVzIiwiNjM5MTgzMTg5IjoieWVzIiwiNjczOTYxOTU4IjoiaW4tcHJvZ3Jlc3MiLCI2NzgwOTIxOTUiOiJ5ZXMiLCI2ODA2NzA2NzQiOiJ5ZXMiLCI3MjM1Nzg5NjIiOiJ5ZXMiLCI3NjkzNTg2MDYiOiJ5ZXMiLCI3ODA0NTc2MTYiOiJpbi1wcm9ncmVzcyIsIjc4NDgzMTA1MSI6InllcyIsIjc4Nzc2NTMyOCI6ImluLXByb2dyZXNzIiwiNzk0NzA5ODgxIjoieWVzIiwiNzk2ODgyNjE2IjoieWVzIiwiODM2NzM0MzQ3IjoieWVzIiwiODY5OTY3ODg5IjoieWVzIiwiODg5NDUzOTQ5IjoieWVzIiwiODk4OTYwMzE0IjoieWVzIiwiOTA3MjI0NTI0IjoieWVzIiwiOTEwNDk2MDkxIjoiaW4tcHJvZ3Jlc3MiLCI5MTA5NDY4OTEiOiJpbi1wcm9ncmVzcyIsIjk0MTU0MTcyNyI6InllcyIsIjk1MjMzNTY4NCI6InllcyIsIjk1NTQ2MzY0MyI6InllcyIsIjk2NTcyNzIwNCI6InllcyIsIjk3ODA2NTUxOCI6InllcyIsIjk4NjUwMjgzMyI6InllcyIsIjk5MTE0OTI2MiI6ImluLXByb2dyZXNzIiwiMTAxNzc3OTMzMSI6InllcyIsIjEwNDk3NzQzMTMiOiJ5ZXMiLCIxMDUxODQwNDYwIjoieWVzIiwiMTA1MzIxMjA1MiI6InllcyIsIjEwNTUyNjcxMTAiOiJ5ZXMiLCIxMDY3MTQzMjkzIjoieWVzIiwiMTA2OTgyMDQyNCI6InllcyIsIjEwNzQ3NTA5NDUiOiJ5ZXMiLCIxMDg5NjE2ODkxIjoieWVzIiwiMTEwMjM3NTM1MyI6InllcyIsIjExMTAwNzA5MzgiOiJ5ZXMiLCIxMTExMzM3MzIyIjoieWVzIiwiMTEyOTMxODkzNCI6InllcyIsIjExNTk3NzEyMTUiOiJ5ZXMiLCIxMTczNzI4NDQ4IjoieWVzIiwiMTE5MDA4NTk5OCI6InllcyIsIjExOTY5MDk4NzYiOiJ5ZXMiLCIxMTk4MzUyMTY1IjoiaW4tcHJvZ3Jlc3MiLCIxMjA4MTY3OTgyIjoieWVzIiwiMTI2NDM3NjE0NiI6InllcyIsIjEzMTk1MjIzMDYiOiJpbi1wcm9ncmVzcyIsIjEzNjIwMjEyODciOiJ5ZXMiLCIxMzkzMjg4NjExIjoieWVzIiwiMTQwMDcwMTE3OCI6InllcyIsIjE0MjA3ODY3NjkiOiJ5ZXMiLCIxNDUyNzM3NTQwIjoieWVzIiwiMTU2NjkzMjM4NiI6InllcyIsIjE1ODQ1MTcyODQiOiJ5ZXMiLCIxNjM5NTA5NjMyIjoieWVzIiwiMTY0MTU3ODg0NSI6InllcyIsIjE2NjEyOTQwMzgiOiJpbi1wcm9ncmVzcyIsIjE2ODY3MjA5NzgiOiJ5ZXMiLCIxNjk0MjMxMzc5IjoieWVzIiwiMTcwMzAyMTA4OSI6InllcyIsIjE3MDcwNjc0NzEiOiJ5ZXMiLCIxNzEyMDE2NjQyIjoieWVzIiwiMTcyMjY4NzA2NyI6InllcyIsIjE3MjQ0OTY0MzYiOiJ5ZXMiLCIxNzI1MzE1NDU5IjoieWVzIiwiMTc0MTcwNDE2OCI6InllcyIsIjE3NDcwMzY0NzEiOiJ5ZXMiLCIxNzUwNDU3MzkxIjoieWVzIiwiMTc2ODc2OTk3MCI6InllcyIsIjE3ODUxNDc4MTIiOiJ5ZXMiLCIxNzg4MTM3NTg1IjoieWVzIiwiMTgwNjM4OTc5MiI6InllcyIsIjE4NjIzODM3MzEiOiJ5ZXMiLCIxODk1Mzc1MDM4IjoieWVzIiwiMTkwMjgzMzAwMCI6InllcyIsIjE5MzY3NDAwOTgiOiJ5ZXMiLCIyMDAzMDA0MTE0IjoieWVzIiwiMjAwNDM1NDAzNSI6InllcyIsIjIwMDU0ODY0MTYiOiJ5ZXMiLCIyMDMyNTMzMzY3IjoieWVzIiwiMjA0MjM0MjIxNyI6InllcyIsIjIwODc3OTk5NTMiOiJ5ZXMiLCIyMDkxMjc2MTIyIjoieWVzIiwiMjA5MTgzMzQ4MSI6InllcyIsIjIwOTg2MDk1MjYiOiJ5ZXMiLCIyMTEwMzc0NjA1IjoieWVzIiwiMjExNTE4ODg1MCI6InllcyIsIjIxMzg2ODY4MTMiOiJ5ZXMiLCIyMTQxOTY4Nzg5IjoieWVzIiwic3VydmV5TmFtZSI6ImFnaWxlLWFzc2Vzc21lbnQtdjEuanNvbiIsInRlYW0iOiJkZngiLCJhc3Nlc3NtZW50RGF0ZSI6IjIwMjMtMDMtMDEiLCItMTQ0NTg3NTQyOSI6InllcyIsIi03NDQ3NDUyMDQiOiJ5ZXMiLCItNzE3MTg2MzUiOiJ5ZXMiLCItMTkyODI2NzAyNiI6InllcyIsIi0xMjQ3NjkwOTQ4IjoieWVzIiwiLTg4OTY5NjA5MCI6InllcyIsIi0yNzc1MTI1ODMiOiJ5ZXMiLCItMTgzNjYwMzgwOSI6InllcyIsIi0xNDkwODU1NDQwIjoieWVzIiwiLTE3NzM3NzM1MzUiOiJ5ZXMiLCItMTU5MjcxNjYzMCI6InllcyIsIi0yMzQ3MTY5OTkiOiJ5ZXMiLCItMTY5NjYyMjc4MSI6InllcyIsIi05NzExMzMzODYiOiJ5ZXMiLCItMjQ3MDk1MzM4IjoieWVzIiwiLTE3NzM1MDUyMjgiOiJ5ZXMiLCItMTI2NDA4NTAxMiI6InllcyIsIi0xNjYyNzUxOTYzIjoieWVzIiwiLTE5Nzk4NjQyMTciOiJ5ZXMiLCItMjcwNzQ2MjA5IjoieWVzIiwiLTIwMDc3OTkxNjEiOiJ5ZXMiLCItMTU0ODg4OTY5IjoieWVzIiwiLTIxMjUzOTM4MzAiOiJ5ZXMiLCItMTk0MDU1ODk1OCI6InllcyIsIi0yMDkyNjYxNTk4IjoieWVzIiwiLTEzMDk5NTQ0OSI6InllcyIsIi0xOTg2MTExMzA3IjoieWVzIiwiLTEzODY4NDI4IjoieWVzIiwiLTcyMzMxODY2NiI6InllcyIsIi0xNTI0OTU1MDg4IjoieWVzIiwiLTIxNjM4Mzg1MSI6InllcyIsIi0yMTMzNTQ2MDUwIjoieWVzIiwiLTE3MzQ3MTU4NiI6InllcyIsIi0xMDYyOTQ2MTQ1IjoieWVzIiwiLTE4MDQwMDUwNzYiOiJ5ZXMiLCItNjI5OTk1NDczIjoieWVzIiwiLTcxODg5NzIzMCI6ImluLXByb2dyZXNzIiwiLTE1Mzc1MDc0OTYiOiJ5ZXMiLCItMjEzOTQ5MTc0MCI6InllcyIsIi0xMTk1ODYwMzAiOiJ5ZXMiLCItNjkxNTYyODQwIjoieWVzIiwiLTE1NzY5NDQ5MDUiOiJ5ZXMiLCItMTcyMTE2ODkzNCI6InllcyIsIi0zODQ4NjEzOCI6InllcyIsIi0zNzcyMjQwNTMiOiJ5ZXMiLCItODMzNDgwMTYzIjoieWVzIiwiLTE4MzM0NzcyMzQiOiJ5ZXMiLCItMjQxNjkwMDMwIjoieWVzIiwiLTExMDcwMjkzMiI6InllcyIsIi0xMzg5NzAyMDU0IjoieWVzIiwiLTI4MjIxMDUxMiI6InllcyIsIi0xMTgwMDEzMTk1IjoieWVzIiwiLTE0OTkxOTQ5MjgiOiJpbi1wcm9ncmVzcyIsIi05NjMxMTQ2MjciOiJ5ZXMiLCItMTk1Mjc0NDg2NyI6InllcyIsIi0xMDUxODcwOTciOiJ5ZXMiLCItNzI5MzU4NzIzIjoieWVzIiwiLTk3NjA0MzYyMCI6InllcyIsIi0xNzk2Nzk3NzcxIjoieWVzIiwiLTI4ODEwMjI4NCI6InllcyIsIi04NjkyMjY5NDQiOiJ5ZXMiLCItMTg2OTIwMzI2MCI6InllcyIsIi0xODEzNDYwMTIiOiJ5ZXMiLCItMjExMTQzODQxOSI6InllcyIsIi0xNTA1MjM2OTY5IjoieWVzIiwiLTg0Mzc1MjEiOiJ5ZXMiLCItMTc0MDcwNTk3IjoieWVzIiwiLTQ3NDE0MTM1IjoieWVzIiwiLTI0ODAxNDgzOSI6InllcyIsIi0xMzE2NzUzNiI6InllcyIsIi0xNjk2NDc2MjIzIjoieWVzIiwiLTIxMjAxMzU0NjIiOiJpbi1wcm9ncmVzcyIsIi0xNjMzMTU1OTc2IjoieWVzIiwiLTQ4NjU2OTU4NCI6InllcyIsIi0xNDU1OTI0MDEwIjoieWVzIiwiLTg0MTI3NDQwMSI6InllcyIsIi02ODAwMTQ3MTQiOiJ5ZXMiLCItNDk0MjU2NDgwIjoieWVzIiwiLTE5NTI1MzI1NyI6InllcyIsIi0yMTIzMjk0NTU2IjoiaW4tcHJvZ3Jlc3MiLCItMTgyOTM1NjM2MyI6InllcyIsIi0yNTI0ODU0NzUiOiJ5ZXMiLCItOTU5MzE3NzQ1IjoieWVzIiwiLTIwMDM0NzYyIjoiaW4tcHJvZ3Jlc3MiLCItODQ0MTQ1NDUxIjoieWVzIiwiLTIxMDUzMjYzNzYiOiJ5ZXMiLCItMjY0NzMzNjcwIjoieWVzIiwiLTc4MzU2MTA5IjoieWVzIiwiLTExOTY5ODU5NzciOiJ5ZXMiLCItODAzNDE4NjQ4IjoieWVzIiwiLTU3NjI3MTI2NiI6InllcyIsIi0xNDU2NDEwMTk1IjoiaW4tcHJvZ3Jlc3MiLCItMTkyOTgxMjkyMSI6InllcyIsIi0xNzA2MTIzODk0IjoiaW4tcHJvZ3Jlc3MiLCItMTc3NDgyOTcwMSI6InllcyIsIi01NDU3NTA1NzMiOiJ5ZXMiLCItNzAzMjgyODEyIjoiaW4tcHJvZ3Jlc3MiLCItODYzNzY2MzkxIjoieWVzIiwiLTExNTUyNTIwMTYiOiJ5ZXMiLCItNTA1MjQ2MDMyIjoieWVzIiwiLTEyODM4NDYwMDEiOiJ5ZXMiLCItNDA1NTk5Mjc2IjoieWVzIiwiLTEzMjQzNTgxODUiOiJ5ZXMiLCItNjM2NzM2Mzg5IjoieWVzIiwiLTM1Mzc2MDc5IjoieWVzIiwiLTE3MzYxMDQyNTgiOiJ5ZXMiLCItMTczMDk2MDQ2MCI6InllcyIsIi0xOTgzMjEyMjEiOiJ5ZXMiLCItMjA2MDk5NTc5IjoieWVzIiwiLTEzNDQ4NjU0MTMiOiJpbi1wcm9ncmVzcyIsIi0xMDk1OTIxNDIiOiJ5ZXMiLCItMTI5NjA2OTgxIjoieWVzIiwiLTE0MzE1NDU1ODMiOiJpbi1wcm9ncmVzcyIsIi0yMTA5Mjg3NjQ5IjoieWVzIiwiLTU2ODkyMjk4IjoieWVzIiwiLTE0MjczMjY2NDkiOiJ5ZXMiLCItNjQ2ODc5ODY2IjoiaW4tcHJvZ3Jlc3MiLCItMTY4MDEwOTUyOSI6InllcyIsIi0xMDQ0NTgwNTcwIjoieWVzIiwiLTEwMzA1NzYxNTMiOiJ5ZXMiLCItNDY5NTEwNzEzIjoieWVzIiwiLTEyMjQ5OTY4ODciOiJpbi1wcm9ncmVzcyIsIi02MDc4NjgxNzIiOiJ5ZXMifQ==`;

function separatePropertyName(name) {
  const [team, dateAsString] = name.split("~");
  return { team, dateAsString };
}

function createMetricLegendDisplay(data) {
  return Object.keys(data)
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

function createDateEntries(min, max) {
  let months = (max.getFullYear() - min.getFullYear()) * 12;
  months -= min.getMonth();
  months += max.getMonth();

  const bracketNumber = 2;

  const minFirstOfMonth = new Date(min.setDate(1));

  const bracketMonths = months + bracketNumber * 2;
  const bracketMinDate = new Date(
    minFirstOfMonth.setMonth(minFirstOfMonth.getMonth() - bracketNumber)
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

function transformIntoChartsDataEntry(legendDates, dataObject) {
  const rawData = Object.keys(dataObject).map((x) =>
    Object.assign({}, dataObject[x], { date: new Date(x) })
  );

  const label = (rawData[0] || { team: "none" }).team;

  const data = legendDates
    .map((x) => findBasedOnDate(rawData, x))
    .map((x) => (x ? x.score : x))
    .reduce(
      ({ entries, previousValue }, i) => {
        const entry = i || previousValue;

        return { entries: [...entries, entry], previousValue: entry };
      },
      { entries: [], previousValue: undefined }
    ).entries;

  return {
    label,
    data,
  };
}

function createDashboardDataset(data) {
  const separatedData = Object.keys(data).reduce((s, key) => {
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

  const dateEntries = createDateEntries(
    separatedData.minDate,
    separatedData.maxDate
  );

  const datasets = Object.keys(separatedData)
    .filter((x) => x !== "minDate" && x !== "maxDate")
    .map((x) => separatedData[x])
    .map((x) => transformIntoChartsDataEntry(dateEntries, x));

  return {
    labels: dateEntries.map((d) => `${d.getMonth() + 1} - ${d.getFullYear()}`),
    datasets,
    data,
  };
}

function saveMetric(metric) {
  const data = this.get();
  const updatedData = Object.assign({}, data, {
    [`${metric.team}~${metric.assessmentDate}`]: metric,
  });

  this.save(updatedData);
}

export function ComparativeScore(props) {
  const parameters = useParams();
  const [url, updateUrl] = useState("");
  const navigate = useNavigate();
  const encodedParameterData = parameters.data;
  const decodedData = encodedParameterData
    ? convertAndParse(encodedParameterData)
    : [];
  const updateState = (newKeyValue) => {
    navigate(convertForUrl(newKeyValue), { replace: false });
  };

  const saveMetricBound = saveMetric.bind({
    get: () => decodedData,
    save: updateState,
  });

  const addMetric = () => {
    const data = url.split("/").reverse()[0].split("?")[0];
    const checklistCreation = createChecklist(data, props.http);

    checklistCreation.then((x) => saveMetricBound(x)).then(() => updateUrl(""));
  };

  const updateUrlData = (e) => updateUrl(e.target.value);
  const metricsData = createDashboardDataset(decodedData);
  const graphData = {
    labels: metricsData.labels,
    datasets: metricsData.datasets,
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Assessment Chart",
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
