import React from "react";
import { Instrument } from "./instrument";
import "./css/main.css";

export function Report(props) {
  return <Instrument http={props.http} disabled={true} />;
}
