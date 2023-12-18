import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./menu";

import * as CompressionUtilities from "../utilities/compression";

import { getChecklist } from "../utilities/surveyData";
import { faL } from "@fortawesome/free-solid-svg-icons";

function mapEntriesToSorted(entries) {
  return [...entries].sort((a, b) => a.score - b.score);
}

export function calculateMetrics(survey, getValue) {
  const defaultValue = survey.sectionScoreDefault;
  const updateItem = (item) => {
    return Object.assign({}, item, { value: getValue(item.id) });
  };

  const updateSection = (section) => {
    const entries = section.entries.map(updateItem);
    const score = calculateScore(entries, defaultValue);

    return Object.assign({}, section, { entries, score });
  };

  return Object.assign({}, survey, {
    items: survey.items.map(updateSection),
  });
}

function updateDataObject(state, key, value, keepAsString) {
  const stateAnswerKey = state.answerKey || {};
  const stateAnswerKeyWithNewValue = Object.assign({});

  const convertedValue = parseInt(value, 10);
  const evaluatedValue =
    isNaN(convertedValue) || keepAsString ? value : convertedValue;

  const update = Object.assign({}, state, {
    [key]: evaluatedValue,
  });

  return update;
}

export function calculateScoreData(data) {
  const results = Object.keys(data).reduce((s, i) => (data[i] += s), 0);
  return results;
}

function makeId(length) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}

function createInstanceId() {
  return makeId(20);
}

export function makeHeader(survey, disabled, updateState, urlData, getValue) {
  function updateTeam(e) {
    const team = e.target.value;
    const updatedTeam = updateDataObject(urlData, "team", team);
    updateState(updatedTeam);
  }

  function updateAssessmentDate(e) {
    const date = e.target.value;
    const updatedTeam = updateDataObject(urlData, "assessmentDate", date, true);

    updateState(updatedTeam);
  }

  return (
    <div data-header>
      <h1 data-survey-title>{survey.name}</h1>
      <input
        type="text"
        key="team-name"
        placeholder="Survey Target"
        data-team-name
        disabled={disabled}
        onChange={updateTeam}
        value={getValue("team")}
        id="team-name"
      ></input>
      <input
        type="date"
        data-assessment-date
        value={getValue("assessmentDate")}
        onChange={updateAssessmentDate}
        key="assessmentDate"
        id="assessmentDate"
        disabled={disabled}
      ></input>
    </div>
  );
}

export function updateStateDetermineNavigate(newKeyValue) {
  this.navigate(convertForUrl(newKeyValue), { replace: false });
}

function reducer(s, i) {
  return i(s);
}

export function Checklist({ data, callback, disabled, http }) {
  const [survey, updateChecklist] = useState({ items: [] });
  const parameters = useParams();
  const navigate = useNavigate();

  const updateState = updateStateDetermineNavigate.bind({ navigate });

  const parsedData = convertAndParse(data || parameters.data);
  const name = parameters.name || parsedData.surveyName;
  const scoreData = {};
  const sectionScoreDefault = survey.sectionScoreDefault;

  const getData = () => parsedData || { surveyName: name };

  const urlData = getData();
  const getValue = (key) => urlData[key];
  const notify = callback || (() => {});

  const loadChecklist = () => {
    getChecklist(http, name)
      .then((d) => calculateMetrics(d, getValue))
      .then((x) => {
        return x;
      })
      .then((d) => updateChecklist(d));
  };

  const findItem = (id) => {
    return survey.items
      .map((x) => x.entries)
      .flat()
      .filter((x) => x.id === id)[0];
  };

  const updateChecklistValue = (sectionKey, entries, id, value) => {
    const item = findItem(id);
    item.value = value;

    updateChecklist(survey);

    const sectionScore = calculateScore(entries);
    const updatedSurveyObject = updateDataObject(urlData, id, value);
    const updatedSection = updateDataObject(
      updatedSurveyObject,
      createSectionKey(sectionKey, sectionScore)
    );

    updateState(updatedSection);
  };

  const populateInstanceIdValue = (k) => {
    return [
      getValue,
      (v) => v || [createInstanceId, updateAssessmentId].reduce(reducer, null),
    ].reduce(reducer, k);
  };

  useEffect(loadChecklist, []);

  const updateSectionScore = (k, s) => {
    scoreData[k] = s;
  };

  const updateAssessmentDate = (e) => {
    const date = e.target.value;
    const updatedTeam = updateDataObject(urlData, "assessmentDate", date, true);

    updateState(updatedTeam);
  };

  function updateAssessmentId(id) {
    const updatedId = updateDataObject(urlData, "instanceId", id, true);
    updateState(updatedId);
    return id;
  }

  const getAnswerKey = (name) => survey.answerKeys[name] || [];

  //HIDE TOTAL CALCULATE HERE.
  const hideTotals = false;

  return (
    <div>
      {makeHeader(survey, disabled, updateState, urlData, getValue)}
      <div>
        <input
          type="text"
          data-assessment-id
          value={populateInstanceIdValue("instanceId")}
          key="assessmentId"
          id="assessmentId"
          disabled
        ></input>
      </div>
      <div>
        {(survey.items || []).map((x) =>
          createSection(
            x,
            updateChecklistValue,
            createSectionKey,
            (entries) => calculateScore(entries, sectionScoreDefault),
            updateSectionScore,
            disabled,
            getAnswerKey
          )
        )}
      </div>
      <h2 data-total-score data-hide-total-display={hideTotals}>
        Total Score: {calculateScoreData(scoreData) || 0}
      </h2>
      <Menu
        name={name}
        data={data}
        getData={getData}
        disabled={disabled}
      ></Menu>
    </div>
  );
}

function calculateScore(entries, defaultValue) {
  const sortedEntries = mapEntriesToSorted(entries);

  const scored = sortedEntries.reduce(
    (s, c) => {
      if (c.score < 0) {
        if (c.value && parseInt(c.value, 10) !== 0) {
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

      const continueToProcess =
        s.continueToProcess && parseInt(c.value, 10) === 2;

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

export function convertForUrl(input) {
  const steps = [
    (i) => JSON.stringify(i),
    (i) => CompressionUtilities.compress(i),
  ];
  const convert = (e, fn) => (e ? fn(e) : e);

  return steps.reduce(convert, input);
}

export function convertAndParse(input) {
  const steps = [
    (i) => CompressionUtilities.decompress(i),
    (i) => JSON.parse(i),
  ];

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
  updateSectionScore,
  disabled,
  getAnswerKey
) {
  const updateSection = (entryKey, value) => {
    return update(key, entries, entryKey, value);
  };

  const sortedEntriesWithValues = mapEntriesToSorted(entries);
  const score = calculateScore(sortedEntriesWithValues);
  const sectionKey = createSectionKey(key);

  updateSectionScore(sectionKey, score);

  return (
    <section data-section-wrapper key={`${section}-${name}`}>
      <div data-name="name" key={`name-${name}`}>
        <h2 data-section-name>{section}</h2>
        <h3 key={"score-" + sectionKey}>Score: {score}</h3>
      </div>
      <section key={sectionKey}>
        {sortedEntriesWithValues.map((x) =>
          createEntry(x, updateSection, disabled, sectionKey, getAnswerKey)
        )}
      </section>
    </section>
  );
}

function makeOptions(id, value, disabled, updateEvent, descriptor, checked) {
  return (
    <label data-input-value={descriptor} key={`${id}-${descriptor}`}>
      <input
        type="radio"
        name={id}
        value={value}
        key={`${descriptor}-${id}`}
        onChange={updateEvent}
        checked={checked}
        disabled={disabled}
      ></input>
      <span>{descriptor}</span>
    </label>
  );
}

function createEntry(entry, update, disabled, sectionName, getAnswerKey) {
  const { descriptor, score, value, id } = entry;
  const updateEvent = (e) => {
    const value = e.target.value;
    entry.value = value;
    update(id, value);
  };

  const options = getAnswerKey(entry.options);

  return (
    <div
      key={`wrapper-score-${id}:${sectionName}`}
      data-entry
      data-value={score}
    >
      <div key={descriptor} data-entry-description>
        {descriptor}
      </div>
      <div data-entry-value>
        {Reflect.ownKeys(options).map((k) => {
          const option = options[k];
          return makeOptions(id, k, disabled, updateEvent, option, k == value);
        })}
      </div>
    </div>
  );
}
