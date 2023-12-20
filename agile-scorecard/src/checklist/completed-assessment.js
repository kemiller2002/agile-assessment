import { useLocation } from "react-router";

import { convertAndParse } from "./checklist";
import { useParams } from "react-router";

function copyUrl(urlToSend) {
  navigator.clipboard.writeText(urlToSend);
}

export function buildUrl(reactLocation, window) {
  const parts = reactLocation.pathname.split("/");
  const linkUrlPathName = reactLocation.pathname.replace(parts[1], "survey");
  const regex = new RegExp(`/${parts[1]}.*`);
  const location = window.location;
  const newPath = location.pathname.replace(regex, linkUrlPathName);

  return `${location.protocol}//${location.host}${newPath}`;
}

function getAdministrator(data) {
  return data.administrator;
}

export function CompletedAssessment() {
  const location = useLocation();
  const parameters = useParams();
  const urlToSend = buildUrl(location, window);

  const data = convertAndParse(parameters.data);
  const administrator = getAdministrator(data) || "the administrator";

  return (
    <div data-container>
      <div data-spacer></div>
      <div data-complete-assessment-container>
        <h1 data-prepare-for-processing>Prepare for Processing</h1>
        <h2>Next Steps</h2>
        <div>
          <ol>
            <li>Copy the following Url.</li>
            <li>
              Send it to <span data-admin>{administrator}</span> for processing.
            </li>
          </ol>
        </div>

        <div data-complete-url-container>
          <div data-url-to-send-completed>
            <div data-spacer></div>
            <div>{urlToSend}</div>
            <div data-spacer></div>
          </div>
          <div>
            <button
              data-copy-url
              type="button"
              onClick={() => copyUrl(urlToSend)}
            >
              Copy URL
            </button>
          </div>
        </div>
      </div>
      <div data-spacer></div>
    </div>
  );
}
