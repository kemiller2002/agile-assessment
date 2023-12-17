const path = require("path");
const fs = require("fs");

function loadFile(fileName) {
  return fs.readFileSync(fileName, { encoding: "utf-8" });
}

function reducer(s, i) {
  return i(s);
}

function write(file, data) {
  [(x) => JSON.stringify(x), (x) => fs.writeFileSync(file, x)].reduce(
    reducer,
    data
  );
}

function parseData(data) {
  return JSON.parse(data);
}

function addSectionIds(entries) {
  return entries.reduce((s, i, p) => {
    return [...s, { ...i, sectionId: p.toString() }];
  }, []);
}

function addItemIdToItem(sectionId, itemIndexId, item) {
  return { ...item, id: `${sectionId}:${itemIndexId}` };
}

function addItemIdsToItems(section) {
  return {
    ...section,
    entries: section.entries.map((x, i) =>
      addItemIdToItem(section.sectionId, i, x)
    ),
  };
}

function addItemIds(sections) {
  return sections.map(addItemIdsToItems);
}

function addPeriod(description) {
  return description[description.length - 1] === "."
    ? description
    : `${description}.`;
}

function createEntriesFromDescription(description) {
  return [
    addPeriod,
    (y) => ({
      score: 0,
      descriptor: y,
      key: generateHash(y),
      id: "x:y",
      options: "likert5",
    }),
  ].reduce(reducer, description);
}

function convertToAssessmentObject(entries) {
  return entries.map((x) => ({
    section: x.section,
    descriptor: "",
    number: -1,
    entries: x.descriptions.map(createEntriesFromDescription),
  }));
}

function addContainer(items) {
  return { name: "Scrum Master 360 V1", items };
}

function run(input, output) {
  [
    loadFile,
    parseData,
    convertToAssessmentObject,
    addSectionIds,
    addItemIds,
    addContainer,
    addLikertKey,
    (d) => write(output, d),
  ].reduce((s, i, p) => reducerLogger(s, i, p, "run"), input);
}

function reducerLogger(s, i, p) {
  return reducer(s, i);
}

function generateHash(input) {
  var hash = 0,
    i,
    chr;
  if (input.length === 0) return hash;
  for (i = 0; i < input.length; i++) {
    chr = input.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
}

function addLikertKey(container) {
  return {
    ...container,
    sectionScoreDefault: 0,
    answerKeys: {
      likert5: {
        0: "Never",
        1: "Rarely",
        2: "Sometimes",
        3: "Often",
        4: "Always",
      },
    },
  };
}

const input = path.join(__dirname, "data", "outputs", "data-massaged.json");
const logFolder = path.join(__dirname, "data", "outputs");

const output = path.join(
  __dirname,
  "..",
  "..",
  "agile-scorecard",
  "public",
  "surveys",
  "scrum-master-360-v1.json"
);

run(input, output);
