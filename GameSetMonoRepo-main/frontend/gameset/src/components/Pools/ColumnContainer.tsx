import { useDroppable } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { RegistrationCard } from "./RegistrationCard";
import "./BracketSeeder.css";

interface ColumnProps {
  registrations: Registration[];
  title: string;
  id: string;
  clearTeams: any;
}

type Registration = {
  id: string | number;
  name: string | number;
  groupId: string | number;
  groupName: string | number;
};

export const ColumnContainer = (props: ColumnProps) => {
  const { registrations, title, id, clearTeams } = props;
  const { setNodeRef } = useDroppable({
    id: id,
    data: { type: "Column", id: id },
  });

  return (
    <div className="column-container">
      <div className="column-header">
        <div className="bank-header-left">
          <div className="chip">{registrations.length}</div>
          <div>{title}</div>
        </div>
        <button type="button" className="btn btn-danger header-btn" onClick={clearTeams}>
          Clear
        </button>
      </div>
      <SortableContext items={registrations} id={id} strategy={rectSortingStrategy}>
        <div className="column-body" ref={setNodeRef}>
          {registrations.map((r: Registration, index) => (
            <div className="ordered-list-seeds">
              <div className="seed">{index + 1}</div>
              <RegistrationCard key={r.id} registration={r} />
            </div>
          ))}
        </div>
      </SortableContext>
    </div>
  );
};
