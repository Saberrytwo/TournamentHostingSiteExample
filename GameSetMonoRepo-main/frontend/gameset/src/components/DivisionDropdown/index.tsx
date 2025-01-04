
import { useParams } from "react-router-dom"
import { useListTournamentDivisionsQuery } from "../../store/apis/tournamentApi";
import { DivisionSelectorInput } from "../Forms";
import { useNavigate } from "react-router-dom";



export const DivisionDropdown = ({ tournamentPage }) => {
    const { tournamentID } = useParams();
    const navigate = useNavigate();

    const { data: tournamentDivisions, isLoading } = useListTournamentDivisionsQuery({
        TournamentID: Number(tournamentID),
    });

    return (
        <div className="text-nowrap">
            {!isLoading && tournamentDivisions !== undefined ? (
                <div className="score-input-container">
                    <h3 className="pt-2">Select Division: </h3>
                    <DivisionSelectorInput
                        width=""
                        label=" "
                        onChange={(e) => navigate('/tournament/' + tournamentID + "/tournamentdivisionID/" + e.target.value + "/" + tournamentPage)}
                        options={tournamentDivisions.map((x) => ({
                            name: x.division.divisionName,
                            id: x.tournamentDivisionID.toString(),
                        }))}
                    />
                </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}