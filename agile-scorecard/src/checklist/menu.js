import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";

import "./css/menu.css";

function exportData(getData) {
  const data = getData();
  const serializedData = JSON.stringify(data);
  const blob = new Blob([serializedData], { type: "application/data" });
  window.open(URL.createObjectURL(blob));
}

function copyUrl() {
  const href = window.location.href;
  navigator.clipboard.writeText(href);
}

export default function Menu(props) {
  const parameters = useParams();
  const uploadReference = React.useRef(null);
  const name = props.name;
  const data = props.data || parameters.data;
  const getData = props.getData;
  const disabled = props.disabled;

  const handleFileSelected = (e) => {
    const files = Array.from(e.target.files);

    let reader = new FileReader();

    reader.onload = (e) => {};

    reader.readAsText(files[0]);
  };

  return (
    <div data-menu>
      <label htmlFor="toggle-menu" data-menu-hamburger>
        <FontAwesomeIcon icon={faBars} />
      </label>
      <input
        type="checkbox"
        id="toggle-menu"
        name="toggle-menu"
        data-toggle-menu-checkbox
        key="toggle-menu"
      />
      <div data-menu-options>
        <Link
          to={`/report/${name}/${data}`}
          disabled={disabled}
          data-transfer-link={!disabled}
        >
          Display Report
        </Link>
        <Link
          to={`/survey/${name}/${data}`}
          disabled={disabled}
          data-transfer-link={!!disabled}
          data-link
        >
          Display Survey
        </Link>

        <hr></hr>

        <button type="button" onClick={() => exportData(getData)}>
          Export Data
        </button>
        <input
          type="file"
          ref={uploadReference}
          onChange={handleFileSelected}
        ></input>

        <button type="button" onClick={() => uploadReference.current.click()}>
          Load Data
        </button>
        <button type="button" onClick={() => copyUrl()}>
          Copy URL
        </button>
      </div>
    </div>
  );
}
