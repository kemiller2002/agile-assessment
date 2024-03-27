const fs = require("fs");
const path = require("path");

function reducer(s, i) {
  return i(s);
}

const input = path.join(
  ...[
    __dirname,
    ..."../../agile-scorecard/public/surveys/agile-assessment-distributed-v1.json".split(
      "/"
    ),
  ]
);

const output = input.replace(".json", ".test.json");

const calibrationQuestions = ["4:12", "5:2", "0:1", "25:0", "6:14"];

function write(path, file) {
  fs.writeFileSync(path, file);

  return file;
}

function load(file) {
  return [(f) => fs.readFileSync(f, { encoding: "utf-8" }), JSON.parse].reduce(
    reducer,
    file
  );
}

function updateItem(item) {
  return { ...item, entries: item.entries.map(updateEntry) };
}

function updateEntry(entry) {
  return {
    ...entry,
    options: entry.score === -1 ? "likert5Reversed" : "likert5",
    calibration: calibrationQuestions.includes(entry.id),
    score: 0,
  };
}

function update(document) {
  return [
    (document) => ({ ...document, items: document.items.map(updateItem) }),
    (document) => ({ ...document, scores: { show: false } }),
  ].reduce(reducer, document);
}

function run(input, output) {
  [load, update, JSON.stringify, (f) => write(output, f)].reduce(
    reducer,
    input
  );
}

run(input, output);
