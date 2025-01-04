interface MatchParams {
  i: number;
  m: Match;
  onClick: (m: Match, i: number) => void;
}

const PoolPlayMatch = ({ i, m, onClick }: MatchParams) => {
  return (
    <div
      onClick={() => {
        onClick(m, i);
      }}
      key={i}
      className="mb-2 border rounded p-3 team-card w-75"
    >
      <div className="score-input-container">
        <h4 className="mb-0 pb-0">{m.registration1.team.teamName}</h4>
        <span className="fs-5">{m.score1 ?? "-"}</span>
                {/* At some point, include each teams profile picture here */}
        {/* <img
                  src={m.registration1.team.users[1].imageURL && m.registration1.team.users[1].imageURL != "" ? m.registration1.team.users[1].imageURL : "/icons/user.svg"}
                  width="40"
                  height="40"
                  className="me-3 rounded-circle"
                /> */} 
      </div>
      <div className="score-input-container mb-0 pb-0">
        <h4 className="mb-0 pb-0">{m.registration2.team.teamName}</h4>
        <span className="fs-5">{m.score2 ?? "-"}</span>
      </div>
    </div>
  );
};

export default PoolPlayMatch;
