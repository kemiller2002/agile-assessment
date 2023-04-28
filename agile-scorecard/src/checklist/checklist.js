import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Menu from "./menu";

export function getChecklist({ get }, fileName) {
  return get(`./surveys/${fileName}`).then((x) => x.data);
}

function mapEntriesToSorted(entries) {
  return [...entries].sort((a, b) => a.score - b.score);
}

export function calculateMetrics(survey, getValue) {
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
    items: survey.items.map(updateSection),
  });
}

function updateDataObject(state, key, value) {
  return Object.assign({}, state, {
    [key]: value,
  });
}

export function calculateScoreData(data) {
  const results = Object.keys(data).reduce((s, i) => (data[i] += s), 0);
  return results;
}

export function Checklist({ data, callback, disabled, http }) {
  const [survey, updateChecklist] = useState({ items: [] });
  const parameters = useParams();
  const navigate = useNavigate();

  const parsedData = convertAndParse(data || parameters.data);
  const name = parameters.name || parsedData.surveyName;
  const scoreData = {};
  const sectionScoreDefault = survey.sectionScoreDefault;

  const getData = () => parsedData || { surveyName: name };

  const urlData = getData();
  const getValue = (k) => {
    return urlData[k];
  };

  const notify = callback || (() => {});

  const loadChecklist = () => {
    getChecklist(http, name)
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

  const updateState = (newKeyValue) => {
    navigate(convertForUrl(newKeyValue), { replace: false });
  };

  const updateChecklistValue = (sectionKey, entries, key, value) => {
    const item = findItem(key);
    item.value = value;

    updateChecklist(survey);

    const sectionScore = calculateScore(entries);
    const updatedSurveyObject = updateDataObject(urlData, key, value);
    const updatedSection = updateDataObject(
      updatedSurveyObject,
      createSectionKey(sectionKey, sectionScore)
    );

    updateState(updatedSection);
  };

  useEffect(loadChecklist, []);

  const updateSectionScore = (k, s) => {
    scoreData[k] = s;
  };

  const updateTeam = (e) => {
    const team = e.target.value;
    const updatedTeam = updateDataObject(urlData, "team", team);
    updateState(updatedTeam);
  };

  const updateAssessmentDate = (e) => {
    const date = e.target.value;
    const updatedTeam = updateDataObject(urlData, "assessmentDate", date);
    updateState(updatedTeam);
  };

  return (
    <div>
      <div data-header>
        <h1 data-survey-title>{survey.name}</h1>
        <input
          type="text"
          key="team-name"
          placeholder="Team Name"
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
      <div>
        {(survey.items || []).map((x) =>
          createSection(
            x,
            updateChecklistValue,
            createSectionKey,
            (entries) => calculateScore(entries, sectionScoreDefault),
            updateSectionScore,
            disabled
          )
        )}
      </div>
      <h2 data-total-score>
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
        if (c.value && c.value !== "no") {
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

      const continueToProcess = s.continueToProcess && c.value === "yes";

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
  const steps = [(i) => JSON.stringify(i), (i) => btoa(i)];
  const convert = (e, fn) => (e ? fn(e) : e);

  return steps.reduce(convert, input);
}

export function convertAndParse(input) {
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
  updateSectionScore,
  disabled
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
        {sortedEntriesWithValues.map((x) =>
          createEntry(x, updateSection, disabled, sectionKey)
        )}
      </section>
    </section>
  );
}

function createEntry(entry, update, disabled, sectionName) {
  const { descriptor, key, score, value } = entry;
  const updateEvent = (e) => {
    const value = e.target.value;
    entry.value = value;
    update(key, value);
  };

  return (
    <div
      key={`wrapper-score-${key}:${sectionName}`}
      data-entry
      data-value={score}
    >
      <div key={descriptor} data-entry-description>
        {descriptor}
      </div>
      <div data-entry-value>
        <label data-input-value="no">
          <input
            type="radio"
            name={key}
            value="no"
            key={`no-${key}`}
            onChange={updateEvent}
            checked={!value}
            disabled={disabled}
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
            disabled={disabled}
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
            disabled={disabled}
          ></input>
          <span>Yes</span>
        </label>
      </div>
    </div>
  );
}
