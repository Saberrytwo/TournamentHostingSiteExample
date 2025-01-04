import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MouseSensor,
  PointerSensor,
  defaultDropAnimation,
  useDroppable,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCreatePoolPlayMatchesMutation,
  useListGroupsRegistrationsQuery,
  useUpdateGroupsMutation,
} from "../../store/apis/tournamentApi";
import { Loader } from "../Loader";
import "./index.css";

type Registration = {
  id: string | number;
  name: string | number;
  groupID: string | number;
  groupName: string | number;
};

export const Pools = () => {
  const { divisionID, tournamentID } = useParams();
  const [updateGroups, { isLoading }] = useUpdateGroupsMutation();
  const [createMatches] = useCreatePoolPlayMatchesMutation();
  const {
    data: groupsRegistrations,
    isLoading: groupsLoading,
    status: groupsStatus,
  } = useListGroupsRegistrationsQuery({
    TournamentID: parseInt(divisionID),
  });
  let initialState: { [key: string]: any[] } = { "00000000-0000-0000-0000-000000000000": [] };
  const [activeRegistration, setActiveRegistration] = useState<Registration>(null);
  const navigate = useNavigate();

  const [registrationLists, setRegistrationLists] = useState<{ [key: string]: Registration[] }>(initialState);
  useEffect(() => {
    if (groupsStatus === "fulfilled") {
      const initialStateCopy = { ...initialState }; // Create a copy to avoid mutating state directly
      groupsRegistrations.groupList.forEach((group) => {
        initialStateCopy[group.groupID] = [];
      });
      groupsRegistrations.registrationList.forEach((registration) => {
        if (registration.groupID === null) {
          initialStateCopy["00000000-0000-0000-0000-000000000000"].push({
            id: registration.registrationID,
            name: registration.team.teamName,
            groupId: "00000000-0000-0000-0000-000000000000",
            groupName: "unassigned",
          });
        } else {
          initialStateCopy[registration.groupID].push({
            id: registration.registrationID,
            name: registration.team.teamName,
            groupId: registration.groupID,
            // groupName: registration.group.groupName,
          });
        }
      });
      setRegistrationLists(initialStateCopy);

      return () => {
        // unmount data here
      };
    }
  }, [groupsRegistrations]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 5,
        tolerance: 5,
      },
    })
  );

  const createNewColumn = () => {
    const UUID = window.crypto.randomUUID();
    setRegistrationLists((registrationLists) => ({
      ...registrationLists,
      [UUID]: [],
    }));
  };

  const deleteLastColumn = () => {
    const newState = { ...registrationLists };
    newState["00000000-0000-0000-0000-000000000000"] = [
      ...registrationLists["00000000-0000-0000-0000-000000000000"],
      ...registrationLists[Object.keys(registrationLists)[Object.keys(registrationLists).length - 1]],
    ];
    delete newState[Object.keys(registrationLists)[Object.keys(registrationLists).length - 1]];
    setRegistrationLists(newState);
  };

  const submitGroups = () => {
    const body = {
      tournamentDivisionID: divisionID,
      groups: [],
    };

    Object.entries(registrationLists).forEach(([key, value]) => {
      body.groups.push({ [key]: value.map((reg) => reg.id) });
    });

    // Return the promise chain so it can be awaited outside.
    return updateGroups(body)
      .unwrap()
      .then(() => {
        notifyPoolUpdateSuccess();
      })
      .catch((error) => {
        notifyPoolUpdateError();
        // Consider re-throwing the error if you want to handle it further up the chain, like in publishPools.
        throw error;
      });
  };

  const notifyPoolUpdateSuccess = () => {
    toast.success("Your pools were successfully updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const notifyPoolUpdateError = () => {
    toast.error("An error occurred while updating your pools", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });
  };

  const publishPools = async () => {
    await submitGroups();
    await createMatches({ tournamentDivisionID: divisionID });
    navigate("/tournament/" + tournamentID + "/pool/" + divisionID);
  };

  const onDragStart = (event: DragStartEvent) => {
    const activeReg: Registration = structuredClone(event.active.data.current?.registration);
    setActiveRegistration(activeReg);
  };

  const onDragEnd = ({ active, over }: DragEndEvent) => {
    const activeContainer = findRegistrationList(registrationLists, active.id as string);
    const overContainer = findRegistrationList(registrationLists, over?.id as string);

    if (!activeContainer || !overContainer || activeContainer !== overContainer) {
      return;
    }

    const activeIndex = registrationLists[activeContainer].findIndex((registration) => registration.id === active.id);
    const overIndex = registrationLists[overContainer].findIndex((registration) => registration.id === over?.id);

    if (activeIndex !== overIndex) {
      setRegistrationLists((boardSection) => ({
        ...boardSection,
        [overContainer]: arrayMove(boardSection[overContainer], activeIndex, overIndex),
      }));
    }

    setActiveRegistration(null);
  };

  const findRegistrationList = (RegistrationLists: any, id: string) => {
    if (id in RegistrationLists) {
      return id;
    }

    const container = Object.keys(RegistrationLists).find((key) =>
      RegistrationLists[key].find((item) => item.id === id)
    );
    return container;
  };

  const onDragOver = ({ over, active }) => {
    const activeKey = findRegistrationList(registrationLists, active.id);
    const overKey = findRegistrationList(registrationLists, over?.id);
    if (!activeKey || !overKey || activeKey === overKey) {
      return;
    }

    setRegistrationLists((registrationList) => {
      const activeItems = registrationList[activeKey];
      const overItems = registrationList[overKey];
      const activeIndex = activeItems.findIndex((item) => item.id === active.id);
      const overIndex = overItems.findIndex((item) => item.id !== over?.id);

      return {
        ...registrationList,
        [activeKey]: [...registrationList[activeKey].filter((item) => item.id !== active.id)],
        [overKey]: [
          ...registrationList[overKey].slice(0, overIndex),
          registrationLists[activeKey][activeIndex],
          ...registrationList[overKey].slice(overIndex, registrationList[overKey].length),
        ],
      };
    });
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <>
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
        <div className="column-parent">
          <div className="pools-header-pool">
            <div className="d-flex">
              <div className="pools-title me-3">Create Pools </div>
              <button
                className="btn btn-primary-blue border rounded-circle font-weight-bold minus-btn me-1"
                onClick={deleteLastColumn}
              >
                -
              </button>
              <button
                className="btn btn-primary-blue border rounded-circle font-weight-bold plus-btn"
                onClick={createNewColumn}
              >
                +
              </button>
            </div>

            <div className="pools-actions me-4">
              <button className="btn btn-reverse-primary me-3" onClick={submitGroups}>
                {!isLoading ? (
                  "Save Changes"
                ) : (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    <span className="sr-only">Loading...</span>
                  </>
                )}
              </button>
              <button
                onClick={publishPools}
                disabled={registrationLists["00000000-0000-0000-0000-000000000000"].length !== 0}
                className="btn btn-primary-blue"
              >
                Publish Pools
              </button>
            </div>
          </div>
          {isLoading ? (
            <Loader styles={{ width: "100%", height: "100%" }} />
          ) : (
            <div className="column-row">
              <div className="columncontainer-container">
                <ColumnContainer
                  key={"00000000-0000-0000-0000-000000000000"}
                  id={"00000000-0000-0000-0000-000000000000"}
                  title={"Unassigned"}
                  registrations={registrationLists["00000000-0000-0000-0000-000000000000"]}
                />
              </div>
              <div className="columns">
                {Object.keys(registrationLists).map((key, index) =>
                  index > 0 ? (
                    <ColumnContainer
                      key={key}
                      id={key}
                      title={String.fromCharCode(64 + index)}
                      registrations={registrationLists[key]}
                    />
                  ) : (
                    ""
                  )
                )}
              </div>
            </div>
          )}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeRegistration ? <RegistrationCard registration={activeRegistration} /> : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};

interface ColumnProps {
  registrations: Registration[];
  title: string;
  id: string;
}

const ColumnContainer = (props: ColumnProps) => {
  const { registrations, title, id } = props;
  const { setNodeRef } = useDroppable({
    id: id,
    data: { type: "Column", id: id },
  });

  return (
    <div className="column-container">
      <div className="column-header">
        <div className="chip">{registrations.length}</div>
        <div>{title}</div>
      </div>
      <SortableContext items={registrations} id={id} strategy={rectSortingStrategy}>
        <div className="column-body" ref={setNodeRef}>
          {registrations.map((r: any) => (
            <RegistrationCard key={r.id} registration={r} />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

interface RegistationCardProps {
  registration: any;
}

const RegistrationCard = (props: RegistationCardProps) => {
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
