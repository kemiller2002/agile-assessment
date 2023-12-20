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
}

function addMetric(data) {
  console.log("NOT DEFINED");
}

function createMetricLegendDisplay(data) {
  console.log("NOT DEFINED");
}

export function ThreeSixtyComparison() {
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

  const boundUpdateComparisonName = updateComparisonName.bind({
    updateSystem: updateTitle,
    save: updateState,
    get,
  });

  const updateUrlData = (e) => updateUrl(e.target.value);
  const metricsData = createDashboardDataset(decodedData); //hERE
  const graphData = {
    labels: metricsData.labels,
    datasets: metricsData.datasets,
  };

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
