import "./index.css";
export const Loader = ({ styles = {}, className = "" }) => {
  const classNames = "spinner-container d-flex justify-content-center align-items-center" + className;
  return (
    <div className="spinner-container d-flex justify-content-center align-items-center" style={styles}>
      <div className="spinner-border custom-spinner" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};
