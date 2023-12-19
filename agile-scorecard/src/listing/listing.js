import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
function AssessmentList({ assessment }) {
  const list = assessment || [];
  return (
    <div>
      <div>
        <h2>Create Single Assessment Instance</h2>
        <ol>
          {list.map((l) => (
            <li>
              <Link to={`survey/${l.file}`}> {l.name}</Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>Create Link for 360 Assessment use</h2>
        <ol>
          {list.map((l) => (
            <li>
              <Link to={`create-instance/${l.file}`}> {l.name}</Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
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
        <Link to="graph">Create Dashboard</Link>
      </div>
      <div key="title" className="listing-title">
        Surveys
      </div>
      <nav>
        <AssessmentList assessment={assessments}></AssessmentList>
      </nav>
    </div>
  );
}
