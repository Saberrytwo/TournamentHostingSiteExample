import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import "./BracketSeeder.css";
import { Grid } from "./Grid";
import { RegistrationCard } from "./RegistrationCard";

type Registration = {
  id: string | number;
  name: string | number;
  groupId: string | number;
  groupName: string | number;
};

export const RegistrationBank = (props: { registrations; title; id; randomizeTeams }) => {
  const { registrations, title, id, randomizeTeams } = props;
  const { setNodeRef } = useDroppable({
    id: id,
    data: { type: "Column", id: id },
  });

  return (
    <div className="bank-container">
      <div className="bank-header">
        <div className="bank-header-left">
          <div className="chip">{registrations.length}</div>
          <div>{title}</div>
        </div>
        <button type="button" className="btn btn-primary-blue header-btn" onClick={randomizeTeams}>
          Randomize
        </button>
      </div>
      <SortableContext items={registrations} id={id} strategy={rectSortingStrategy}>
        <div className="bank-body" ref={setNodeRef}>
          <Grid columns={2}>
            {registrations.map((r: Registration) => (
              <RegistrationCard key={r.id} registration={r} />
            ))}
          </Grid>
        </div>
      </SortableContext>
    </div>
  );
};
