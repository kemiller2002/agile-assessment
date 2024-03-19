const fs = require("fs");
const path = require("path");

function reducer(s, i) {
  return i(s);
}

const input = path.join(
  ...[
    __dirname,
    ..."../../agile-scorecard/public/surveys/agile-assessment-randomized-v1.json".split(
      "/"
    ),
  ]
);

function write(path, file) {
  fs.writeSync(file);

  return file;
}

function load(file) {
  return [(f) => fs.readFileSync(f, { encoding: "utf-8" }), JSON.parse].reduce(
    reducer,
    file
  );
}

function updateItems(items) {
  return items.map((i) => ({ ...i, entries: item.entries.map(updateEntry) }));
}

function updateEntry(entry) {
  return {
    ...entry,
    options: e.score === -1 ? "likert5Reversed" : "likert5",
  };
}

function update(document) {
  [(x) => x.items, updateItems, (i) => ({ ...document, items: i })].reduce(
    reducer,
    document
  );
}

function run(input, output) {
  [load, update, (f) => write(output, f)].reduce(reducer, input);
}

run(input, input);
