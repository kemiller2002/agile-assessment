import { Link, useParams } from "react-router-dom";

export function SomethingWentWrong() {
  const params = useParams();
  const name = params.name;

  return (
    <div>
      <h2>Something went wrong.</h2>

      <div>
        <Link to={`/survey/${name}`}>Return to assessment</Link>
      </div>
    </div>
  );
}
