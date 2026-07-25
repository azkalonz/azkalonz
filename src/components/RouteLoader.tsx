const RouteLoader = () => (
  <div
    className="route-loading"
    role="status"
    aria-live="polite"
    aria-label="Loading page"
  >
    <div className="route-loading__terminal" aria-hidden="true">
      <p className="route-loading__command">
        <span>$</span> route.load
      </p>
      <p className="route-loading__status">
        <span aria-hidden="true">&gt;</span>
        loading page
        <i className="route-loading__cursor" />
      </p>
    </div>
  </div>
);

export default RouteLoader;
