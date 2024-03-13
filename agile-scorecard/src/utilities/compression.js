import React, { useState, useEffect } from "react";
import LZString from "lz-string";
import { getInstrument as getSurvey } from "./surveyData";

export function compress(data) {
  return LZString.compressToEncodedURIComponent(data);
}

export function decompress(data) {
  return LZString.decompressFromEncodedURIComponent(data);
}

function convert(data) {
  const cData = compress(data);
  return this.updateCompressed(cData);
}

function lookupAndChangeToId(survey, data) {
  const entriesObject = survey.items
    .map((x) => x.entries)
    .flat()
    .reduce((s, c) => Object.assign({}, s, { [c.key]: c.id }), {});

  const dataWithId = Reflect.ownKeys(data).reduce((s, c) => {
    const id = entriesObject[c];
    const propertyName = id || c;

    return Object.assign({}, s, { [propertyName]: data[c] });
  }, {});

  return { survey, data: dataWithId };
}

function convertAnswer({ survey, data }) {
  const lookupValue = (v) => {
    switch (v.toUpperCase()) {
      case "YES":
        return 2;
      case "IN-PROGRESS":
        return 1;
      case "NO":
        return 0;
      default:
        return v;
    }
  };

  return Reflect.ownKeys(data).reduce((s, c) => {
    return Object.assign({}, s, { [c]: lookupValue(data[c]) });
  }, {});
}

function convertToId(surveyName, data) {
  const surveyPromise = getSurvey(this.http, surveyName);

  return surveyPromise
    .then((s) => lookupAndChangeToId(s, data))
    .then((x) => convertAnswer(x))
    .then((x) => {
      console.log(x);
      return x;
    });
}

function convertEvent(urlData) {
  const http = this.http;
  const makePromise = (f) => (p) => p.then((x) => f(x));

  const separatedData = (u) => u.split("/").reverse()[0];
  const convertToString = (d) => JSON.stringify(d);
  const convertToStringPromise = makePromise(convertToString);

  const decode = (d) => atob(d);
  const parse = (d) => JSON.parse(d);
  const runCompression = (d) => this.convert(d);
  const runCompressionWithPromise = makePromise(runCompression);

  const convertToIdWithState = (d) =>
    convertToId.apply({ http, getSurvey }, ["agile-assessment-v1.json", d]);

  const log = (d) => {
    console.log(d);
    return d;
  };

  const actions = [
    separatedData,
    decode,
    parse,
    convertToIdWithState,
    convertToStringPromise,
    runCompressionWithPromise,
  ];

  actions.reduce((s, c) => c(s), urlData);
}

function updateDataStore(e) {
  this.updateUrlData(e.target.value);
}

export function Compression({ http }) {
  const testData = `https://kemiller2002.github.io/agile-assessment/survey/agile-assessment-v1.json/eyIxOTM3MjA4NiI6InllcyIsIjIxMjE2NjEwIjoieWVzIiwiMjI0MDY0MTIiOiJ5ZXMiLCIzNDk1MTI3NiI6InllcyIsIjQxNTg1ODMwIjoieWVzIiwiODAwMjMwODkiOiJ5ZXMiLCIxMTE1MDEzMzgiOiJ5ZXMiLCIxMTQzOTQzOTUiOiJ5ZXMiLCIxMjE2MTAyNzIiOiJ5ZXMiLCIxMjczNzgxMjMiOiJ5ZXMiLCIxMzQ0MDc3NTQiOiJ5ZXMiLCIxNjEwNjQ3NzUiOiJ5ZXMiLCIxNjM2MzA0NTQiOiJ5ZXMiLCIyMDIwMjI2NzUiOiJ5ZXMiLCIyMDU2NzQyNzUiOiJ5ZXMiLCIyMDgwODIxODIiOiJ5ZXMiLCIyNDA3Mzk2OTQiOiJ5ZXMiLCIyNDQ0NDM4NTEiOiJ5ZXMiLCIyNDc1NjkxMDAiOiJ5ZXMiLCIyNDc2NTUyOTMiOiJpbi1wcm9ncmVzcyIsIjI3NzI1OTE1MiI6InllcyIsIjMyNDc5NTA5MSI6InllcyIsIjM4ODkxNzczNiI6InllcyIsIjQwNzA4OTg5MyI6InllcyIsIjQxMjc3ODg5NiI6InllcyIsIjQxMjg4MDkyNSI6InllcyIsIjQyNzUzMjY4OCI6InllcyIsIjQzNzkyMDU5NCI6InllcyIsIjQ1MzMxMjYyMiI6InllcyIsIjQ1MzUwMjYzOSI6InllcyIsIjQ3ODMwMjMzNiI6InllcyIsIjQ4NTQwMDQ4OSI6InllcyIsIjUwMzA2ODI3MCI6InllcyIsIjUxMjk4ODg2MSI6InllcyIsIjUxMzk5NTczOCI6InllcyIsIjUxNjUwNjU3NyI6InllcyIsIjUyOTM0Mjk2MSI6InllcyIsIjYwNDczNzU5OCI6InllcyIsIjYwODcwMzUxMCI6InllcyIsIjYxNTM3MjY4NSI6InllcyIsIjYzNDU5NjEyMCI6InllcyIsIjYzOTE4MzE4OSI6InllcyIsIjY3Mzk2MTk1OCI6InllcyIsIjY3ODA5MjE5NSI6InllcyIsIjY4MDY3MDY3NCI6InllcyIsIjcyMzU3ODk2MiI6InllcyIsIjc0NjE4NjMxMiI6InllcyIsIjc1ODgxMDU0OSI6ImluLXByb2dyZXNzIiwiNzY5MzU4NjA2IjoieWVzIiwiNzgwNDU3NjE2IjoiaW4tcHJvZ3Jlc3MiLCI3ODQ4MzEwNTEiOiJ5ZXMiLCI3ODc3NjUzMjgiOiJ5ZXMiLCI3OTQ3MDk4ODEiOiJ5ZXMiLCI3OTY4ODI2MTYiOiJ5ZXMiLCI3OTg4MDc3MTEiOiJ5ZXMiLCI4MDI5NzEzMDEiOiJ5ZXMiLCI4MzY3MzQzNDciOiJ5ZXMiLCI4Njk5Njc4ODkiOiJ5ZXMiLCI4ODk0NTM5NDkiOiJ5ZXMiLCI4OTg5NjAzMTQiOiJ5ZXMiLCI5MDcyMjQ1MjQiOiJ5ZXMiLCI5MTA0OTYwOTEiOiJpbi1wcm9ncmVzcyIsIjkxMDk0Njg5MSI6ImluLXByb2dyZXNzIiwiOTIzMDg3NzY0IjoieWVzIiwiOTQxNTQxNzI3IjoieWVzIiwiOTUyMzM1Njg0IjoieWVzIiwiOTU1NDYzNjQzIjoieWVzIiwiOTY1NzI3MjA0IjoieWVzIiwiOTY5MzA5NzgyIjoieWVzIiwiOTcwNjg5MjU0IjoieWVzIiwiOTc4MDY1NTE4IjoieWVzIiwiOTg2NTAyODMzIjoieWVzIiwiOTkxMTQ5MjYyIjoiaW4tcHJvZ3Jlc3MiLCIxMDE3Nzc5MzMxIjoieWVzIiwiMTA0MTE5OTE0MSI6InllcyIsIjEwNDk3NzQzMTMiOiJ5ZXMiLCIxMDUxODQwNDYwIjoieWVzIiwiMTA1MzIxMjA1MiI6InllcyIsIjEwNTUyNjcxMTAiOiJ5ZXMiLCIxMDY3MTQzMjkzIjoieWVzIiwiMTA2OTgyMDQyNCI6InllcyIsIjEwNzQ3NTA5NDUiOiJ5ZXMiLCIxMDg5NjE2ODkxIjoieWVzIiwiMTEwMjM3NTM1MyI6InllcyIsIjExMTAwNzA5MzgiOiJ5ZXMiLCIxMTExMzM3MzIyIjoieWVzIiwiMTEyOTMxODkzNCI6InllcyIsIjExNDMyNjU1MDEiOiJ5ZXMiLCIxMTUzMDc4OTQ2IjoieWVzIiwiMTE1OTc3MTIxNSI6InllcyIsIjExNzM3Mjg0NDgiOiJ5ZXMiLCIxMTkwMDg1OTk4IjoieWVzIiwiMTE5NjkwOTg3NiI6InllcyIsIjExOTgzNTIxNjUiOiJpbi1wcm9ncmVzcyIsIjEyMDgxNjc5ODIiOiJ5ZXMiLCIxMjY0Mzc2MTQ2IjoieWVzIiwiMTI4Nzg1NjEwOCI6InllcyIsIjEzMTk1MjIzMDYiOiJpbi1wcm9ncmVzcyIsIjEzNjIwMjEyODciOiJ5ZXMiLCIxMzg5MjkzNDQyIjoieWVzIiwiMTM5MzI4ODYxMSI6InllcyIsIjE0MDA3MDExNzgiOiJ5ZXMiLCIxNDIwNzg2NzY5IjoieWVzIiwiMTQ1MjczNzU0MCI6InllcyIsIjE0NjY2MTA2NzIiOiJ5ZXMiLCIxNTQ3NTM0NDM5IjoieWVzIiwiMTU1NjMxNTAyMiI6InllcyIsIjE1NjY5MzIzODYiOiJ5ZXMiLCIxNTg0NTE3Mjg0IjoieWVzIiwiMTYzOTUwOTYzMiI6InllcyIsIjE2NDE1Nzg4NDUiOiJ5ZXMiLCIxNjYxMjk0MDM4IjoieWVzIiwiMTY4NjcyMDk3OCI6InllcyIsIjE2OTQyMzEzNzkiOiJ5ZXMiLCIxNzAzMDIxMDg5IjoieWVzIiwiMTcwNzA2NzQ3MSI6InllcyIsIjE3MTIwMTY2NDIiOiJ5ZXMiLCIxNzIyNjg3MDY3IjoieWVzIiwiMTcyNDQ5NjQzNiI6InllcyIsIjE3MjUzMTU0NTkiOiJ5ZXMiLCIxNzQxNzA0MTY4IjoieWVzIiwiMTc0MzU1NDk5NCI6ImluLXByb2dyZXNzIiwiMTc0NzAzNjQ3MSI6InllcyIsIjE3NTA0NTczOTEiOiJ5ZXMiLCIxNzYzMjQ2NDgyIjoieWVzIiwiMTc2ODc2OTk3MCI6InllcyIsIjE3ODUxNDc4MTIiOiJ5ZXMiLCIxNzg4MTM3NTg1IjoieWVzIiwiMTgwNjM4OTc5MiI6InllcyIsIjE4MjI4Mjk2NTAiOiJpbi1wcm9ncmVzcyIsIjE4NjIzODM3MzEiOiJ5ZXMiLCIxODY4NzMyMzA3IjoieWVzIiwiMTg5NTM3NTAzOCI6InllcyIsIjE5MDEzODAwOTkiOiJ5ZXMiLCIxOTAyODMzMDAwIjoieWVzIiwiMTkwOTA5ODYxOSI6InllcyIsIjE5MjM0Mzg4MTYiOiJ5ZXMiLCIxOTM2NzQwMDk4IjoieWVzIiwiMjAwMzAwNDExNCI6InllcyIsIjIwMDQzNTQwMzUiOiJ5ZXMiLCIyMDA1NDg2NDE2IjoieWVzIiwiMjAzMjUzMzM2NyI6InllcyIsIjIwNDIzNDIyMTciOiJ5ZXMiLCIyMDg3Nzk5OTUzIjoieWVzIiwiMjA5MTI3NjEyMiI6InllcyIsIjIwOTE4MzM0ODEiOiJ5ZXMiLCIyMDk4NjA5NTI2IjoieWVzIiwiMjExMDM3NDYwNSI6InllcyIsIjIxMTUxODg4NTAiOiJ5ZXMiLCIyMTM4Njg2ODEzIjoieWVzIiwiMjE0MTk2ODc4OSI6InllcyIsInN1cnZleU5hbWUiOiJhZ2lsZS1hc3Nlc3NtZW50LXYxLmpzb24iLCJ0ZWFtIjoiZGZ4IiwiYXNzZXNzbWVudERhdGUiOiIyMDIzLTA2LTA5IiwiLTE0NDU4NzU0MjkiOiJ5ZXMiLCItNzQ0NzQ1MjA0IjoieWVzIiwiLTcxNzE4NjM1IjoieWVzIiwiLTE5MjgyNjcwMjYiOiJ5ZXMiLCItMTI0NzY5MDk0OCI6InllcyIsIi04ODk2OTYwOTAiOiJ5ZXMiLCItMjc3NTEyNTgzIjoieWVzIiwiLTE4MzY2MDM4MDkiOiJ5ZXMiLCItMTQ5MDg1NTQ0MCI6InllcyIsIi0xNzczNzczNTM1IjoieWVzIiwiLTE1OTI3MTY2MzAiOiJ5ZXMiLCItMjM0NzE2OTk5IjoieWVzIiwiLTE2OTY2MjI3ODEiOiJ5ZXMiLCItOTcxMTMzMzg2IjoieWVzIiwiLTI0NzA5NTMzOCI6InllcyIsIi0xNzczNTA1MjI4IjoieWVzIiwiLTEyNjQwODUwMTIiOiJ5ZXMiLCItMTY2Mjc1MTk2MyI6InllcyIsIi0xOTc5ODY0MjE3IjoieWVzIiwiLTI3MDc0NjIwOSI6InllcyIsIi0yMDA3Nzk5MTYxIjoieWVzIiwiLTE1NDg4ODk2OSI6InllcyIsIi0yMTI1MzkzODMwIjoieWVzIiwiLTE5NDA1NTg5NTgiOiJ5ZXMiLCItMjA5MjY2MTU5OCI6InllcyIsIi0xMzA5OTU0NDkiOiJ5ZXMiLCItMTk4NjExMTMwNyI6InllcyIsIi0xMzg2ODQyOCI6InllcyIsIi03MjMzMTg2NjYiOiJ5ZXMiLCItMTUyNDk1NTA4OCI6InllcyIsIi0yMTYzODM4NTEiOiJ5ZXMiLCItMjEzMzU0NjA1MCI6InllcyIsIi0xNzM0NzE1ODYiOiJ5ZXMiLCItMTA2Mjk0NjE0NSI6InllcyIsIi0xODA0MDA1MDc2IjoieWVzIiwiLTYyOTk5NTQ3MyI6InllcyIsIi03MTg4OTcyMzAiOiJpbi1wcm9ncmVzcyIsIi0xNTM3NTA3NDk2IjoieWVzIiwiLTIxMzk0OTE3NDAiOiJ5ZXMiLCItMTE5NTg2MDMwIjoieWVzIiwiLTY5MTU2Mjg0MCI6InllcyIsIi0xNTc2OTQ0OTA1IjoieWVzIiwiLTE3MjExNjg5MzQiOiJ5ZXMiLCItMzg0ODYxMzgiOiJ5ZXMiLCItMzc3MjI0MDUzIjoieWVzIiwiLTgzMzQ4MDE2MyI6InllcyIsIi0xODMzNDc3MjM0IjoieWVzIiwiLTI0MTY5MDAzMCI6InllcyIsIi0xMTA3MDI5MzIiOiJ5ZXMiLCItMTM4OTcwMjA1NCI6InllcyIsIi0yODIyMTA1MTIiOiJ5ZXMiLCItMTE4MDAxMzE5NSI6InllcyIsIi0xNDk5MTk0OTI4IjoiaW4tcHJvZ3Jlc3MiLCItOTYzMTE0NjI3IjoieWVzIiwiLTE5NTI3NDQ4NjciOiJ5ZXMiLCItMTA1MTg3MDk3IjoieWVzIiwiLTcyOTM1ODcyMyI6InllcyIsIi05NzYwNDM2MjAiOiJ5ZXMiLCItMTc5Njc5Nzc3MSI6InllcyIsIi0yODgxMDIyODQiOiJ5ZXMiLCItODY5MjI2OTQ0IjoieWVzIiwiLTE4NjkyMDMyNjAiOiJ5ZXMiLCItMTgxMzQ2MDEyIjoieWVzIiwiLTIxMTE0Mzg0MTkiOiJ5ZXMiLCItMTUwNTIzNjk2OSI6InllcyIsIi04NDM3NTIxIjoieWVzIiwiLTE3NDA3MDU5NyI6InllcyIsIi00NzQxNDEzNSI6InllcyIsIi0yNDgwMTQ4MzkiOiJ5ZXMiLCItMTMxNjc1MzYiOiJ5ZXMiLCItMTY5NjQ3NjIyMyI6InllcyIsIi0yMTIwMTM1NDYyIjoiaW4tcHJvZ3Jlc3MiLCItMTYzMzE1NTk3NiI6InllcyIsIi00ODY1Njk1ODQiOiJ5ZXMiLCItMTQ1NTkyNDAxMCI6InllcyIsIi04NDEyNzQ0MDEiOiJ5ZXMiLCItNjgwMDE0NzE0IjoieWVzIiwiLTQ5NDI1NjQ4MCI6InllcyIsIi0xOTUyNTMyNTciOiJ5ZXMiLCItMjEyMzI5NDU1NiI6ImluLXByb2dyZXNzIiwiLTE4MjkzNTYzNjMiOiJ5ZXMiLCItMjUyNDg1NDc1IjoieWVzIiwiLTk1OTMxNzc0NSI6InllcyIsIi0yMDAzNDc2MiI6InllcyIsIi04NDQxNDU0NTEiOiJ5ZXMiLCItMjEwNTMyNjM3NiI6InllcyIsIi0yNjQ3MzM2NzAiOiJ5ZXMiLCItNzgzNTYxMDkiOiJ5ZXMiLCItMTE5Njk4NTk3NyI6InllcyIsIi04MDM0MTg2NDgiOiJ5ZXMiLCItNTc2MjcxMjY2IjoieWVzIiwiLTE0NTY0MTAxOTUiOiJpbi1wcm9ncmVzcyIsIi0xOTI5ODEyOTIxIjoieWVzIiwiLTE3MDYxMjM4OTQiOiJpbi1wcm9ncmVzcyIsIi0xNzc0ODI5NzAxIjoieWVzIiwiLTU0NTc1MDU3MyI6InllcyIsIi03MDMyODI4MTIiOiJ5ZXMiLCItODYzNzY2MzkxIjoieWVzIiwiLTExNTUyNTIwMTYiOiJ5ZXMiLCItNTA1MjQ2MDMyIjoieWVzIiwiLTEyODM4NDYwMDEiOiJ5ZXMiLCItNDA1NTk5Mjc2IjoieWVzIiwiLTEzMjQzNTgxODUiOiJ5ZXMiLCItNjM2NzM2Mzg5IjoieWVzIiwiLTM1Mzc2MDc5IjoieWVzIiwiLTE3MzYxMDQyNTgiOiJ5ZXMiLCItMTczMDk2MDQ2MCI6InllcyIsIi0xOTgzMjEyMjEiOiJ5ZXMiLCItMjA2MDk5NTc5IjoieWVzIiwiLTEzNDQ4NjU0MTMiOiJpbi1wcm9ncmVzcyIsIi0xMDk1OTIxNDIiOiJ5ZXMiLCItMTI5NjA2OTgxIjoieWVzIiwiLTE0MzE1NDU1ODMiOiJpbi1wcm9ncmVzcyIsIi0yMTA5Mjg3NjQ5IjoieWVzIiwiLTU2ODkyMjk4IjoieWVzIiwiLTE0MjczMjY2NDkiOiJ5ZXMiLCItNjQ2ODc5ODY2IjoieWVzIiwiLTE2ODAxMDk1MjkiOiJ5ZXMiLCItMTA0NDU4MDU3MCI6InllcyIsIi0xMDMwNTc2MTUzIjoieWVzIiwiLTQ2OTUxMDcxMyI6InllcyIsIi0xMjI0OTk2ODg3IjoiaW4tcHJvZ3Jlc3MiLCItNjA3ODY4MTcyIjoieWVzIiwiLTE5MzIzNzg4ODgiOiJ5ZXMiLCItMjYyMDQ5MTA1IjoieWVzIiwiLTEzOTgzMDQ2MTgiOiJ5ZXMiLCItMTYxMDA5NTY5IjoieWVzIiwiLTE2NDYxNTgwMDUiOiJpbi1wcm9ncmVzcyIsIi0yNTYzNDY2NyI6ImluLXByb2dyZXNzIiwiLTE5NDYyMDQzODIiOiJpbi1wcm9ncmVzcyIsIi0xNDgwMDk4MzMyIjoiaW4tcHJvZ3Jlc3MiLCItMTAwODEwMjAxNSI6InllcyIsIi0xMjkwNTQ5Njg2IjoiaW4tcHJvZ3Jlc3MiLCItMTM0NTI2Mjk2OSI6InllcyIsIi0xOTcwODYzMTE1IjoieWVzIiwiLTE0MzA3MzQwMDAiOiJ5ZXMiLCItMzU4OTczNjcwIjoieWVzIiwiLTc0OTg0MjkxNyI6InllcyIsIi05NjYzNzcwNzYiOiJ5ZXMiLCItMTMxMjI1NDk4IjoieWVzIiwiLTMyODE4OTQxOSI6InllcyIsIi0zNDczNjA1NzMiOiJ5ZXMiLCItMTYyNTc2NjAyMyI6InllcyIsIi0xNTg4MjczODc1IjoieWVzIiwiLTE5MDEyNjg2NDIiOiJ5ZXMiLCItMTIxNzA2OTMyOSI6InllcyIsIi0zMDA1NDczMTYiOiJ5ZXMiLCItNjM2OTQzNTcxIjoiaW4tcHJvZ3Jlc3MiLCItMTg2NDI4ODY5OCI6InllcyIsIi03NjQ5MTQ0MyI6InllcyIsIi0xNDEyMDg4MTI3IjoieWVzIiwiLTUwNzc3NTkzMiI6InllcyIsIi0xNDI4ODc3MzU4IjoieWVzIiwiLTY5ODExOTIzNSI6InllcyIsIi03MDUwNjgxNTIiOiJpbi1wcm9ncmVzcyIsIi0yODgzMDIxNTQiOiJpbi1wcm9ncmVzcyIsIi0xOTM1ODgyNzAxIjoiaW4tcHJvZ3Jlc3MiLCItMTEzNTI1MjUzMyI6InllcyIsIi0xNzc1Nzk4ODIxIjoieWVzIiwiLTc5MTA1OTA4IjoieWVzIiwiLTEyMjM5NzE2OCI6InllcyIsIi0xNjk3OTU5MDUzIjoieWVzIn0=`;
  const [dataToConvert, updateUrlData] = useState(testData);
  const [compressedData, updateCompressed] = useState("");

  const [compressedChecklistData, updateCompressedChecklistData] = useState("");
  const [decompressedChecklistData, updateDecompressedData] = useState("");

  //decompress and convert
  const [decompressAndConvertedData, updateDecompressAndConvertedData] =
    useState("");
  const [convertData, updateConvertData] = useState("");

  const convertWithState = convert.bind({ updateCompressed });
  const updateDataStoreWithState = updateDataStore.bind({
    updateUrlData,
  });

  const convertEventWithState = convertEvent.bind({
    convert: convertWithState,
    http,
  });

  const decompressData = (data) => {
    const results = decompress(data);
    console.log(results);
    updateDecompressedData(results);
  };

  const updateChecklistCompressedData = (e) => {
    updateCompressedChecklistData(e.target.value);
  };

  const convertAndCompress = (data) => {
    const steps = [(d) => atob(d), (d) => compress(d)];
    const results = steps.reduce((s, c) => c(s), data);
    console.log(data);
    updateDecompressAndConvertedData(results);
  };

  return (
    <div>
      <h2>Convert, Update, and Compress</h2>
      <div>
        <textarea
          onChange={updateDataStoreWithState}
          value={dataToConvert}
        ></textarea>
        <input
          type="button"
          value="convert"
          onClick={() => convertEventWithState(dataToConvert)}
        />
        <div>{compressedData}</div>
      </div>
      <hr />
      <div>
        <h2>Decompress</h2>
        <br />
        <textarea
          onChange={updateChecklistCompressedData}
          value={compressedChecklistData}
        ></textarea>
        <input
          type="button"
          value="convert"
          onClick={() => decompressData(compressedChecklistData)}
        />
        <div>{decompressedChecklistData}</div>
      </div>

      <hr />
      <div>
        <h2>Convert and Compress</h2>
        <br />
        <textarea
          onChange={(e) => updateConvertData(e.target.value)}
          value={convertData}
        ></textarea>
        <input
          type="button"
          value="convert"
          onClick={() => convertAndCompress(convertData)}
        />
        <div>{decompressAndConvertedData}</div>
      </div>
    </div>
  );
}
