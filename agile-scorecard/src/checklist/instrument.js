import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Menu from "./menu";
import * as CompressionUtilities from "../utilities/compression";
import { getInstrument } from "../utilities/surveyData";
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
  displayAdministrator,
  administrationMode
) {
  const surveyIndicateDisableDate = (survey.date || {}).preventModification;
  const surveyTargetDisableTarget = (survey.target || {}).preventModification;

  const notAdministrationMode = !administrationMode;

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
      <p data-survey-introduction>
        Respond from what you have observed. Choose the closest answer; avoid
        guessing when evidence is unavailable.
      </p>
      <div data-survey-context>
        <label>
          <span>Team or assessment target</span>
          <input
            type="text"
            key="team-name"
            placeholder="For example, Payments team"
            data-team-name
            disabled={
              disabled || (surveyTargetDisableTarget && notAdministrationMode)
            }
            onChange={updateTeam}
            value={getValue("team") || ""}
            id="team-name"
          />
        </label>
        <label>
          <span>Assessment date</span>
          <input
            type="date"
            data-assessment-date
            value={getValue("assessmentDate") || ""}
            onChange={updateAssessmentDate}
            key="assessmentDate"
            id="assessmentDate"
            disabled={
              disabled || (surveyIndicateDisableDate && notAdministrationMode)
            }
          />
        </label>
        <label data-hide-administrator={!displayAdministrator}>
          <span>Administrator</span>
          <input
            type="text"
            data-assessment-display-administrator
            value={getValue("administrator") || ""}
            onChange={updateAdministrator}
            key="administrator"
            id="administrator"
            placeholder="Name or contact"
            disabled={disabled}
          />
        </label>
      </div>
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
          section: "Survey Questionnaire",
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
      createSectionKey(sectionKey),
      sectionScore
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

  const assessmentId = populateInstanceIdValue("instanceId");
  const groupId = getValue("groupId");
  const allEntries = (survey.items || []).flatMap((item) => item.entries || []);
  const answeredCount = allEntries.filter(
    (entry) => entry.value !== undefined && entry.value !== null && entry.value !== ""
  ).length;
  const totalCount = allEntries.length;
  const completion = totalCount ? (answeredCount / totalCount) * 100 : 0;
  const completionLabel =
    completion > 0 && completion < 1 ? "<1" : Math.round(completion);

  return (
    <main data-survey-page>
      {makeHeader(survey, disabled, updateState, urlData, getValue)}

      <div data-assessment-progress aria-label="Assessment progress">
        <div>
          <strong>{answeredCount} of {totalCount}</strong> statements answered
        </div>
        <span>{completionLabel}% complete</span>
        <progress max="100" value={completion}>
          {completion}%
        </progress>
      </div>

      <details data-assessment-details>
        <summary>Assessment details</summary>
        <div>
          <label>
            <span>Instrument instance ID</span>
            <input
              type="text"
              data-assessment-id
              value={assessmentId}
              key="assessmentId"
              id="assessmentId"
              disabled
            />
          </label>
          {groupId && (
            <label>
              <span>Instrument group ID</span>
              <input
                type="text"
                data-assessment-id
                value={groupId}
                key="groupId"
                id="groupId"
                disabled
              />
            </label>
          )}
        </div>
      </details>

      <div data-survey-container>
        {(survey.items || []).map((item) =>
          createSection(
            item,
            updateChecklistValue,
            createSectionKey,
            (entries) => calculateScore(entries, sectionScoreDefault),
            updateSectionScore,
            disabled,
            getAnswerKey
          )
        )}
      </div>
      <Menu
        name={name}
        data={data}
        getData={getData}
        disabled={disabled}
      ></Menu>
      <div data-complete-assessment-container>
        <div data-complete-assessment>
          <div>
            <strong>Ready to finish?</strong>
            <span>
              Review your responses before preparing the results.
            </span>
          </div>
          <Link
            to={`/prepare-results/${name}/${parameters.data}`}
            data-prepare-to-send-link="true"
          >
            Review responses
          </Link>
        </div>
      </div>
    </main>
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
  { name, descriptor, section, entries, key },
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
  const answered = sortedEntriesWithValues.filter(
    (entry) => entry.value !== undefined && entry.value !== null && entry.value !== ""
  ).length;

  updateSectionScore(sectionKey, score);

  return (
    <section
      data-section-wrapper
      aria-labelledby={`${sectionKey}-heading`}
      key={`${section}-${name}`}
    >
      <div data-name="name" key={`name-${name}`}>
        <div>
          <span data-section-kicker>Assessment section</span>
          <h2 id={`${sectionKey}-heading`} data-section-name>{section}</h2>
          {(descriptor || name) && (
            <p data-section-description>{descriptor || name}</p>
          )}
        </div>
        <span data-section-progress>
          {answered} of {entries.length} answered
        </span>
      </div>
      <section key={sectionKey}>
        {sortedEntriesWithValues.map((x, index) =>
          createEntry(
            x,
            updateSection,
            disabled,
            sectionKey,
            getAnswerKey,
            index
          )
        )}
      </section>
    </section>
  );
}

function makeOptions(id, value, disabled, updateEvent, descriptor, checked) {
  return (
    <label
      data-input-value={descriptor}
      data-selected={checked}
      key={`${id}-${descriptor}`}
    >
      <input
        type="radio"
        name={id}
        value={value}
        key={`${descriptor}-${id}`}
        onChange={updateEvent}
        checked={checked}
        disabled={disabled}
      />
      <span>{descriptor}</span>
    </label>
  );
}

function createEntry(
  entry,
  update,
  disabled,
  sectionName,
  getAnswerKey,
  index
) {
  const { descriptor, value, id } = entry;
  const updateEvent = (e) => {
    const value = e.target.value;
    entry.value = value;
    update(id, value);
  };

  const options = getAnswerKey(entry.options);

  return (
    <fieldset
      key={`wrapper-score-${id}:${sectionName}`}
      data-entry
    >
      <legend data-entry-description>
        <span data-question-number aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
        <span>{descriptor}</span>
      </legend>
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
              k === String(value)
            );
          })}
      </div>
    </fieldset>
  );
}
