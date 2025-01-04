import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppSelector } from "../../hooks/hooks";
import { useGetTeamByTeamIDQuery, useUpdateTeamMutation } from "../../store/apis/teamApi";
import { useGetUsersQuery } from "../../store/apis/userApi";
import { Form, FormRow, SearchInput, TextAreaInput, TextInput } from "../Forms/index";
import "./index.css";

export const UpdateTeam = () => {
  const { teamID } = useParams();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [searchFakeValue, setSearchFakeValue] = useState("");
  const [listPlayers, setListPlayers] = useState<AutoCompleteSuggestion[]>([]);
  const [teamName, setTeamName] = useState("");
  const [teamBio, setTeamBio] = useState("");
  const [searchSug, setSearchSug] = useState<AutoCompleteSuggestion[]>([]);
  const [suggestionBank, setSuggestionBank] = useState<AutoCompleteSuggestion[]>([]);
  const [owner, setOwner] = useState<User | undefined>();
  const [submitting, setSubmitting] = useState(false);
  const [updateTeam] = useUpdateTeamMutation();

  const user = useAppSelector((state) => state.auth.user);
  const { data: users, isLoading: isLoading } = useGetUsersQuery({});
  const { data: team, isLoading: isTeamLoading } = useGetTeamByTeamIDQuery({
    TeamID: Number(teamID),
  });

  useEffect(() => {
    if (!isLoading && users) {
      const newSuggestions = users.map((user: User) => ({
        item_id: user.userID,
        main_text: user.firstName + " " + user.lastName,
        secondary_text: user.userName,
      }));
      setSuggestionBank(newSuggestions);
      setSearchSug(newSuggestions);
    }
  }, [isLoading, users]);

  useEffect(() => {
    filterSuggestions(searchFakeValue);
  }, [searchFakeValue]);

  useEffect(() => {
    if (!isTeamLoading && team) {
      setTeamName(team.team.teamName);
      setTeamBio(team.team.teamDescription || "");
      setOwner(
        team.userTeamStatuses?.filter((u: UserTeamStatus) => u.status === "Owner").map((u: UserTeamStatus) => u.user)[0]
      );
      let newListPlayers = team.userTeamStatuses
        ?.filter((u: UserTeamStatus) => u.status !== "Owner")
        .map((u: UserTeamStatus) => ({
          item_id: u.user.userID,
          main_text: u.user.firstName + " " + u.user.lastName,
          secondary_text: u.user.userName,
          other_info: u.user.imageURL,
        }));
      setListPlayers(newListPlayers ?? []);
    }
  }, [isTeamLoading, team]);

  const filterSuggestions = (userInput: string) => {
    const newSug: AutoCompleteSuggestion[] = suggestionBank.filter((suggestion) => {
      const mainTextMatch = suggestion.main_text.toLowerCase().includes(userInput.toLowerCase());
      const secondaryTextMatch = suggestion.secondary_text.toLowerCase().includes(userInput.toLowerCase());
      return mainTextMatch || secondaryTextMatch;
    });
    setSearchSug(newSug);
  };

  const handleAddPlayer = () => {
    const playerIDElement = document.getElementsByName("hiddenSearch")[0] as HTMLInputElement;
    const playerID = playerIDElement.value;
    if (
      playerID != "" &&
      listPlayers.filter((user) => user.item_id === playerID).length === 0 &&
      playerID != user.userID
    ) {
      const matchingUser = suggestionBank.filter((user) => user.item_id === playerID);
      setListPlayers([...listPlayers, matchingUser[0]]);
    }
  };
  const handleRemovePlayer = (playerID: string) => {
    const newListPlayers = listPlayers.filter((user) => user.item_id !== playerID);
    setListPlayers(newListPlayers);
  };
  const handleSubmit = async () => {
    try {
      setSubmitting(true);

      const team: Team = {
        teamID: Number(teamID),
        teamName: teamName,
        teamDescription: teamBio,
        public: true,
        imageUrl: "",
        users: [],
      };
      const userIDs: string[] = listPlayers.map((item) => item.item_id);
      if (team && user.userID && userIDs) {
        const formData = { Team: team, UserIDs: userIDs };
        updateTeam(formData)
          .unwrap()
          .then(() => {
            notifyTeamUpdateSuccess();
          })
          .then(() => {
            navigate("/teams");
          })
          .catch(() => {
            notifyTeamUpdateError();
          });
      }
    } catch (error) {
      toast.error("An error occurred while creating your team", {
        position: "top-right",
        autoClose: false,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      // Handle error
    } finally {
      setSubmitting(false);
    }
  };

  const notifyTeamUpdateSuccess = () =>
    toast.success("Your team was successfully updated", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  const notifyTeamUpdateError = () =>
    toast.error("An error occurred while updating your team", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  return (
    <div className="mt-4">
      <div className="d-flex justify-content-center mt-5">
        <h1>Update Team</h1>
      </div>
      {!isTeamLoading && (
        <Form>
          <div className="create-team w-100">
            <div className="main-team-div">
              <h3 className="mx-auto">Team Info</h3>
              <FormRow>
                <TextInput required={true} label="Team Name" value={teamName} setValue={setTeamName} />
              </FormRow>
              <div className="mt-3"></div>
              <FormRow>
                <TextAreaInput label="Bio" value={teamBio} setValue={setTeamBio} />
              </FormRow>
              <br />
              <br />
              <div className="mt-3">
                <h4>Invite Players</h4>
                <FormRow>
                  <SearchInput
                    value={searchValue}
                    setValue={setSearchValue}
                    fakeValue={searchFakeValue}
                    setFakeValue={setSearchFakeValue}
                    possibleSuggestions={searchSug}
                  />
                  <button type="button" onClick={handleAddPlayer} className="btn btn-primary-blue">
                    Add
                  </button>
                </FormRow>
              </div>
            </div>
            <div className="border ms-5 me-4 mobile-border-off"></div>
            <div className="player-mobile">
              <h3>Players</h3>
              <div className="d-flex flex-column">
                {owner && (
                  <div className="d-flex">
                    <img
                      src={owner.imageURL && owner.imageURL != "" ? owner.imageURL : "/icons/user.svg"}
                      width="60"
                      height="60"
                      className="rounded-circle"
                    />
                    <div className="ms-3">
                      <h4 className="mb-0">
                        {owner.firstName || owner.userName} {owner.lastName}
                      </h4>
                      <input type="hidden" value={owner.userID} />
                      <div>Owner</div>
                    </div>
                  </div>
                )}
                {listPlayers.map((player) => (
                  <div className="d-flex mt-3" key={player.item_id}>
                    <img
                      src={player.other_info && player.other_info != "" ? player.other_info : "/icons/user.svg"}
                      width="60"
                      height="60"
                      className="rounded-circle"
                      alt="User"
                    />
                    <div className="ms-3">
                      <div className="d-flex">
                        <h4 className="mb-0">{player.main_text}</h4>
                        <img
                          className="ms-2 clickable"
                          src="/icons/trash.svg"
                          width="28"
                          onClick={() => handleRemovePlayer(player.item_id)}
                        />
                      </div>
                      <div>Active</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="d-flex justify-content-center my-5">
            <button type="button" className="btn btn-danger me-3" onClick={() => navigate("/teams")}>
              Cancel
            </button>
            <button type="button" className="btn btn-primary-blue" disabled={submitting} onClick={handleSubmit}>
              Save Team
            </button>
          </div>
        </Form>
      )}
    </div>
  );
};
