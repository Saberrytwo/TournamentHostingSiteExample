import "./BracketSeeder.css";
export const Grid = ({ columns, children }) => {
  return (
    <div
      className="grid-Pool"
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridGap: 5,
        width: "700px",
        minHeight: "100px",
        height: "fit-content",
      }}
    >
      {children}
    </div>
  );
};
