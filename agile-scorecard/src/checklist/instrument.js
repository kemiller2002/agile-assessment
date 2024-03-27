import React, { useState, useEffect, useReducer } from "react";
import { useParams, useNavigate, Link, redirect } from "react-router-dom";
import Menu from "./menu";
import * as CompressionUtilities from "../utilities/compression";

import { getInstrument } from "../utilities/surveyData";
import { faL } from "@fortawesome/free-solid-svg-icons";

import { functionReducer } from "../utilities/reducer";

import { createInstanceId } from "../utilities/identifiers";

import { scoreFormat } from "../utilities/surveyData";

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

    return { ...section, entries, score };
  };

  return { ...survey, items: survey.items.map(updateSection) };
}

export function updateDataObject(state, key, value, keepAsString) {
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

export function makeHeader(
  survey,
  disabled,
  updateState,
  urlData,
  getValue,
  displayAdministrator
) {
  function updateTeam(e) {
    const team = e.target.value;
    const updatedTeam = updateDataObject(urlData, "team", team);
    updateState(updatedTeam);
  }

  function updateAssessmentDate(e) {
    const date = e.target.value;
    const updateDate = updateDataObject(urlData, "assessmentDate", date, true);

    updateState(updateDate);
  }

  function updateAdministrator(e) {
    const date = e.target.value;
    const updateAdministrator = updateDataObject(
      urlData,
      "administrator",
      date,
      true
    );

    updateState(updateAdministrator);
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
        value={getValue("team") || ""}
        id="team-name"
      ></input>
      <input
        type="date"
        data-assessment-date
        value={getValue("assessmentDate") || ""}
        onChange={updateAssessmentDate}
        key="assessmentDate"
        id="assessmentDate"
        disabled={disabled}
      ></input>
      <input
        type="text"
        data-assessment-display-administrator
        data-hide-administrator={!displayAdministrator}
        value={getValue("administrator") || ""}
        onChange={updateAdministrator}
        key="administrator"
        id="administrator"
        placeholder="Administrator Information"
        disabled={disabled}
      ></input>
    </div>
  );
}

export function updateStateDetermineNavigate(newKeyValue) {
  this.navigate(convertForUrl(newKeyValue), { replace: false });
}

function makeQuestions(survey, questions) {
  const surveyQuestions = [
    (survey) => survey.items,
    (items) => items.map((item) => item.entries),
    (entries) => entries.flat(),
    (entries) => entries.reduce((s, i) => ({ ...s, [i.id]: i }), {}),
  ].reduce(functionReducer, survey);

  return [(q) => q.split(";"), (q) => q.map((x) => surveyQuestions[x])].reduce(
    functionReducer,
    questions
  );
}

function setSurveyQuestions(survey, questionList) {
  const makeNewInstrumentInstance = (entries) => {
    return {
      ...survey,
      items: [
        {
          section: "",
          descriptor: "",
          entries: makeQuestions(survey, questionList),
        },
      ],
    };
  };

  return !questionList
    ? survey
    : [
        (s) => s.items,
        (i) => i.map((x) => x.entries),
        (es) => es.flat(),
        makeNewInstrumentInstance,
      ].reduce(functionReducer, survey);
}

export function Instrument({ data, callback, disabled, http }) {
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

  const displayedQuestionList = getValue("questionList");

  const setSurveyQuestionsForData = (survey) =>
    setSurveyQuestions(survey, displayedQuestionList);

  const loadChecklist = () => {
    getInstrument(http, name)
      .then((d) => calculateMetrics(d, getValue))
      .then((x) => {
        return x;
      })
      .then(setSurveyQuestionsForData)
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
      (v) =>
        v ||
        [createInstanceId, updateAssessmentId].reduce(functionReducer, null),
    ].reduce(functionReducer, k);
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

  const updateAssessmentId = (id) => {
    const updatedId = updateDataObject(urlData, "instanceId", id, true);
    updateState(updatedId);
    return id;
  };

  const getAnswerKey = (name) => survey.answerKeys[name] || [];

  useEffect(() => {
    populateInstanceIdValue("instanceId");
  }, []);

  //HIDE TOTAL CALCULATE HERE.
  const hideScore = !(survey.scores || {}).show;
  const assessmentId = populateInstanceIdValue("instanceId");

  console.log(survey);

  return (
    <div>
      <div>
        <label data-assessment-id-container>
          <span data-assessment-id-container-text>Instrument Instance Id</span>
          <input
            type="text"
            data-assessment-id
            value={assessmentId}
            key="assessmentId"
            id="assessmentId"
            disabled
          ></input>
        </label>
      </div>
      {makeHeader(survey, disabled, updateState, urlData, getValue)}

      <div data-survey-container>
        {(survey.items || []).map((item) =>
          createSection(
            item,
            updateChecklistValue,
            createSectionKey,
            (entries) => calculateScore(entries, sectionScoreDefault),
            updateSectionScore,
            disabled,
            getAnswerKey,
            hideScore
          )
        )}
      </div>
      <h2 data-total-score data-hide-score-display={hideScore}>
        Total Score: {calculateScoreData(scoreData) || 0}
      </h2>
      <Menu
        name={name}
        data={data}
        getData={getData}
        disabled={disabled}
      ></Menu>
      <div data-complete-assessment-container>
        <div data-complete-assessment>
          <Link
            to={`/prepare-results/${name}/${parameters.data}`}
            data-prepare-to-send-link="true"
          >
            Send Results
          </Link>
        </div>
      </div>
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
  getAnswerKey,
  hideScore
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
        <h3 key={"score-" + sectionKey} data-hide-score-display={hideScore}>
          Score: {score}
        </h3>
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
        {Reflect.ownKeys(options)
          .filter((x) => x.match(scoreFormat))
          .map((k) => {
            const option = options[k];
            return makeOptions(
              id,
              k,
              disabled,
              updateEvent,
              option,
              k == value
            );
          })}
      </div>
    </div>
  );
}
