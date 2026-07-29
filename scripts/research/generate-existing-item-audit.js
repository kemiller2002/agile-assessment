const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "../..");
const source = path.join(
  root,
  "agile-scorecard/public/surveys/agile-assessment-v2.json"
);
const output = path.join(root, "docs/research/existing-item-audit.csv");
const survey = JSON.parse(fs.readFileSync(source, "utf8"));

const practiceTerms = /\b(scrum|sprint|standup|backlog|user stor|pair programming|velocity|t-shaped|working agreement|information radiator|story point|definition of done)\b/i;
const vagueTerms = /\b(effective|effectively|good|strong|significant|frequent|frequently|often|generally|mostly|realistic|appropriate|valuable|well[- ]|as needed|highly|true)\b/i;
const doubleTerms = /\b(and|or|including|as well as|while)\b/i;
const metricTerms = /\b(cycle time|lead time|deploy|defect|failure|recovery|build|test|coverage|availability|incident|customer|business value|outcome)\b/i;
const absoluteTerms = /\b(all|always|never|everyone|only|zero)\b/i;

function quote(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll('"', '""')}"`;
}

function disposition(text) {
  if (practiceTerms.test(text)) return "remove-or-rewrite";
  if (vagueTerms.test(text) || doubleTerms.test(text)) return "split-or-operationalize";
  if (metricTerms.test(text)) return "retain-as-evidence-prompt";
  return "rewrite";
}

function assumption(text) {
  if (practiceTerms.test(text))
    return "Assumes this named Agile practice is universally desirable and belongs on a linear maturity path.";
  if (metricTerms.test(text))
    return "Assumes respondents can accurately report the operational condition without a defined window or data source.";
  return "Assumes endorsement of this statement represents organizational capability.";
}

function ambiguity(text) {
  const issues = [];
  if (vagueTerms.test(text)) issues.push("undefined evaluative or frequency term");
  if (doubleTerms.test(text)) issues.push("potentially compound statement");
  if (absoluteTerms.test(text)) issues.push("absolute wording");
  if (!/\b(last|past|within|per |days?|weeks?|months?|percent|%)\b/i.test(text))
    issues.push("no explicit recall window or threshold");
  return issues.length ? issues.join("; ") : "limited lexical ambiguity; context still unspecified";
}

function evidence(text) {
  if (metricTerms.test(text))
    return "Verify with telemetry, records, or a sampled artifact; define product/service and time window.";
  if (practiceTerms.test(text))
    return "Do not score the practice itself; ask what constraint it addresses and verify the resulting outcome.";
  return "Triangulate anonymous role-stratified responses with an artifact, event sample, or operational measure.";
}

const header = [
  "item_id", "section", "legacy_score", "statement", "disposition",
  "embedded_assumption", "ambiguity_and_bias", "gaming_risk",
  "role_or_culture_risk", "required_evidence"
];
const rows = [header.map(quote).join(",")];
let id = 0;
for (const section of survey.items) {
  for (const entry of section.entries) {
    id += 1;
    const text = entry.descriptor;
    rows.push([
      `L${String(id).padStart(3, "0")}`,
      section.section,
      entry.score,
      text,
      disposition(text),
      assumption(text),
      ambiguity(text),
      practiceTerms.test(text) || vagueTerms.test(text) ? "high" : "medium",
      "Likely executive/engineer information asymmetry; terminology and candor may vary by hierarchy and culture.",
      evidence(text)
    ].map(quote).join(","));
  }
}

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, `${rows.join("\n")}\n`);
console.log(`Wrote ${id} audited items to ${output}`);
