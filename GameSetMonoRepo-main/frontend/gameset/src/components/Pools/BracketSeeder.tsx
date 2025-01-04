import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  DropAnimation,
  MouseSensor,
  PointerSensor,
  defaultDropAnimation,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  useCreateBracketMutation,
  useInitializeBracketSeedsMutation,
  useListRegistrationsByTournamentDivisionIDQuery,
  useSetBracketSeedsMutation,
} from "../../store/apis/tournamentApi";
import "./BracketSeeder.css";
import { ColumnContainer } from "./ColumnContainer";
import { RegistrationBank } from "./RegistrationBank";
import { RegistrationCard } from "./RegistrationCard";

type Registration = {
  id: string | number;
  name: string | number;
  groupId: string | number;
  groupName: string | number;
  bracketSeed: number | null;
};

export const BracketSeeder = () => {
  const { divisionID, tournamentID } = useParams();
  const groupsRegistrations = useListRegistrationsByTournamentDivisionIDQuery({
    TournamentDivisionID: parseInt(divisionID),
  });
  const initialState: { [key: string]: any[] } = { "00000000-0000-0000-0000-000000000000": [], seeded: [] };

  const [registrationLists, setRegistrationLists] = useState<{ [key: string]: Registration[] }>(initialState);

  const [initializeBracketSeeds] = useInitializeBracketSeedsMutation();
  const [setBracketSeeds] = useSetBracketSeedsMutation();
  const [createBracketEndpoint] = useCreateBracketMutation();
  const navigate = useNavigate();

  const setBracket = async () => {
    await setBracketSeeds({
      tournamentDivisionID: divisionID,
      RegistrationIDs: registrationLists["seeded"].map((x) => (typeof x.id === "number" ? x.id : parseInt(x.id))),
    })
      .unwrap()
      .then(() => {
        toast.success("Tournament seeds successfully saved", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
  };

  useEffect(() => {
    initializeBracketSeeds({ tournamentDivisionID: divisionID });
  }, [divisionID]);

  useEffect(() => {
    if (groupsRegistrations.status === "fulfilled") {
      setRegistrationLists({ "00000000-0000-0000-0000-000000000000": [], seeded: [] });
      groupsRegistrations.data.forEach((registration) => {
        if (registration.bracketSeed === null) {
          initialState["00000000-0000-0000-0000-000000000000"].push({
            id: registration.registrationID,
            name: registration.team.teamName,
          });
        } else {
          initialState["seeded"].push({
            id: registration.registrationID,
            name: registration.team.teamName,
          });
        }
        setRegistrationLists(initialState);
      });
    }
  }, [groupsRegistrations.data]);

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

  function shuffle(array) {
    let currentIndex = array.length,
      randomIndex;
    while (currentIndex > 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
      [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
  }

  const randomizeTeams = () => {
    const shuffledArray = shuffle(registrationLists["00000000-0000-0000-0000-000000000000"]);
    const newSeeded = [...registrationLists["seeded"], ...shuffledArray];
    setRegistrationLists(() => ({
      "00000000-0000-0000-0000-000000000000": [],
      seeded: newSeeded,
    }));
  };

  const clearTeams = () => {
    setRegistrationLists(() => ({
      "00000000-0000-0000-0000-000000000000": [
        ...registrationLists["00000000-0000-0000-0000-000000000000"],
        ...registrationLists["seeded"],
      ],
      seeded: [],
    }));
  };

  const [activeRegistration, setActiveRegistration] = useState<Registration>(null);

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

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const findRegistrationList = (RegistraionLists: any, id: string) => {
    if (id in RegistraionLists) {
      return id;
    }

    const container = Object.keys(RegistraionLists).find((key) => RegistraionLists[key].find((item) => item.id === id));
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

  const createBracket = async () => {
    const newPath = window.location.pathname.replace(/\/[^/]*$/, "/bracket");
    await createBracketEndpoint({ TournamentDivisionID: parseInt(divisionID) })
      .unwrap()
      .then(() => {
        toast.success("Bracket successfully published", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      });
    navigate("/tournament/" + tournamentID + "/bracket/" + divisionID);
  };

  const dropAnimation: DropAnimation = {
    ...defaultDropAnimation,
  };

  return (
    <>
      <div className="my-2 d-flex flex-row justify-content-end buttons-container">
        <button onClick={setBracket} className="btn btn-reverse-primary ms-4 me-2">
          Save Seeds
        </button>
        <button
          className="btn btn-primary-blue"
          onClick={() => {
            createBracket();
          }}
        >
          Publish Bracket
        </button>
      </div>
      <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd} onDragOver={onDragOver} sensors={sensors}>
        <div className="columns">
          {Object.keys(registrationLists).map((key, index) =>
            key === "seeded" ? (
              <ColumnContainer
                key={key}
                id={key}
                title={index === 0 ? "Unassigned" : String.fromCharCode(64 + index)}
                registrations={registrationLists[key]}
                clearTeams={clearTeams}
              />
            ) : (
              <RegistrationBank
                key={key}
                id={key}
                title="Registration Bank"
                registrations={registrationLists[key]}
                randomizeTeams={randomizeTeams}
              />
            )
          )}
        </div>
        <DragOverlay dropAnimation={dropAnimation}>
          {activeRegistration ? (
            <>
              <RegistrationCard registration={activeRegistration} />{" "}
            </>
          ) : null}
        </DragOverlay>
      </DndContext>
    </>
  );
};
