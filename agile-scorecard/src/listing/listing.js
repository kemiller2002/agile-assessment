import React, { useState, componentDidMount, useEffect } from "react";

let count = 0;

function AssessmentList({ assessment }) {
  const list = assessment || [];
  return (
    <ol>
      {list.map((l) => (
        <li>
          <a href={`survey/${l.file}`} key={l.file}>
            {l.name}
          </a>
        </li>
      ))}
    </ol>
  );
}

function getAssessments({ get }, assessmentUrl) {
  return get(assessmentUrl).then((x) => x.data);
}

export default function Listing(props) {
  const [assessments, setAssessments] = useState([]);
  const mountAssessments = () => {
    getAssessments(props.http, props.surveyListUrl).then((x) =>
      setAssessments(x)
    );
  };

  useEffect(mountAssessments, []);

  return (
    <div key="base">
      <div key="title" className="listing-title">
        Surveys
      </div>
      <nav>
        <AssessmentList assessment={assessments}></AssessmentList>
      </nav>
    </div>
  );
}
