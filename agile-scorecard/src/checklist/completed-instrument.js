import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { Link } from "react-router-dom";
import { calculateMetrics, convertAndParse } from "./instrument";
import { getInstrument } from "../utilities/surveyData";
import "./css/completed-instrument.css";

export function buildUrl(reactLocation, window) {
  const parts = reactLocation.pathname.split("/");
  const linkUrlPathName = reactLocation.pathname.replace(parts[1], "survey");
  const regex = new RegExp(`/${parts[1]}.*`);
  const location = window.location;
  const newPath = location.pathname.replace(regex, linkUrlPathName);

  return `${location.protocol}//${location.host}${newPath}`;
}

function getAssessmentSummary(data, scoredSurvey) {
  const sectionScores = scoredSurvey
    ? scoredSurvey.items.map((section) => section.score)
    : Object.entries(data)
        .filter(
          ([key, value]) =>
            key.startsWith("section-") && Number.isFinite(value)
        )
        .map(([, value]) => value);
  const answeredCount = Object.keys(data).filter((key) =>
    /^\d+:\d+$/.test(key)
  ).length;
  const totalScore = sectionScores.reduce((total, score) => total + score, 0);

  return {
    answeredCount,
    sectionCount: sectionScores.length,
    totalScore,
    hasScore: sectionScores.length > 0,
  };
}

export function CompletedInstrument({ http }) {
  const location = useLocation();
  const parameters = useParams();
  const [copyStatus, setCopyStatus] = useState("idle");
  const [scoredSurvey, setScoredSurvey] = useState(null);
  const [scoreStatus, setScoreStatus] = useState("loading");
  const urlToSend = buildUrl(location, window);
  const data = convertAndParse(parameters.data) || {};
  const administrator = data.administrator || "the assessment administrator";
  const target = data.team || "Assessment target not provided";
  const date = data.assessmentDate || "Date not provided";
  const summary = getAssessmentSummary(data, scoredSurvey);

  useEffect(() => {
    let active = true;

    getInstrument(http, parameters.name)
      .then((survey) => calculateMetrics(survey, (key) => data[key]))
      .then((survey) => {
        if (active) {
          setScoredSurvey(survey);
          setScoreStatus("ready");
        }
      })
      .catch(() => {
        if (active) {
          setScoreStatus("error");
        }
      });

    return () => {
      active = false;
    };
  }, [http, parameters.name, parameters.data]);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(urlToSend);
      setCopyStatus("copied");
    } catch {
      setCopyStatus("error");
    }
  }

  return (
    <main data-processing-page>
      <header data-processing-header>
        <p data-processing-eyebrow>Assessment complete</p>
        <h1>Prepare for processing</h1>
        <p>
          Review the assessment summary, then share the secure assessment link
          with {administrator}.
        </p>
      </header>

      <section data-processing-summary aria-labelledby="summary-heading">
        <div data-processing-summary-heading>
          <div>
            <p data-processing-eyebrow>Completion summary</p>
            <h2 id="summary-heading">Ready for review</h2>
          </div>
          <span data-processing-status>
            <span aria-hidden="true" />
            Responses saved
          </span>
        </div>

        <dl data-processing-metrics>
          <div data-score-metric>
            <dt>Legacy total score</dt>
            <dd>
              {scoreStatus === "loading" && "…"}
              {scoreStatus === "ready" &&
                (summary.hasScore ? summary.totalScore : "—")}
              {scoreStatus === "error" && "Unavailable"}
            </dd>
          </div>
          <div>
            <dt>Statements answered</dt>
            <dd>{summary.answeredCount}</dd>
          </div>
          <div>
            <dt>Sections scored</dt>
            <dd>{summary.sectionCount}</dd>
          </div>
        </dl>

        <p data-score-caveat>
          The total is the instrument’s existing section-score sum. Treat it as
          a directional signal—not a validated maturity grade or a comparison
          between teams.
        </p>

        <dl data-processing-context>
          <div>
            <dt>Assessment target</dt>
            <dd>{target}</dd>
          </div>
          <div>
            <dt>Assessment date</dt>
            <dd>{date}</dd>
          </div>
          <div>
            <dt>Send to</dt>
            <dd>{administrator}</dd>
          </div>
        </dl>
      </section>

      <section data-share-panel aria-labelledby="share-heading">
        <div>
          <p data-processing-eyebrow>Next step</p>
          <h2 id="share-heading">Share the assessment link</h2>
          <p>
            Anyone with this link can access the encoded responses. Send it
            only through an appropriate private channel.
          </p>
        </div>

        <label data-share-url>
          <span>Assessment link</span>
          <textarea value={urlToSend} readOnly rows="4" />
        </label>

        <div data-share-actions>
          <button data-copy-url type="button" onClick={copyUrl}>
            {copyStatus === "copied" ? "Link copied" : "Copy assessment link"}
          </button>
          <span role="status" aria-live="polite">
            {copyStatus === "copied" && "Copied to clipboard."}
            {copyStatus === "error" &&
              "Could not copy automatically. Select and copy the link above."}
          </span>
        </div>
      </section>

      <footer data-processing-footer>
        <div>
          <strong>Need to change an answer?</strong>
          <span>Your saved responses will remain available.</span>
        </div>
        <Link
          to={`/survey/${parameters.name}/${parameters.data}`}
          data-return-to-survey-link="true"
        >
          Return to assessment
        </Link>
      </footer>
    </main>
  );
}
