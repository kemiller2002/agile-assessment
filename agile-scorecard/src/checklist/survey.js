import React from "react";
import Checklist from "./checklist";
import "./css/survey.css";

export function Survey(props) {
  return <Checklist http={props.http} />;
}
