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
        <h2>Create Link for Comparative Assessment</h2>
        <ol>
          {list.map((l) => (
            <li>
              <Link to={`create-instance/${l.file}`}> {l.name}</Link>
            </li>
          ))}
        </ol>
      </div>
      <div>
        <h2>Create reporting instance</h2>
        <ol>
          <li>
            <Link to="360">360 Review</Link>
          </li>
          <li>
            <Link to="graph">Time Comparison</Link>
          </li>
        </ol>
      </div>
      <div>
        <h2>Create Assessment Instances For Distributed Questions</h2>
        <ol>
          {list.map((l) => (
            <li>
              <Link to={`distribute/${l.file}`}> {l.name}</Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function getInstruments({ get }, instrumentListUrl) {
  return get(instrumentListUrl).then((x) => x.data);
}

export default function Listing(props) {
  const [instruments, setInstruments] = useState([]);
  const mountInstruments = () => {
    getInstruments(props.http, props.instrumentListUrl).then((x) =>
      setInstruments(x)
    );
  };

  useEffect(mountInstruments, []);

  return (
    <div key="base" class="survey-list-container">
      <nav>
        <AssessmentList assessment={instruments}></AssessmentList>
      </nav>
    </div>
  );
}
