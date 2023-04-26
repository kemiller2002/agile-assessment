import React from "react";
import { Checklist } from "./checklist";
import "./css/main.css";
import "./css/report.css";

export function Report(props) {
  return <Checklist http={props.http} disabled={true} />;
}
