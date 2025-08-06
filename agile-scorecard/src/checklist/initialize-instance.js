import {
  makeHeader,
  updateStateDetermineNavigate,
  convertAndParse,
  updateDataObject,
  convertForUrl,
} from "./instrument";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getInstrument } from "../utilities/surveyData";
import { createInstanceId } from "../utilities/identifiers";
import { useHistory, useLocation } from "react-router-dom";
import { array, number } from "prop-types";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { functionReducer } from "../utilities/reducer";

function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

async function createEncryptionKey(privateKey) {
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: "RSA-OAEP",
      modulusLength: 2048,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: "SHA-256",
    },
    true,
    ["encrypt", "decrypt"]
  );

  const exported = await window.crypto.subtle.exportKey(
    "spki",
    keyPair.publicKey
  );
  const exportedAsString = ab2str(exported);
  const exportedAsBase64 = window.btoa(exportedAsString);
  const pemExported = `-----BEGIN PUBLIC KEY-----\n${exportedAsBase64}\n-----END PUBLIC KEY-----`;

  console.log(pemExported);

  return "";
}

export function InitializeInstance({ http }) {
  createEncryptionKey("tesdfsdfst");

  return <></>;
}
