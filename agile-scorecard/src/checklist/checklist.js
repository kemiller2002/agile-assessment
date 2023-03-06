import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function getChecklist({ get }, fileName) {
  return get(`/surveys/${fileName}`).then((x) => x.data);
}

function mapEntriesToSorted(entries) {
  return [...entries].sort((a, b) => a.score - b.score);
}

function calculateMetrics(survey, getValue) {
  const defaultValue = survey.sectionScoreDefault;
  const updateItem = (item) => {
    return Object.assign({}, item, { value: getValue(item.key) });
  };

  const updateSection = (section) => {
    const entries = section.entries.map(updateItem);
    const score = calculateScore(entries, defaultValue);

    return Object.assign({}, section, { entries, score });
  };

  return Object.assign({}, survey, {
    items: [survey.items[0]].map(updateSection),
  });
}

export default function Checklist(props) {
  const [survey, updateChecklist] = useState({ items: [] });
  const [total, updateTotal] = useState({ total: 0 });

  const parameters = useParams();
  const name = parameters.name;

  const navigate = useNavigate();

  const getData = () =>
    convertAndParse(parameters.data) || { surveyName: parameters.name };

  const urlData = getData();

  const getValue = (k) => {
    return urlData[k];
  };

  const loadChecklist = () => {
    getChecklist(props.http, name)
      .then((d) => calculateMetrics(d, getValue))
      .then((x) => {
        return x;
      })
      .then((d) => updateChecklist(d));
  };

  const findItem = (key) => {
    return survey.items
      .map((x) => x.entries)
      .flat()
      .filter((x) => x.key === key)[0];
  };

  const updateChecklistValue = (sectionKey, entries, key, value) => {
    const item = findItem(key);
    item.value = value;

    updateChecklist(survey);

    const sectionScore = calculateScore(entries);

    const newKeyValue = Object.assign({}, urlData, {
      [key]: value,
      [createSectionKey(sectionKey)]: sectionScore,
    });

    navigate(convertForUrl(newKeyValue), { replace: false });
  };

  useEffect(loadChecklist, []);

  const sectionScoreDefault = survey.sectionScoreDefault;

  const scoreData = {};

  const updateSectionScore = (k, s) => {
    total[k] = s;
    //updateTotal({ total: 5 });
  };

  const calculateScoreData = (data) =>
    Object.keys(data).reduce((s, i) => (data[i] += s), 0);

  return (
    <div>
      <h2 data-total-score>Total Score: {scoreData.total || 0}</h2>
      <div data-header>
        <h1 data-survey-title>{survey.name}</h1>
        <div data-actions>
          <button type="button" onClick={() => exportData(getData)}>
            Export Data
          </button>
        </div>
      </div>
      <div>
        {(survey.items || []).map((x) =>
          createSection(
            x,
            updateChecklistValue,
            createSectionKey,
            (entries) => calculateScore(entries, sectionScoreDefault),
            updateSectionScore
          )
        )}
      </div>
    </div>
  );
}

function calculateScore(entries, defaultValue) {
  const sortedEntries = mapEntriesToSorted(entries);
  const scored = sortedEntries.reduce(
    (s, c) => {
      if (c.score < 0) {
        if (c.value != "no") {
          return {
            inProcessScore: -1,
            continueToProcess: false,
            score: -1,
          };
        }

        return s;
      }

      if (!s.continueToProcess) {
        return s;
      }

      const continueToProcess = s.continueToProcess && c.value == "yes";

      const updateScore = !s.inProcessScore || s.inProcessScore < c.score;

      const newState = {
        inProcessScore: s.score < c.score ? s.score : s.inProcessScore,
        continueToProcess,
        score: c.score,
      };

      return newState;
    },
    {
      inProcessScore: defaultValue,
      continueToProcess: true,
      score: defaultValue,
    }
  );

  return scored.continueToProcess ? scored.score : scored.inProcessScore;
}

function exportData(getData) {
  const data = getData();
  const serializedData = JSON.stringify(data);
  const blob = new Blob([serializedData], { type: "application/data" });
  window.open(URL.createObjectURL(blob));
}

function convertForUrl(input) {
  const steps = [(i) => JSON.stringify(i), (i) => btoa(i)];
  const convert = (e, fn) => (e ? fn(e) : e);

  return steps.reduce(convert, input);
}

function convertAndParse(input) {
  const steps = [(i) => atob(i), (i) => JSON.parse(i)];
  const convert = (e, fn) => (e ? fn(e) : e);

  return steps.reduce(convert, input);
}
function createSectionKey(k) {
  return `section-${k}`;
}

function createSection(
  { name, section, entries, key },
  update,
  createSectionKey,
  calculateScore,
  updateSectionScore
) {
  const updateSection = (entryKey, value) => {
    return update(key, entries, entryKey, value);
  };

  const sortedEntriesWithValues = mapEntriesToSorted(entries);
  const score = calculateScore(sortedEntriesWithValues);
  const sectionKey = createSectionKey(key);

  updateSectionScore(sectionKey, score);

  return (
    <section data-section-wrapper>
      <div data-name="name" key={`name-${name}`}>
        <h2 data-section-name>{section}</h2>
        <h3 key={"score-" + sectionKey}>Score: {score}</h3>
      </div>
      <section key={sectionKey}>
        {sortedEntriesWithValues.map((x) => createEntry(x, updateSection))}
      </section>
    </section>
  );
}

function createEntry(entry, update) {
  const { descriptor, key, score, value } = entry;
  const updateEvent = (e) => {
    const value = e.target.value;
    entry.value = value;
    update(key, value);
  };

  return (
    <div data-entry data-value={score}>
      <div data-entry-description>{descriptor}</div>
      <div data-entry-value>
        <label data-input-value="no">
          <input
            type="radio"
            name={key}
            value="no"
            key={`no-${key}`}
            onChange={updateEvent}
            checked={!value}
          ></input>
          <span>No</span>
        </label>
        <label data-input-value="in progress">
          <input
            type="radio"
            name={key}
            value="in-progress"
            onChange={updateEvent}
            checked={value === "in-progress"}
            key={`inprogress-${key}`}
          ></input>
          <span>In Progress</span>
        </label>
        <label data-input-value="yes">
          <input
            type="radio"
            name={key}
            value="yes"
            checked={value === "yes"}
            key={`yes-${key}`}
            onChange={updateEvent}
          ></input>
          <span>Yes</span>
        </label>
      </div>
    </div>
  );
}
