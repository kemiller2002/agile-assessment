import React from "react";
import { Link } from "react-router-dom";
import surveyList from "./survey-list.json";

const groupMeta = {
  "Agile Foundations": {
    eyebrow: "Whole-team view",
    description:
      "Explore broad delivery-system signals across product, engineering, and team practices.",
  },
  "Leadership & Culture": {
    eyebrow: "Working environment",
    description:
      "Examine leadership conditions, information flow, and psychological safety.",
  },
  "Delivery & Technical Practices": {
    eyebrow: "Focused diagnostic",
    description:
      "Investigate a specific capability such as technical delivery, customer learning, or distributed work.",
  },
  "Role-Based 360 Feedback": {
    eyebrow: "Multi-rater feedback",
    description:
      "Collect perspectives from several collaborators around a defined role.",
  },
};

function instrumentDescription(title) {
  const descriptions = {
    "Core Agile Assessment (v1)": "Legacy baseline retained for comparison.",
    "Core Agile Assessment (v2)":
      "Comprehensive legacy instrument; use for exploration, not validated maturity scoring.",
    "Scaled Agile Alignment":
      "Explore coordination and alignment across multiple teams.",
    "Psychological Safety":
      "Reflect on speaking up, learning from mistakes, and interpersonal risk.",
    "Agile Leadership & Management":
      "Explore leadership behaviors and the conditions surrounding team decisions.",
    "Technical Agility Maturity":
      "Review engineering feedback, quality, automation, and delivery practices.",
    "Customer-Centric Agility":
      "Explore customer evidence, product learning, and feedback loops.",
    "UX Integration in Agile":
      "Review how discovery and experience design connect to delivery.",
    "Remote Agility Maturity":
      "Explore information access and coordination in distributed work.",
    "Scrum Master 360":
      "Gather role-based feedback from multiple collaborators.",
  };

  return descriptions[title] || "Explore this assessment.";
}

export function SurveyDashboard() {
  return (
    <main className="assessment-home">
      <header className="home-hero">
        <div className="home-hero__content">
          <p className="eyebrow">Agile Assessment</p>
          <h1>Find the constraint. Choose the next useful conversation.</h1>
          <p className="hero-summary">
            Explore diagnostic instruments for teams and leaders. Results are
            prompts for inquiry—not a grade, ranking, or proof of maturity.
          </p>
          <nav className="hero-actions" aria-label="Primary actions">
            <a className="button button--primary" href="#instruments">
              Browse instruments
            </a>
            <Link className="button button--secondary" to="/360">
              Compare perspectives
            </Link>
          </nav>
        </div>
        <aside className="principle-note" aria-label="How to use results">
          <span className="principle-note__mark" aria-hidden="true">
            ↗
          </span>
          <div>
            <h2>Use evidence, not ceremony</h2>
            <p>
              Pair perceptions with delivery, customer, quality, and
              operational evidence before deciding what to change.
            </p>
          </div>
        </aside>
      </header>

      <section className="instrument-library" id="instruments">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Instrument library</p>
            <h2>What do you need to understand?</h2>
          </div>
          <p>
            Start broad only when the problem is unclear. A focused instrument
            reduces effort and produces a more useful discussion.
          </p>
        </div>

        <div className="instrument-groups">
          {surveyList.map((group, index) => {
            const meta = groupMeta[group.name];
            return (
              <details className="instrument-group" open={index === 0} key={group.name}>
                <summary>
                  <span className="group-index" aria-hidden="true">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="group-summary">
                    <span className="eyebrow">{meta.eyebrow}</span>
                    <span className="group-title">{group.name}</span>
                    <span className="group-description">{meta.description}</span>
                  </span>
                  <span className="group-count">
                    {group.assessments.length}{" "}
                    {group.assessments.length === 1 ? "instrument" : "instruments"}
                  </span>
                  <span className="disclosure-icon" aria-hidden="true" />
                </summary>

                <div className="instrument-list">
                  {group.assessments.map((assessment) => (
                    <article className="instrument-row" key={assessment.filename}>
                      <div className="instrument-row__number" aria-hidden="true">
                        {String(group.assessments.indexOf(assessment) + 1).padStart(
                          2,
                          "0"
                        )}
                      </div>
                      <div className="instrument-row__content">
                        <h3>{assessment.title}</h3>
                        <p>{instrumentDescription(assessment.title)}</p>
                        <span className="instrument-status">
                          Research instrument
                        </span>
                      </div>
                      <div className="instrument-row__actions">
                        <Link
                          className="button button--primary"
                          to={`/survey/${assessment.filename}`}
                        >
                          Start
                        </Link>
                        <Link
                          className="text-link"
                          to={`/create-instance/${assessment.filename}`}
                        >
                          Create group assessment
                          <span aria-hidden="true"> →</span>
                        </Link>
                      </div>
                    </article>
                  ))}
                </div>
              </details>
            );
          })}
        </div>
      </section>

      <footer className="home-footer">
        <p>
          Research prototype <span aria-hidden="true">•</span> Do not use for
          individual performance decisions
        </p>
        <a href="#instruments">Back to instruments ↑</a>
      </footer>
    </main>
  );
}
