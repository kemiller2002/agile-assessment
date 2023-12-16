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

function convertToAssessmentObject(entries) {
  return entries.map((x) => ({
    section: x.section,
    entries: x.descriptions.map((y) => ({
      score: 0,
      descriptor: y,
      key: btoa(y),
      id: "x:y",
      options: "likert10",
    })),
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
    (d) => write(output, d),
  ].reduce((s, i, p) => reducerLogger(s, i, p, "run"), input);
}

function reducerLogger(s, i, p) {
  return reducer(s, i);
}

const input = path.join(__dirname, "data", "outputs", "data-massaged.json");
const logFolder = path.join(__dirname, "data", "outputs");
const output = path.join(logFolder, "scrum-master-360-v1.json");

/*
    Fix key, make hash

*/

run(input, output);
