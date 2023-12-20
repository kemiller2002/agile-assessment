import { useLocation } from "react-router";

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

export function CompletedAssessment() {
  const location = useLocation();
  const urlToSend = buildUrl(location, window);

  return (
    <div data-complete-assessment-container>
      <h1 data-prepare-for-processing>Prepare for processing</h1>
      <h2>Almost Complete</h2>
      <h3>Next Steps</h3>
      <div>
        <ol>
          <li>Copy the following Url.</li>
          <li>Send it to the administrator for processing.</li>
        </ol>
      </div>

      <div data-complete-url-container>
        <div data-url-to-send-completed>{urlToSend}</div>
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
  );
}
