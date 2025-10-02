import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div className="not-found-container">
      <h1>Parece que te has perdido...</h1>

      <img
        src="src/img/notfound.png"
        alt="404 Not Found"
        className="not-found-image"
      />

      <div className="back-home">
        <Link to="/">Volver al inicio</Link>
      </div>
    </div>
  );
}

export default NotFound;