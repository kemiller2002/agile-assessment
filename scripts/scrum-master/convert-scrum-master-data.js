const path = require("path");
const fs = require("fs");

function loadFile(fileName) {
  return fs.readFileSync(fileName, { encoding: "utf-8" });
}

function reducer(s, i) {
  return i(s);
}

function createEntry(line) {
  return [
    (x) => ({ line, parts: x.split(":") }),
    (x) => ({
      line,
      section: x.parts[0].trim(),
      descriptionText: x.parts[1].trim(),
    }),
  ].reduce(reducer, line);
}

function createEntries(lines) {
  return lines.map(createEntry);
}

function split(data) {
  return data.split("\n");
}

function removeEmptyEntries(lines) {
  return lines.filter((x) => x.trim() !== "");
}

function write(file, data) {
  [(x) => JSON.stringify(x), (x) => fs.writeFileSync(file, x)].reduce(
    reducer,
    data
  );
}
function splitDescriptions(entries) {
  return entries.map((entry) => ({
    ...entry,
    descriptions: entry.descriptionText.split(","),
  }));
}
function run(input, output) {
  [
    loadFile,
    split,
    removeEmptyEntries,
    createEntries,
    splitDescriptions,
    (d) => write(output, d),
  ].reduce(reducer, input);
}

const input = path.join(__dirname, "data", "scrum-master-data.txt");
const logFolder = path.join(__dirname, "data", "outputs");
const output = path.join(logFolder, "data.json");

run(input, output);
