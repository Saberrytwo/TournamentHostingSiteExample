import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./BracketSeeder.css";

interface RegistationCardProps {
  registration: any;
}

export const RegistrationCard = (props: RegistationCardProps) => {
  const { registration } = props;

  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: registration.id,
    data: { type: "registration", registration },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging)
    return (
      <div ref={setNodeRef} style={{ ...style, opacity: "60%" }} className="registration-item">
        {registration.name}
      </div>
    );

  return (
    <div className="registration-item" ref={setNodeRef} style={style} {...attributes} {...listeners}>
      {registration.name}
    </div>
  );
};
