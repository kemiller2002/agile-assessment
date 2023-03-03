import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import "./css/checklist.css";

function getChecklist({ get }, fileName) {
  return get(`/surveys/${fileName}`).then((x) => x.data);
}

export default function Checklist(props) {
  const [survey, updateChecklist] = useState({ items: [] });

  const parameters = useParams();
  const name = parameters.name;

  const navigate = useNavigate();

  const loadChecklist = () => {
    getChecklist(props.http, name).then((d) => updateChecklist(d));
  };

  const findItem = (key) => {
    return survey.items
      .map((x) => x.entries)
      .flat()
      .filter((x) => x.key === key)[0];
  };

  const getData = () =>
    convertAndParse(parameters.data) || { surveyName: parameters.name };
  const urlData = getData();

  const updateChecklistValue = (sectionKey, entries, key, value) => {
    const item = findItem(key);
    item.value = value;

    updateChecklist(survey);

    const sectionScore = calculateScore(entries).score;

    const newKeyValue = Object.assign({}, urlData, {
      [key]: value,
      [createSectionKey(sectionKey)]: sectionScore,
    });

    navigate(convertForUrl(newKeyValue), { replace: false });
  };

  useEffect(loadChecklist, []);

  const getValue = (k) => {
    return urlData[k];
  };

  return (
    <div>
      <div data-header>
        <h1 data-survey-title>{parameters.name}</h1>
        <div data-actions>
          <button type="button" onClick={() => exportData(getData)}>
            Export Data
          </button>
        </div>
      </div>
      <div>
        {(survey.items || []).map((x) =>
          createSection(x, updateChecklistValue, getValue, createSectionKey)
        )}
      </div>
    </div>
  );
}

function calculateScore(entries) {
  return entries.reduce(
    (s, c) => {
      if (!s.continue) {
        return s;
      }
      const continueProcess = s.continue && c.value == "yes";

      return {
        score: continueProcess ? s.score : c.score,
        continue: continueProcess,
      };
    },
    { current: null, continue: true }
  );
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

function generateHash(key) {
  var hash = 0,
    i,
    chr;
  if (key.length === 0) return hash;
  for (i = 0; i < key.length; i++) {
    chr = key.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function createSection(
  { name, section, entries, key },
  update,
  getValue,
  createSectionKey
) {
  const updateSection = (entryKey, value) => {
    return update(key, entries, entryKey, value);
  };

  const score = getValue(createSectionKey(key));
  const sectionKey = createSectionKey(key);

  return (
    <section data-section-wrapper>
      <div data-name="name" key={`name-${name}`}>
        <h2>{section}</h2>
        <div data-section-score>
          {score} - {sectionKey}
        </div>
      </div>
      <div data-name="section" key={"score-" + sectionKey}>
        {score}
      </div>
      <section key={sectionKey}>
        {entries.map((x) => createEntry(x, updateSection, getValue))}
      </section>
    </section>
  );
}

function createEntry(entry, update, getValue) {
  const { descriptor, key, score } = entry;

  const updateEvent = (e) => {
    const value = e.target.value;
    entry.value = value;
    update(key, value);
  };

  const value = getValue(key);

  return (
    <div data-entry data-value={score}>
      <div data-entry-description>{descriptor}</div>
      <div data-entry-value>
        <label data-input-value="no">
          <input
            type="radio"
            name={key}
            value={null}
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
