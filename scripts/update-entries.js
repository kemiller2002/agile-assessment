const fs = require("fs");

function run(filePath, inFileName, outFileName) {
  const inFile = `${filePath}${inFileName}`;
  const outFile = `${filePath}${outFileName}`;

  const data = fs.readFileSync(inFile, { encoding: "utf-8" });

  const runSteps = [
    cleanDailyStandupEntry,
    cleanEntryDescription,
    removeNoiseDataFromEntries,
    runAddCreateEntryAndScore,
    runCleanEntryData,
    handleLevelEntries,
    addIdentifier,
    addMetaData,
  ];

  const runner = (state, item) => {
    const data = item(state);

    const fnName = /function\s+([a-zA-Z]+)\s*.*/.exec(item.toString())[1];

    fs.writeFileSync(`${filePath}${fnName}.json`, JSON.stringify(data));

    return data;
  };

  const input = JSON.parse(data);

  const finalData = runSteps.reduce(runner, input);

  fs.writeFileSync(outFile, JSON.stringify(finalData));
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

function updateEntryToHaveIdentifier(entry) {
  const updateEntry = (e, section) => {
    return Object.assign({}, e, { key: generateHash(section + e.descriptor) });
  };

  return Object.assign({}, entry, {
    key: generateHash(entry.section),
    entries: entry.entries.map((e) => updateEntry(e, entry.section)),
  });
}

function addIdentifier(input) {
  return input.map((x) => updateEntryToHaveIdentifier(x));
}

function addMetaData(input) {
  return {
    name: "Ren Agile Survey V1",
    items: input,
  };
}

function runCleanEntryData(input) {
  return input;
}

function transformToSection({ section, descriptor, entries }) {
  return {
    section,
    descriptor,
    number: -1,
    entries,
  };
}

function cleanDailyStandupEntry(input) {
  const standup = input.find((x) => x.section === "Daily Standup");
  if (!standup) return input;

  const sectionKeys = Object.keys(standup).filter((k) =>
    k.includes("section-")
  );

  const movedEntries = sectionKeys
    .map((k) => standup[k])
    .map((k) => transformToSection(k));

  return [...input, ...movedEntries];
}

function handleLevelEntries(input) {
  const fixLevels = (l) => {
    return l.entries.map((e) => ({ score: l.number, display: e }));
  };

  const updateInput = (input) => {
    const fixedLevels = (input.levels || []).map(fixLevels);

    return Object.assign({}, input, {
      entries: [...input.entries.entries, ...fixedLevels],
    });
  };

  return input.map(updateInput);
}

function cleanString(input) {
  return input
    .replace("– TEST THIS", ".")
    .replace(/[“”]/g, '"')
    .replace(/’/g, "'")
    .replace(/–/g, "-");
}

function cleanEntryDescription(input) {
  const entries = input;

  const cleanDescription = (e) =>
    Object.assign({}, e, {
      descriptor: cleanString(e.descriptor),
      entries: e.entries.map((x) => cleanString(x)),
    });

  return [...entries.map(cleanDescription)];
}

function removeNoiseDataFromEntries(input) {
  const filterItems = "~,88,4,44".split(",");
  const filterEntries = (x) => !(filterItems.includes(x) || x == "");

  return input.map((x) =>
    Object.assign({}, x, { entries: x.entries.filter(filterEntries) })
  );
}

function runAddCreateEntryAndScore(input) {
  const updatedData = input.map((x) =>
    Object.assign({}, x, { entries: changeEntry(x) })
  );

  return updatedData;
}

function changeEntry(section) {
  const convert = (state, entry) => {
    const scrubbedEntry = (entry || "").trim();
    const values = "-1,0,1,2,3,4".split(",");

    if (values.includes(scrubbedEntry)) {
      return Object.assign({}, state, { score: entry });
    }

    return Object.assign({}, state, {
      entries: [
        ...state.entries,
        { score: parseInt(state.score || "-1", 10), descriptor: entry },
      ],
    });
  };

  return (section.entries || []).reduce(convert, { value: -1, entries: [] });
}

function testPath(i, o) {
  console.log(i, o);
}

run(
  `${__dirname}/../in-progress-data/`,
  `data.json`,
  `../agile-scorecard/public/surveys/agile-assessment-v1.json`
);
