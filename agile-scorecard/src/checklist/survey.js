import React from "react";
import { Instrument } from "./instrument";
import "./css/main.css";

import "./css/survey.css";

export function Survey(props) {
  return <Instrument http={props.http} />;
}
