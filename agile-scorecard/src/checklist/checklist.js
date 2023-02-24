import React, { useState, useEffect } from "react";
import { useParams, useResolvedPath } from "react-router-dom";
function getChecklist({ get }, fileName) {
  return get(`surveys/${fileName}`).then((x) => x.data);
}

export default function Checklist(props) {
  const [survey, updateChecklist] = useState({ items: [] });
  const { name } = useParams();

  const loadChecklist = () => {
    getChecklist(props.http, name).then((d) => updateChecklist(d));
  };

  const updateChecklistValue = (key, value) => console.log(value);

  useEffect(loadChecklist, []);

  return (survey.items || []).map((x) =>
    createSection(x, updateChecklistValue)
  );
}

function createSection({ name, descriptor, entries }, update) {
  return (
    <section>
      <div data-name="name">{name}</div>
      <div data-name="section">{descriptor}</div>
      <section>{entries.map((x) => createEntry(x, update))}</section>
    </section>
  );
}

function createEntry({ descriptor, value, key }, update) {
  const updateEvent = (e) => update(key, e.target.value);
  return (
    <div data-entry>
      <div data-entry-description>{descriptor}</div>
      <div data-entry-value>
        <label>
          No
          <input
            type="radio"
            name={key}
            value="no"
            onChange={updateEvent}
          ></input>
        </label>
        <label>
          In Progress
          <input
            type="radio"
            name={key}
            value="in-progress"
            onChange={updateEvent}
          ></input>
        </label>
        <label>
          Yes
          <input
            type="radio"
            name={key}
            value="yes"
            onChange={updateEvent}
          ></input>
        </label>
      </div>
    </div>
  );
}
