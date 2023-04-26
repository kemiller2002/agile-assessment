import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Checklist,
  convertAndParse,
  getChecklist,
  calculateMetrics,
  calculateScoreData,
} from "./checklist";
import "./css/main.css";

function calculateMetric(data) {
  const metricCallback = (m) => console.log(m);

  new Checklist({ data, metricCallback });

  return null;
}

function createChecklist(encodedData, http) {
  const data = convertAndParse(encodedData);
  const getValue = (k) => data[k];
  const surveyName = getValue("surveyName");

  const calculateTotalScore = ({ score, maximum }, i) => {
    const findMaximum = (s, i) => (s > i.score ? s : i.score);

    return {
      score: (score += i.score),
      maximum: (maximum += i.entries.reduce(findMaximum)),
    };
  };

  getChecklist(http, surveyName)
    .then((s) => calculateMetrics(s, getValue))
    .then((d) => d.items.reduce(calculateTotalScore, { score: 0, maximum: 0 }))
    .then((s) => console.log(s));
}

const testurldata = `raph/agile-assessment-v1.json/eyIxOTM3MjA4NiI6ImluLXByb2dyZXNzIiwiMjEyMTY2MTAiOiJ5ZXMiLCIyMjQwNjQxMiI6InllcyIsIjM0OTUxMjc2IjoieWVzIiwiNDE1ODU4MzAiOiJ5ZXMiLCI4MDAyMzA4OSI6InllcyIsIjExMTUwMTMzOCI6InllcyIsIjExNDM5NDM5NSI6InllcyIsIjEyMTYxMDI3MiI6InllcyIsIjEyNzM3ODEyMyI6InllcyIsIjEzNDQwNzc1NCI6InllcyIsIjIwMjAyMjY3NSI6InllcyIsIjIwNTY3NDI3NSI6InllcyIsIjIwODA4MjE4MiI6InllcyIsIjI0NDQ0Mzg1MSI6InllcyIsIjI0NzY1NTI5MyI6ImluLXByb2dyZXNzIiwiMjc3MjU5MTUyIjoieWVzIiwiMzg4OTE3NzM2IjoieWVzIiwiNDA3MDg5ODkzIjoieWVzIiwiNDEyNzc4ODk2IjoieWVzIiwiNDI3NTMyNjg4IjoieWVzIiwiNDUzMzEyNjIyIjoieWVzIiwiNDUzNTAyNjM5IjoieWVzIiwiNTAzMDY4MjcwIjoieWVzIiwiNTEyOTg4ODYxIjoieWVzIiwiNTEzOTk1NzM4IjoieWVzIiwiNTE2NTA2NTc3IjoieWVzIiwiNTI5MzQyOTYxIjoieWVzIiwiNjA0NzM3NTk4IjoieWVzIiwiNjA4NzAzNTEwIjoieWVzIiwiNjE1MzcyNjg1IjoieWVzIiwiNjM0NTk2MTIwIjoieWVzIiwiNjM5MTgzMTg5IjoieWVzIiwiNjczOTYxOTU4IjoiaW4tcHJvZ3Jlc3MiLCI2NzgwOTIxOTUiOiJ5ZXMiLCI2ODA2NzA2NzQiOiJ5ZXMiLCI3MjM1Nzg5NjIiOiJ5ZXMiLCI3NjkzNTg2MDYiOiJ5ZXMiLCI3ODA0NTc2MTYiOiJpbi1wcm9ncmVzcyIsIjc4NDgzMTA1MSI6InllcyIsIjc4Nzc2NTMyOCI6ImluLXByb2dyZXNzIiwiNzk0NzA5ODgxIjoieWVzIiwiNzk2ODgyNjE2IjoieWVzIiwiODM2NzM0MzQ3IjoieWVzIiwiODY5OTY3ODg5IjoieWVzIiwiODg5NDUzOTQ5IjoieWVzIiwiODk4OTYwMzE0IjoieWVzIiwiOTA3MjI0NTI0IjoieWVzIiwiOTEwNDk2MDkxIjoiaW4tcHJvZ3Jlc3MiLCI5MTA5NDY4OTEiOiJpbi1wcm9ncmVzcyIsIjk0MTU0MTcyNyI6InllcyIsIjk1MjMzNTY4NCI6InllcyIsIjk1NTQ2MzY0MyI6InllcyIsIjk2NTcyNzIwNCI6InllcyIsIjk3ODA2NTUxOCI6InllcyIsIjk4NjUwMjgzMyI6InllcyIsIjk5MTE0OTI2MiI6ImluLXByb2dyZXNzIiwiMTAxNzc3OTMzMSI6InllcyIsIjEwNDk3NzQzMTMiOiJ5ZXMiLCIxMDUxODQwNDYwIjoieWVzIiwiMTA1MzIxMjA1MiI6InllcyIsIjEwNTUyNjcxMTAiOiJ5ZXMiLCIxMDY3MTQzMjkzIjoieWVzIiwiMTA2OTgyMDQyNCI6InllcyIsIjEwNzQ3NTA5NDUiOiJ5ZXMiLCIxMDg5NjE2ODkxIjoieWVzIiwiMTEwMjM3NTM1MyI6InllcyIsIjExMTAwNzA5MzgiOiJ5ZXMiLCIxMTExMzM3MzIyIjoieWVzIiwiMTEyOTMxODkzNCI6InllcyIsIjExNTk3NzEyMTUiOiJ5ZXMiLCIxMTczNzI4NDQ4IjoieWVzIiwiMTE5MDA4NTk5OCI6InllcyIsIjExOTY5MDk4NzYiOiJ5ZXMiLCIxMTk4MzUyMTY1IjoiaW4tcHJvZ3Jlc3MiLCIxMjA4MTY3OTgyIjoieWVzIiwiMTI2NDM3NjE0NiI6InllcyIsIjEzMTk1MjIzMDYiOiJpbi1wcm9ncmVzcyIsIjEzNjIwMjEyODciOiJ5ZXMiLCIxMzkzMjg4NjExIjoieWVzIiwiMTQwMDcwMTE3OCI6InllcyIsIjE0MjA3ODY3NjkiOiJ5ZXMiLCIxNDUyNzM3NTQwIjoieWVzIiwiMTU2NjkzMjM4NiI6InllcyIsIjE1ODQ1MTcyODQiOiJ5ZXMiLCIxNjM5NTA5NjMyIjoieWVzIiwiMTY0MTU3ODg0NSI6InllcyIsIjE2NjEyOTQwMzgiOiJpbi1wcm9ncmVzcyIsIjE2ODY3MjA5NzgiOiJ5ZXMiLCIxNjk0MjMxMzc5IjoieWVzIiwiMTcwMzAyMTA4OSI6InllcyIsIjE3MDcwNjc0NzEiOiJ5ZXMiLCIxNzEyMDE2NjQyIjoieWVzIiwiMTcyMjY4NzA2NyI6InllcyIsIjE3MjQ0OTY0MzYiOiJ5ZXMiLCIxNzI1MzE1NDU5IjoieWVzIiwiMTc0MTcwNDE2OCI6InllcyIsIjE3NDcwMzY0NzEiOiJ5ZXMiLCIxNzUwNDU3MzkxIjoieWVzIiwiMTc2ODc2OTk3MCI6InllcyIsIjE3ODUxNDc4MTIiOiJ5ZXMiLCIxNzg4MTM3NTg1IjoieWVzIiwiMTgwNjM4OTc5MiI6InllcyIsIjE4NjIzODM3MzEiOiJ5ZXMiLCIxODk1Mzc1MDM4IjoieWVzIiwiMTkwMjgzMzAwMCI6InllcyIsIjE5MzY3NDAwOTgiOiJ5ZXMiLCIyMDAzMDA0MTE0IjoieWVzIiwiMjAwNDM1NDAzNSI6InllcyIsIjIwMDU0ODY0MTYiOiJ5ZXMiLCIyMDMyNTMzMzY3IjoieWVzIiwiMjA0MjM0MjIxNyI6InllcyIsIjIwODc3OTk5NTMiOiJ5ZXMiLCIyMDkxMjc2MTIyIjoieWVzIiwiMjA5MTgzMzQ4MSI6InllcyIsIjIwOTg2MDk1MjYiOiJ5ZXMiLCIyMTEwMzc0NjA1IjoieWVzIiwiMjExNTE4ODg1MCI6InllcyIsIjIxMzg2ODY4MTMiOiJ5ZXMiLCIyMTQxOTY4Nzg5IjoieWVzIiwic3VydmV5TmFtZSI6ImFnaWxlLWFzc2Vzc21lbnQtdjEuanNvbiIsInRlYW0iOiJkZngiLCJhc3Nlc3NtZW50RGF0ZSI6IjIwMjMtMDMtMDEiLCItMTQ0NTg3NTQyOSI6InllcyIsIi03NDQ3NDUyMDQiOiJ5ZXMiLCItNzE3MTg2MzUiOiJ5ZXMiLCItMTkyODI2NzAyNiI6InllcyIsIi0xMjQ3NjkwOTQ4IjoieWVzIiwiLTg4OTY5NjA5MCI6InllcyIsIi0yNzc1MTI1ODMiOiJ5ZXMiLCItMTgzNjYwMzgwOSI6InllcyIsIi0xNDkwODU1NDQwIjoieWVzIiwiLTE3NzM3NzM1MzUiOiJ5ZXMiLCItMTU5MjcxNjYzMCI6InllcyIsIi0yMzQ3MTY5OTkiOiJ5ZXMiLCItMTY5NjYyMjc4MSI6InllcyIsIi05NzExMzMzODYiOiJ5ZXMiLCItMjQ3MDk1MzM4IjoieWVzIiwiLTE3NzM1MDUyMjgiOiJ5ZXMiLCItMTI2NDA4NTAxMiI6InllcyIsIi0xNjYyNzUxOTYzIjoieWVzIiwiLTE5Nzk4NjQyMTciOiJ5ZXMiLCItMjcwNzQ2MjA5IjoieWVzIiwiLTIwMDc3OTkxNjEiOiJ5ZXMiLCItMTU0ODg4OTY5IjoieWVzIiwiLTIxMjUzOTM4MzAiOiJ5ZXMiLCItMTk0MDU1ODk1OCI6InllcyIsIi0yMDkyNjYxNTk4IjoieWVzIiwiLTEzMDk5NTQ0OSI6InllcyIsIi0xOTg2MTExMzA3IjoieWVzIiwiLTEzODY4NDI4IjoieWVzIiwiLTcyMzMxODY2NiI6InllcyIsIi0xNTI0OTU1MDg4IjoieWVzIiwiLTIxNjM4Mzg1MSI6InllcyIsIi0yMTMzNTQ2MDUwIjoieWVzIiwiLTE3MzQ3MTU4NiI6InllcyIsIi0xMDYyOTQ2MTQ1IjoieWVzIiwiLTE4MDQwMDUwNzYiOiJ5ZXMiLCItNjI5OTk1NDczIjoieWVzIiwiLTcxODg5NzIzMCI6ImluLXByb2dyZXNzIiwiLTE1Mzc1MDc0OTYiOiJ5ZXMiLCItMjEzOTQ5MTc0MCI6InllcyIsIi0xMTk1ODYwMzAiOiJ5ZXMiLCItNjkxNTYyODQwIjoieWVzIiwiLTE1NzY5NDQ5MDUiOiJ5ZXMiLCItMTcyMTE2ODkzNCI6InllcyIsIi0zODQ4NjEzOCI6InllcyIsIi0zNzcyMjQwNTMiOiJ5ZXMiLCItODMzNDgwMTYzIjoieWVzIiwiLTE4MzM0NzcyMzQiOiJ5ZXMiLCItMjQxNjkwMDMwIjoieWVzIiwiLTExMDcwMjkzMiI6InllcyIsIi0xMzg5NzAyMDU0IjoieWVzIiwiLTI4MjIxMDUxMiI6InllcyIsIi0xMTgwMDEzMTk1IjoieWVzIiwiLTE0OTkxOTQ5MjgiOiJpbi1wcm9ncmVzcyIsIi05NjMxMTQ2MjciOiJ5ZXMiLCItMTk1Mjc0NDg2NyI6InllcyIsIi0xMDUxODcwOTciOiJ5ZXMiLCItNzI5MzU4NzIzIjoieWVzIiwiLTk3NjA0MzYyMCI6InllcyIsIi0xNzk2Nzk3NzcxIjoieWVzIiwiLTI4ODEwMjI4NCI6InllcyIsIi04NjkyMjY5NDQiOiJ5ZXMiLCItMTg2OTIwMzI2MCI6InllcyIsIi0xODEzNDYwMTIiOiJ5ZXMiLCItMjExMTQzODQxOSI6InllcyIsIi0xNTA1MjM2OTY5IjoieWVzIiwiLTg0Mzc1MjEiOiJ5ZXMiLCItMTc0MDcwNTk3IjoieWVzIiwiLTQ3NDE0MTM1IjoieWVzIiwiLTI0ODAxNDgzOSI6InllcyIsIi0xMzE2NzUzNiI6InllcyIsIi0xNjk2NDc2MjIzIjoieWVzIiwiLTIxMjAxMzU0NjIiOiJpbi1wcm9ncmVzcyIsIi0xNjMzMTU1OTc2IjoieWVzIiwiLTQ4NjU2OTU4NCI6InllcyIsIi0xNDU1OTI0MDEwIjoieWVzIiwiLTg0MTI3NDQwMSI6InllcyIsIi02ODAwMTQ3MTQiOiJ5ZXMiLCItNDk0MjU2NDgwIjoieWVzIiwiLTE5NTI1MzI1NyI6InllcyIsIi0yMTIzMjk0NTU2IjoiaW4tcHJvZ3Jlc3MiLCItMTgyOTM1NjM2MyI6InllcyIsIi0yNTI0ODU0NzUiOiJ5ZXMiLCItOTU5MzE3NzQ1IjoieWVzIiwiLTIwMDM0NzYyIjoiaW4tcHJvZ3Jlc3MiLCItODQ0MTQ1NDUxIjoieWVzIiwiLTIxMDUzMjYzNzYiOiJ5ZXMiLCItMjY0NzMzNjcwIjoieWVzIiwiLTc4MzU2MTA5IjoieWVzIiwiLTExOTY5ODU5NzciOiJ5ZXMiLCItODAzNDE4NjQ4IjoieWVzIiwiLTU3NjI3MTI2NiI6InllcyIsIi0xNDU2NDEwMTk1IjoiaW4tcHJvZ3Jlc3MiLCItMTkyOTgxMjkyMSI6InllcyIsIi0xNzA2MTIzODk0IjoiaW4tcHJvZ3Jlc3MiLCItMTc3NDgyOTcwMSI6InllcyIsIi01NDU3NTA1NzMiOiJ5ZXMiLCItNzAzMjgyODEyIjoiaW4tcHJvZ3Jlc3MiLCItODYzNzY2MzkxIjoieWVzIiwiLTExNTUyNTIwMTYiOiJ5ZXMiLCItNTA1MjQ2MDMyIjoieWVzIiwiLTEyODM4NDYwMDEiOiJ5ZXMiLCItNDA1NTk5Mjc2IjoieWVzIiwiLTEzMjQzNTgxODUiOiJ5ZXMiLCItNjM2NzM2Mzg5IjoieWVzIiwiLTM1Mzc2MDc5IjoieWVzIiwiLTE3MzYxMDQyNTgiOiJ5ZXMiLCItMTczMDk2MDQ2MCI6InllcyIsIi0xOTgzMjEyMjEiOiJ5ZXMiLCItMjA2MDk5NTc5IjoieWVzIiwiLTEzNDQ4NjU0MTMiOiJpbi1wcm9ncmVzcyIsIi0xMDk1OTIxNDIiOiJ5ZXMiLCItMTI5NjA2OTgxIjoieWVzIiwiLTE0MzE1NDU1ODMiOiJpbi1wcm9ncmVzcyIsIi0yMTA5Mjg3NjQ5IjoieWVzIiwiLTU2ODkyMjk4IjoieWVzIiwiLTE0MjczMjY2NDkiOiJ5ZXMiLCItNjQ2ODc5ODY2IjoiaW4tcHJvZ3Jlc3MiLCItMTY4MDEwOTUyOSI6InllcyIsIi0xMDQ0NTgwNTcwIjoieWVzIiwiLTEwMzA1NzYxNTMiOiJ5ZXMiLCItNDY5NTEwNzEzIjoieWVzIiwiLTEyMjQ5OTY4ODciOiJpbi1wcm9ncmVzcyIsIi02MDc4NjgxNzIiOiJ5ZXMifQ==`;

function addMetricEntry(metric) {
  return <div>metric</div>;
}

export function ComparativeScore(props) {
  const parameters = useParams();
  const [url, updateUrl] = useState(testurldata);
  const [checklistData, updateChecklist] = useState(null);
  const [metrics, updateMetric] = useState([]);

  const savedData = parameters.data;

  const addMetric = () => {
    const data = url.split("/").reverse()[0].split("?")[0];
    createChecklist(data, props.http);
  };

  const metricCallback = (m) => {
    updateMetric([...metrics, m]);
  };

  const updateUrlData = (e) => updateUrl(e.target.value);

  return (
    <>
      <div>
        <div data-legend>
          <div data-add>
            <span>Add Data Point:</span>
            <div data-input-entry>
              <input
                type="text"
                key="url"
                id="urlInput"
                name="urlInput"
                onChange={updateUrlData}
                value={url}
              ></input>
              <input type="button" onClick={addMetric}></input>
            </div>
            <input type="checkbox" id="data-add-visible"></input>
          </div>
        </div>
        <div data-graph>{metrics.forEach((x) => addMetricEntry(x))}</div>
      </div>
    </>
  );
}
